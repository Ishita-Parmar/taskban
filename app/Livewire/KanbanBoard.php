<?php

namespace App\Livewire;

use App\Models\BoardColumn;
use App\Models\Issue;
use App\Models\Project;
use Livewire\Attributes\Layout;
use Livewire\Attributes\Title;
use Livewire\Component;
use Src\Application\Actions\Issues\CreateIssue;
use Src\Application\Actions\Issues\MoveIssue;
use Src\Application\Actions\Issues\UpdateIssue;
use Src\Application\DTOs\CreateIssueData;

#[Layout('layouts.board')]
class KanbanBoard extends Component
{
    public Project $project;
    public $columns = [];
    public $showCreateModal = false;
    public $showIssueModal = false;
    public $selectedIssue = null;

    // Create issue form
    public $newIssueSummary = '';
    public $newIssueType = 'task';
    public $newIssuePriority = 'medium';
    public $newIssueAssignee = '';
    public $newIssueDescription = '';

    // Issue detail modal
    public $editSummary = '';
    public $editDescription = '';
    public $editPriority = '';
    public $editAssignee = '';
    public $newComment = '';
    public $activeDetailTab = 'comments';

    // Filters
    public $filterMyIssues = false;
    public $searchQuery = '';

    public function mount(Project $project)
    {
        $this->project = $project;
        $this->loadBoard();
    }

    public function getListeners()
    {
        $projectId = $this->project->id;
        return [
            "echo-private:project.{$projectId},.Src\\Domain\\Events\\IssueCreated" => 'loadBoard',
            "echo-private:project.{$projectId},.Src\\Domain\\Events\\IssueMoved" => 'loadBoard',
            "echo-private:project.{$projectId},.Src\\Domain\\Events\\IssueUpdated" => 'handleIssueUpdated',
            "echo-private:project.{$projectId},.Src\\Domain\\Events\\CommentAdded" => 'handleIssueUpdated',
        ];
    }

    public function handleIssueUpdated()
    {
        $this->loadBoard();
        if ($this->selectedIssue) {
            $this->openIssue($this->selectedIssue->id); // Refresh open modal if any
        }
    }

    public function loadBoard()
    {
        $query = $this->project->issues()
            ->with(['assignee', 'reporter']);

        if ($this->filterMyIssues) {
            $query->where('assignee_id', auth()->id());
        }

        if ($this->searchQuery) {
            $query->where(function ($q) {
                $q->where('summary', 'like', "%{$this->searchQuery}%")
                  ->orWhere('issue_key', 'like', "%{$this->searchQuery}%");
            });
        }

        $issues = $query->get();

        $this->columns = $this->project->columns()->get()->map(function ($column) use ($issues) {
            $column->setRelation('issues', $issues->where('board_column_id', $column->id)->sortBy('position')->values());
            return $column;
        });
    }

    public function moveIssue(int $issueId, int $newColumnId, int $newPosition)
    {
        $action = new MoveIssue();
        $action->execute($issueId, $newColumnId, (float) $newPosition, auth()->id());
        $this->loadBoard();
    }

    public function createIssue()
    {
        $this->validate([
            'newIssueSummary' => 'required|min:3|max:255',
            'newIssueType' => 'required|in:epic,story,task,bug',
            'newIssuePriority' => 'required|in:highest,high,medium,low,lowest',
        ]);

        $action = new CreateIssue();
        $action->execute(new CreateIssueData(
            projectId: $this->project->id,
            type: $this->newIssueType,
            summary: $this->newIssueSummary,
            description: $this->newIssueDescription,
            priority: $this->newIssuePriority,
            assigneeId: $this->newIssueAssignee ?: null,
            reporterId: auth()->id(),
        ));

        $this->reset(['newIssueSummary', 'newIssueType', 'newIssuePriority', 'newIssueAssignee', 'newIssueDescription']);
        $this->showCreateModal = false;
        $this->loadBoard();
    }

    public function openIssue(int $issueId)
    {
        $this->selectedIssue = Issue::with(['assignee', 'reporter', 'column', 'comments.user', 'activities.user'])
            ->findOrFail($issueId);
        $this->editSummary = $this->selectedIssue->summary;
        $this->editDescription = $this->selectedIssue->description ?? '';
        $this->editPriority = $this->selectedIssue->priority->value ?? $this->selectedIssue->priority;
        $this->editAssignee = $this->selectedIssue->assignee_id ?? '';
        $this->showIssueModal = true;
    }

    public function updateIssue()
    {
        if (!$this->selectedIssue) return;

        $action = new UpdateIssue();
        $data = [];

        if ($this->editSummary !== $this->selectedIssue->summary) {
            $data['summary'] = $this->editSummary;
        }
        if ($this->editDescription !== ($this->selectedIssue->description ?? '')) {
            $data['description'] = $this->editDescription;
        }
        $priorityValue = is_string($this->editPriority) ? $this->editPriority : $this->editPriority->value;
        if ($priorityValue !== ($this->selectedIssue->priority->value ?? $this->selectedIssue->priority)) {
            $data['priority'] = $this->editPriority;
        }
        $currentAssignee = $this->selectedIssue->assignee_id ?? '';
        if ($this->editAssignee != $currentAssignee) {
            $data['assignee_id'] = $this->editAssignee ?: null;
        }

        if (!empty($data)) {
            $action->execute($this->selectedIssue->id, $data, auth()->id());
            $this->openIssue($this->selectedIssue->id); // Refresh
            $this->loadBoard();
        }
    }

    public function addComment()
    {
        if (!$this->selectedIssue || !trim($this->newComment)) return;

        $action = new \Src\Application\Actions\Comments\AddComment();
        $action->execute($this->selectedIssue->id, auth()->id(), $this->newComment);
        $this->newComment = '';
        $this->openIssue($this->selectedIssue->id); // Refresh
    }

    public function toggleMyIssues()
    {
        $this->filterMyIssues = !$this->filterMyIssues;
        $this->loadBoard();
    }

    public function updatedSearchQuery()
    {
        $this->loadBoard();
    }

    public function render()
    {
        return view('livewire.kanban-board', [
            'projectMembers' => $this->project->members()->get(),
        ]);
    }
}
