<?php

namespace App\Livewire;

use App\Models\Issue;
use App\Models\Project;
use Livewire\Attributes\Layout;
use Livewire\Component;

#[Layout('layouts.board')]
class BacklogList extends Component
{
    public Project $project;
    public $issues;

    // Filters
    public $searchQuery = '';
    public $filterType = '';
    public $filterPriority = '';

    // Inline Create
    public $showInlineCreate = false;
    public $inlineSummary = '';
    public $inlineType = 'story';

    public function mount(Project $project)
    {
        $this->project = $project;
        $this->loadIssues();
    }

    public function getListeners()
    {
        $projectId = $this->project->id;
        return [
            "echo-private:project.{$projectId},.Src\\Domain\\Events\\IssueCreated" => 'loadIssues',
            "echo-private:project.{$projectId},.Src\\Domain\\Events\\IssueMoved" => 'loadIssues',
            "echo-private:project.{$projectId},.Src\\Domain\\Events\\IssueUpdated" => 'loadIssues',
        ];
    }

    public function loadIssues()
    {
        $query = $this->project->issues()
            ->with(['assignee', 'reporter', 'column']);

        if ($this->searchQuery) {
            $query->where(function ($q) {
                $q->where('summary', 'like', "%{$this->searchQuery}%")
                  ->orWhere('issue_key', 'like', "%{$this->searchQuery}%");
            });
        }

        if ($this->filterType) {
            $query->where('type', $this->filterType);
        }

        if ($this->filterPriority) {
            $query->where('priority', $this->filterPriority);
        }

        $this->issues = $query->orderBy('position')->get();
    }

    public function updatedSearchQuery()
    {
        $this->loadIssues();
    }

    public function updatedFilterType()
    {
        $this->loadIssues();
    }

    public function updatedFilterPriority()
    {
        $this->loadIssues();
    }

    public function createInlineIssue()
    {
        $this->validate([
            'inlineSummary' => 'required|min:3',
            'inlineType' => 'required|in:epic,story,task,bug',
        ]);

        $action = new \Src\Application\Actions\Issues\CreateIssue();
        $action->execute(new \Src\Application\DTOs\CreateIssueData(
            projectId: $this->project->id,
            type: $this->inlineType,
            summary: $this->inlineSummary,
            description: null,
            priority: 'medium', // Default
            assigneeId: null,
            reporterId: auth()->id(),
        ));

        $this->reset(['inlineSummary', 'showInlineCreate', 'inlineType']);
        $this->loadIssues();
    }

    public function reorderIssue(int $issueId, int $newPosition)
    {
        $issue = Issue::find($issueId);
        if (!$issue) return;

        $action = new \Src\Application\Actions\Issues\MoveIssue();
        $action->execute($issueId, $issue->board_column_id, (float) $newPosition, auth()->id());
        $this->loadIssues();
    }

    public function render()
    {
        return view('livewire.backlog-list');
    }
}
