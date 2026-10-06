<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Issue;

class MyTasksController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        $issues = Issue::where('assignee_id', $user->id)
            ->with(['project', 'column', 'reporter', 'comments.user', 'comments.attachments'])
            ->orderBy('created_at', 'desc')
            ->get();
            
        $projectsCount = $user->projects()->count();
        // Since team is project based, we can estimate team size by getting unique users across user's projects
        $teamCount = \DB::table('project_user')
            ->whereIn('project_id', $user->projects()->pluck('projects.id'))
            ->distinct('user_id')
            ->count();
        
        return response()->json([
            'issues' => $issues,
            'stats' => [
                'total' => $issues->count(),
                'projectsCount' => $projectsCount,
                'teamCount' => $teamCount
            ]
        ]);
    }
}
