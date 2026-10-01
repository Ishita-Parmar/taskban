<?php

namespace Src\Application\Actions\Issues;

use App\Models\Issue;
use App\Models\IssueActivity;
use Src\Domain\Events\IssueMoved;

class MoveIssue
{
    /**
     * Move an issue to a new column and/or position.
     */
    public function execute(int $issueId, int $newColumnId, float $newPosition, int $movedByUserId): Issue
    {
        $issue = Issue::findOrFail($issueId);
        $oldColumnId = $issue->board_column_id;
        $oldColumnName = $issue->column->name;

        $issue->update([
            'board_column_id' => $newColumnId,
            'position' => $newPosition,
        ]);

        $issue->load('column');
        $newColumnName = $issue->column->name;

        // Log status change only if column actually changed
        if ($oldColumnId !== $newColumnId) {
            IssueActivity::create([
                'issue_id' => $issue->id,
                'user_id' => $movedByUserId,
                'field' => 'status',
                'old_value' => $oldColumnName,
                'new_value' => $newColumnName,
            ]);
        }

        // Dispatch domain event
        event(new IssueMoved(
            issueId: $issue->id,
            projectId: $issue->project_id,
            oldColumnId: $oldColumnId,
            newColumnId: $newColumnId,
            newPosition: $newPosition,
            movedByUserId: $movedByUserId,
        ));

        return $issue;
    }
}
