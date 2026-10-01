<?php

namespace App\Http\Middleware;

use App\Models\Project;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureProjectMember
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $project = $request->route('project');
        
        if (is_string($project) || is_int($project)) {
            $project = Project::find($project);
        }

        if ($project && $request->user()) {
            if (!$project->members()->where('user_id', $request->user()->id)->exists()) {
                abort(403, 'You are not a member of this project.');
            }
        }

        return $next($request);
    }
}
