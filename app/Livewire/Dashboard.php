<?php

namespace App\Livewire;

use App\Models\Project;
use Livewire\Attributes\Layout;
use Livewire\Component;

#[Layout('layouts.board')]
class Dashboard extends Component
{
    public $showCreateModal = false;
    public $name = '';
    public $key = '';
    public $description = '';

    public function createProject()
    {
        $this->validate([
            'name' => 'required|string|max:255',
            'key' => 'required|string|max:10|unique:projects,key',
        ]);

        $project = Project::create([
            'name' => $this->name,
            'key' => strtoupper($this->key),
            'description' => $this->description,
            'owner_id' => auth()->id(),
        ]);

        // Add user as admin
        $project->members()->attach(auth()->id(), ['role' => 'admin']);

        // Create default columns
        $columns = [
            ['name' => 'To Do', 'color' => 'gray', 'position' => 1000],
            ['name' => 'In Progress', 'color' => 'blue', 'position' => 2000],
            ['name' => 'Review', 'color' => 'yellow', 'position' => 3000],
            ['name' => 'Done', 'color' => 'green', 'position' => 4000],
        ];

        foreach ($columns as $column) {
            $project->columns()->create($column);
        }

        $this->reset(['name', 'key', 'description', 'showCreateModal']);
        
        return redirect()->route('projects.board', $project->id);
    }

    public function render()
    {
        return view('livewire.dashboard', [
            'projects' => auth()->user()->projects,
        ]);
    }
}
