<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TeamMemberController extends Controller
{
    public function index(Project $project)
    {
        return response()->json($project->members);
    }

    public function store(Request $request, Project $project)
    {
        $validated = $request->validate([
            'email' => 'required|email|exists:users,email',
            'role' => ['required', Rule::in(['admin', 'member', 'viewer'])],
        ]);

        $user = User::where('email', $validated['email'])->first();

        // Check if already a member
        if ($project->members()->where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'User is already a member of this project'], 409);
        }

        $project->members()->attach($user->id, ['role' => $validated['role']]);

        return response()->json(['message' => 'Member added successfully', 'user' => $user], 201);
    }

    public function update(Request $request, Project $project, User $user)
    {
        $validated = $request->validate([
            'role' => ['required', Rule::in(['admin', 'member', 'viewer'])],
        ]);

        $project->members()->updateExistingPivot($user->id, ['role' => $validated['role']]);

        return response()->json(['message' => 'Role updated successfully']);
    }

    public function destroy(Project $project, User $user)
    {
        $project->members()->detach($user->id);
        
        return response()->json(null, 204);
    }
}
