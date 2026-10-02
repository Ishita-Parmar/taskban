<?php

namespace App\Http\Controllers;

use App\Models\Issue;
use App\Models\Project;
use Illuminate\Http\Request;

class IssueController extends Controller
{
    public function index(Request $request, Project $project)
    {
        $issues = $project->issues()
            ->with(['assignee', 'reporter', 'column', 'comments.user'])
            ->orderBy('position')
            ->get();
            
        return response()->json($issues);
    }

    public function store(Request $request, Project $project)
    {
        $validated = $request->validate([
            'board_column_id' => 'required|exists:board_columns,id',
            'type' => 'required|string',
            'summary' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|string',
            'deadline' => 'nullable|date',
            'assignee_id' => 'nullable|exists:users,id',
            'assignee_name' => 'nullable|string|max:255',
        ]);

        if (!empty($validated['assignee_name'])) {
            $user = \App\Models\User::firstOrCreate(
                ['name' => $validated['assignee_name']],
                ['email' => strtolower(str_replace(' ', '', $validated['assignee_name'])) . rand(100,9999) . '@example.com', 'password' => bcrypt('password')]
            );
            if (!$project->members()->where('user_id', $user->id)->exists()) {
                $project->members()->attach($user->id, ['role' => 'member']);
            }
            $validated['assignee_id'] = $user->id;
        }

        $validated['reporter_id'] = $request->user()->id;
        $validated['issue_key'] = $project->nextIssueKey();
        
        // Find max position in the column
        $maxPosition = Issue::where('board_column_id', $validated['board_column_id'])->max('position');
        $validated['position'] = ($maxPosition ?? 0) + 1000;

        $issue = $project->issues()->create($validated);
        
        $issue->load(['assignee', 'reporter', 'column']);

        return response()->json($issue, 201);
    }

    public function show(Project $project, Issue $issue)
    {
        $issue->load(['assignee', 'reporter', 'column', 'comments.user', 'activities']);
        return response()->json($issue);
    }

    public function update(Request $request, Project $project, Issue $issue)
    {
        $validated = $request->validate([
            'summary' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'type' => 'sometimes|string',
            'priority' => 'sometimes|string',
            'deadline' => 'nullable|date',
            'assignee_id' => 'nullable|exists:users,id',
            'assignee_name' => 'nullable|string|max:255',
            'board_column_id' => 'sometimes|exists:board_columns,id',
        ]);

        if (!empty($validated['assignee_name'])) {
            $user = \App\Models\User::firstOrCreate(
                ['name' => $validated['assignee_name']],
                ['email' => strtolower(str_replace(' ', '', $validated['assignee_name'])) . rand(100,9999) . '@example.com', 'password' => bcrypt('password')]
            );
            if (!$project->members()->where('user_id', $user->id)->exists()) {
                $project->members()->attach($user->id, ['role' => 'member']);
            }
            $validated['assignee_id'] = $user->id;
        }

        $issue->update($validated);
        $issue->load(['assignee', 'reporter', 'column']);
        return response()->json($issue);
    }
    
    public function move(Request $request, Project $project, Issue $issue)
    {
        $validated = $request->validate([
            'board_column_id' => 'required|exists:board_columns,id',
            'position' => 'required|numeric',
        ]);
        
        $issue->update([
            'board_column_id' => $validated['board_column_id'],
            'position' => $validated['position']
        ]);
        
        $issue->load(['column']);
        return response()->json($issue);
    }

    public function destroy(Project $project, Issue $issue)
    {
        $issue->delete();
        return response()->json(null, 204);
    }
}
