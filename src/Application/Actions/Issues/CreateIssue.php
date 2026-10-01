<?php

namespace Src\Application\Actions\Issues;

use App\Models\Issue;
use App\Models\IssueActivity;
use App\Models\Project;
use Src\Application\DTOs\CreateIssueData;
use Src\Domain\Events\IssueCreated;

class CreateIssue
{
    /**
     * Create a new issue in the given project.
     */
    public function execute(CreateIssueData $data): Issue
    {
        $project = Project::findOrFail($data->projectId);

        // Determine the target column (first column if not specified)
        $columnId = $data->columnId ?? $project->columns()->first()?->id;

        if (!$columnId) {
            throw new \RuntimeException("Project has no columns. Please create at least one column first.");
        }

        // Calculate position (append to bottom of column)
        $maxPosition = Issue::where('board_column_id', $columnId)
            ->max('position') ?? 0;

        $issue = Issue::create([
            'project_id' => $project->id,
            'board_column_id' => $columnId,
            'assignee_id' => $data->assigneeId,
            'reporter_id' => $data->reporterId,
            'issue_key' => $project->nextIssueKey(),
            'type' => $data->type,
            'summary' => $data->summary,
            'description' => $data->description,
            'priority' => $data->priority,
            'position' => $maxPosition + 1000,
        ]);

        // Log creation activity
        IssueActivity::create([
            'issue_id' => $issue->id,
            'user_id' => $data->reporterId,
            'field' => 'created',
            'old_value' => null,
            'new_value' => $issue->issue_key,
        ]);

        // Dispatch domain event
        event(new IssueCreated(
            issueId: $issue->id,
            projectId: $project->id,
            columnId: $columnId,
            issueKey: $issue->issue_key,
            summary: $issue->summary,
            type: $data->type,
            priority: $data->priority,
            assigneeId: $data->assigneeId,
            reporterId: $data->reporterId,
        ));

        return $issue->load(['assignee', 'reporter', 'column']);
    }
}
