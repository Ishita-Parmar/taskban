<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        // Projects the user owns or is a member of
        $user = $request->user();
        
        $projects = Project::where('owner_id', $user->id)
            ->orWhereHas('members', function($q) use ($user) {
                $q->where('user_id', $user->id);
            })->with('owner')->get();
            
        return response()->json($projects);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'key' => 'required|string|max:10|unique:projects',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'team_members' => 'nullable|string', // comma separated emails
        ]);

        $validated['owner_id'] = $request->user()->id;

        $project = Project::create([
            'key' => $validated['key'],
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'owner_id' => $validated['owner_id'],
        ]);

        // Process team members
        if (!empty($validated['team_members'])) {
            $emails = array_map('trim', explode(',', $validated['team_members']));
            $memberIds = [];
            
            foreach ($emails as $email) {
                if (empty($email)) continue;
                
                // Find or create user
                $user = \App\Models\User::firstOrCreate(
                    ['email' => $email],
                    [
                        'name' => explode('@', $email)[0],
                        'password' => \Illuminate\Support\Facades\Hash::make('password'), // default password
                        'role' => 'member'
                    ]
                );
                
                $memberIds[] = $user->id;
                
                // Log notification (simulating sending message)
                \Illuminate\Support\Facades\Log::info("Message sent to $email: You are working in the project '{$project->name}' created by {$request->user()->name}");
            }
            
            // Attach members
            if (count($memberIds) > 0) {
                $project->members()->attach($memberIds, ['role' => 'member']);
            }
        }

        // Add default board columns (To Do, In Progress, Done)
        $project->columns()->createMany([
            ['name' => 'To Do', 'position' => 1000],
            ['name' => 'In Progress', 'position' => 2000],
            ['name' => 'Done', 'position' => 3000],
        ]);

        return response()->json($project, 201);
    }

    public function show(Request $request, Project $project)
    {
        $project->load(['columns', 'members', 'owner']);
        return response()->json($project);
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
        ]);

        $project->update($validated);
        return response()->json($project);
    }

    public function destroy(Project $project)
    {
        $project->delete();
        return response()->json(null, 204);
    }
}
