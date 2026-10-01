<?php

namespace App\Policies;

use App\Models\Issue;
use App\Models\User;
use Src\Domain\ValueObjects\ProjectRole;

class IssuePolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Issue $issue): bool
    {
        return $issue->project->members()->where('user_id', $user->id)->exists();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, int $projectId): bool
    {
        $member = $user->projects()->where('project_id', $projectId)->first();
        if (!$member) return false;
        
        $role = ProjectRole::from($member->pivot->role);
        return $role->canEditIssues();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Issue $issue): bool
    {
        $member = $user->projects()->where('project_id', $issue->project_id)->first();
        if (!$member) return false;
        
        $role = ProjectRole::from($member->pivot->role);
        return $role->canEditIssues();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Issue $issue): bool
    {
        $member = $user->projects()->where('project_id', $issue->project_id)->first();
        if (!$member) return false;
        
        $role = ProjectRole::from($member->pivot->role);
        return $role->canManageProject(); // Only admins can delete issues
    }
}
