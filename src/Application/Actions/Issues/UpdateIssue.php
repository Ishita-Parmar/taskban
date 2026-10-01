<?php

namespace Src\Application\Actions\Issues;

use App\Models\Issue;
use App\Models\IssueActivity;
use Src\Domain\Events\IssueUpdated;

class UpdateIssue
{
    /**
     * Update an issue's fields and log each change.
     */
    public function execute(int $issueId, array $data, int $updatedByUserId): Issue
    {
        $issue = Issue::findOrFail($issueId);

        // Fields we track in the activity log
        $trackedFields = ['summary', 'description', 'priority', 'type', 'assignee_id'];

        foreach ($trackedFields as $field) {
            if (array_key_exists($field, $data) && $issue->{$field} != $data[$field]) {
                $oldValue = $issue->{$field};
                $newValue = $data[$field];

                // For assignee, resolve to user names
                $displayField = $field;
                $displayOld = (string) $oldValue;
                $displayNew = (string) $newValue;

                if ($field === 'assignee_id') {
                    $displayField = 'assignee';
                    $displayOld = $oldValue ? \App\Models\User::find($oldValue)?->name : 'Unassigned';
                    $displayNew = $newValue ? \App\Models\User::find($newValue)?->name : 'Unassigned';
                }

                IssueActivity::create([
                    'issue_id' => $issue->id,
                    'user_id' => $updatedByUserId,
                    'field' => $displayField,
                    'old_value' => $displayOld,
                    'new_value' => $displayNew,
                ]);

                event(new IssueUpdated(
                    issueId: $issue->id,
                    projectId: $issue->project_id,
                    field: $displayField,
                    oldValue: $displayOld,
                    newValue: $displayNew,
                    updatedByUserId: $updatedByUserId,
                ));
            }
        }

        $issue->update($data);

        return $issue->fresh(['assignee', 'reporter', 'column']);
    }
}
