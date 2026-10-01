<?php

namespace App\Observers;

use App\Models\Issue;
use App\Models\IssueActivity;
use Illuminate\Support\Facades\Auth;

class IssueObserver
{
    public function created(Issue $issue)
    {
        $this->logActivity($issue, 'issue_created', null, 'Issue was created.');
    }

    public function updated(Issue $issue)
    {
        $changes = $issue->getDirty();
        $original = $issue->getOriginal();

        foreach ($changes as $field => $newValue) {
            // Ignore position changes for activity logs (too noisy) and updated_at
            if ($field === 'updated_at' || $field === 'position') {
                continue;
            }

            $oldValue = $original[$field] ?? null;

            if ($field === 'board_column_id') {
                $oldColumn = \App\Models\BoardColumn::find($oldValue);
                $newColumn = \App\Models\BoardColumn::find($newValue);
                $this->logActivity($issue, 'status_changed', $oldColumn?->name, $newColumn?->name);
            } elseif ($field === 'assignee_id') {
                $oldAssignee = \App\Models\User::find($oldValue);
                $newAssignee = \App\Models\User::find($newValue);
                $this->logActivity($issue, 'assignee_changed', $oldAssignee?->name ?? 'Unassigned', $newAssignee?->name ?? 'Unassigned');
            } else {
                // For other fields like summary or description
                // Using string conversion just to be safe, truncate if too long
                $oldString = is_string($oldValue) ? substr($oldValue, 0, 50) : null;
                $newString = is_string($newValue) ? substr($newValue, 0, 50) : null;
                $this->logActivity($issue, "{$field}_updated", $oldString, $newString);
            }
        }
    }

    private function logActivity(Issue $issue, string $type, ?string $oldValue, ?string $newValue)
    {
        $userId = Auth::id() ?? $issue->reporter_id;
        
        if (!$userId) return;

        IssueActivity::create([
            'issue_id' => $issue->id,
            'user_id' => $userId,
            'activity_type' => $type,
            'old_value' => $oldValue,
            'new_value' => $newValue,
        ]);
    }
}
