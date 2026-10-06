<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Project;
use App\Models\Issue;
use App\Models\IssueActivity;

class SuperAdminController extends Controller
{
    public function dashboardData()
    {
        // Compute project progress to categorize projects
        $allProjects = Project::with(['issues.column', 'owner', 'members'])->get();
        $activeProjectsCount = 0;
        $completedProjectsCount = 0;
        $delayedProjectsCount = 0;

        $alerts = [];

        foreach ($allProjects as $project) {
            $tasksCount = $project->issues->count();
            $completedTasks = $project->issues->filter(function($i) { return $i->column && $i->column->name === 'Done'; })->count();
            $overdueTasks = $project->issues->filter(function($i) { return $i->deadline && $i->deadline < now() && ($i->column && $i->column->name !== 'Done'); })->count();
            $progress = $tasksCount > 0 ? round(($completedTasks / $tasksCount) * 100) : 0;

            if ($progress == 100 && $tasksCount > 0) {
                $completedProjectsCount++;
            } else {
                $activeProjectsCount++;
                if ($project->deadline && \Carbon\Carbon::parse($project->deadline)->isPast()) {
                    $delayedProjectsCount++;
                    $alerts[] = ['type' => 'danger', 'message' => "🔴 {$project->name} is overdue"];
                } elseif ($project->deadline && \Carbon\Carbon::parse($project->deadline)->gt(now()) && \Carbon\Carbon::parse($project->deadline)->diffInDays(now()) <= 3) {
                    $days = now()->diffInDays(\Carbon\Carbon::parse($project->deadline));
                    $alerts[] = ['type' => 'warning', 'message' => "🟡 {$project->name} deadline in {$days} days. " . (100 - $progress) . "% tasks remaining"];
                }
            }

            if ($overdueTasks > 0) {
                $alerts[] = ['type' => 'danger', 'message' => "🔴 {$overdueTasks} tasks overdue in {$project->name} project"];
            }
        }

        // Calculate Stats
        $stats = [
            'totalProjects' => $allProjects->count(),
            'activeProjects' => $activeProjectsCount,
            'completedProjects' => $completedProjectsCount,
            'delayedProjects' => $delayedProjectsCount,
            'totalManagers' => User::where('role', 'manager')->count(),
            'totalMembers' => User::where('role', 'member')->count(),
            'totalTasks' => Issue::count(),
            'pending' => Issue::whereHas('column', function($q) { $q->where('name', 'To Do'); })->count(),
            'inProgress' => Issue::whereHas('column', function($q) { $q->where('name', 'In Progress'); })->count(),
            'completed' => Issue::whereHas('column', function($q) { $q->where('name', 'Done'); })->count(),
            'overdue' => Issue::whereNotNull('deadline')->where('deadline', '<', now())->whereHas('column', function($q) { $q->where('name', '!=', 'Done'); })->count(),
        ];

        // Managers Data
        $managersData = User::where('role', 'manager')->with(['projects.issues.column', 'projects.members'])->get()->map(function($manager) use (&$alerts) {
            $projectsCount = $manager->projects->count();
            $membersCount = $manager->projects->flatMap->members->unique('id')->count();
            $tasksCount = $manager->projects->flatMap->issues->count();
            $completedTasksCount = $manager->projects->flatMap->issues->filter(function($issue) {
                return $issue->column && $issue->column->name === 'Done';
            })->count();
            $pendingTasksCount = $manager->projects->flatMap->issues->filter(function($issue) {
                return $issue->column && $issue->column->name === 'To Do';
            })->count();
            $progress = $tasksCount > 0 ? round(($completedTasksCount / $tasksCount) * 100) : 0;
            
            if ($pendingTasksCount >= 8) {
                $alerts[] = ['type' => 'warning', 'message' => "🟡 {$manager->name}'s projects have {$pendingTasksCount} pending tasks"];
            }

            $status = '🟢 On Track';
            if ($progress == 100 && $tasksCount > 0) $status = '✅ Completed';
            elseif ($progress < 50 && $tasksCount > 0) $status = '🟡 At Risk';

            $projectsDetails = $manager->projects->map(function($project) {
                $pTasksCount = $project->issues->count();
                $pCompletedTasks = $project->issues->filter(function($i) { return $i->column && $i->column->name === 'Done'; })->count();
                $pPendingTasks = $project->issues->filter(function($i) { return $i->column && $i->column->name === 'To Do'; })->count();
                $pOverdueTasks = $project->issues->filter(function($i) { return $i->deadline && $i->deadline < now() && ($i->column && $i->column->name !== 'Done'); })->count();
                $pProgress = $pTasksCount > 0 ? round(($pCompletedTasks / $pTasksCount) * 100) : 0;
                
                $pStatus = '🟢 On Track';
                if ($pProgress == 100 && $pTasksCount > 0) $pStatus = '✅ Completed';
                elseif ($pOverdueTasks > 0 || ($project->deadline && \Carbon\Carbon::parse($project->deadline)->isPast() && $pProgress < 100)) $pStatus = '🔴 Overdue';
                elseif ($pProgress < 50 && $pTasksCount > 0) $pStatus = '🟡 At Risk';

                $membersDetails = $project->members->map(function($member) use ($project) {
                    $mAssignedTasks = $project->issues->where('assignee_id', $member->id)->count();
                    $mCompletedTasks = $project->issues->where('assignee_id', $member->id)->filter(function($i) { return $i->column && $i->column->name === 'Done'; })->count();
                    return [
                        'id' => $member->id,
                        'name' => $member->name,
                        'role' => $member->pivot->role ?? 'Member',
                        'assigned_tasks' => $mAssignedTasks,
                        'completed_tasks' => $mCompletedTasks,
                        'progress' => $mAssignedTasks > 0 ? round(($mCompletedTasks / $mAssignedTasks) * 100) : 0
                    ];
                });

                $isLate = false;
                $delayDays = 0;
                if ($project->completed_at && $project->deadline) {
                    if (\Carbon\Carbon::parse($project->completed_at)->gt(\Carbon\Carbon::parse($project->deadline))) {
                        $isLate = true;
                        $delayDays = \Carbon\Carbon::parse($project->completed_at)->diffInDays(\Carbon\Carbon::parse($project->deadline));
                    }
                }

                return [
                    'id' => $project->id,
                    'name' => $project->name,
                    'start_date' => $project->start_date ? \Carbon\Carbon::parse($project->start_date)->format('d M Y') : 'Not Set',
                    'deadline' => $project->deadline ? \Carbon\Carbon::parse($project->deadline)->format('d M Y') : 'Not Set',
                    'completed_at' => $project->completed_at ? \Carbon\Carbon::parse($project->completed_at)->format('d M Y') : null,
                    'is_late' => $isLate,
                    'delay_days' => $delayDays,
                    'progress' => $pProgress,
                    'tasks_count' => $pTasksCount,
                    'completed_tasks' => $pCompletedTasks,
                    'pending_tasks' => $pPendingTasks,
                    'overdue_tasks' => $pOverdueTasks,
                    'status' => $pStatus,
                    'members' => $membersDetails->values()->all()
                ];
            });

            $projectsManaged = $projectsCount;
            $projectsCompleted = $projectsDetails->where('progress', 100)->count();
            $projectsInProgress = $projectsManaged - $projectsCompleted;
            $completedOnTime = $projectsDetails->where('progress', 100)->where('is_late', false)->count();
            $completedLate = $projectsDetails->where('progress', 100)->where('is_late', true)->count();
            $overdueProjects = $projectsDetails->where('status', '🔴 Overdue')->count();
            $avgCompletion = $projectsCount > 0 ? round($projectsDetails->avg('progress')) : 0;

            return [
                'id' => $manager->id,
                'name' => $manager->name,
                'email' => $manager->email,
                'projects_count' => $projectsCount,
                'members_count' => $membersCount,
                'tasks_count' => $tasksCount,
                'completed_tasks' => $completedTasksCount,
                'progress' => $progress,
                'status' => $status,
                'projects_details' => $projectsDetails->values()->all(),
                'performance' => [
                    'projects_managed' => $projectsManaged,
                    'projects_completed' => $projectsCompleted,
                    'projects_in_progress' => $projectsInProgress,
                    'completed_on_time' => $completedOnTime,
                    'completed_late' => $completedLate,
                    'overdue_projects' => $overdueProjects,
                    'avg_completion' => $avgCompletion
                ],
                'overdue' => $projectsDetails->sum('overdue_tasks')
            ];
        });

        // Recent Activity
        $recentActivity = IssueActivity::with(['issue', 'user'])->latest()->limit(15)->get();
        // All Users
        $users = User::withCount('projects')->get();
        // All Projects
        $projects = $allProjects;
        // All Tasks
        $tasks = Issue::with(['project', 'assignee', 'reporter', 'column'])->latest()->get();

        return response()->json([
            'stats' => $stats,
            'recentActivity' => $recentActivity,
            'users' => $users,
            'projects' => $projects,
            'tasks' => $tasks,
            'managers' => $managersData,
            'alerts' => collect($alerts)->unique('message')->values()->all(),
            'reports' => [
                'projectProgress' => [], // Keeping for backward compatibility if used elsewhere
                'managerTasks' => []
            ]
        ]);
    }

    public function createManager(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => \Illuminate\Support\Facades\Hash::make($validated['password']),
            'plain_password' => $validated['password'],
            'role' => 'manager',
        ]);

        return response()->json(['message' => 'Manager created successfully.', 'user' => $user], 201);
    }

    public function grantManager(User $user)
    {
        if ($user->role !== 'admin') {
            $user->update(['role' => 'manager']);
        }
        return response()->json(['message' => 'Manager access granted.']);
    }

    public function revokeManager(User $user)
    {
        if ($user->role === 'manager') {
            $user->update(['role' => 'member']);
        }
        return response()->json(['message' => 'Manager access revoked.']);
    }
}
