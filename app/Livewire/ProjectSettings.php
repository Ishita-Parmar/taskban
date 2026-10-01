<?php

namespace App\Livewire;

use App\Models\Project;
use Livewire\Attributes\Layout;
use Livewire\Component;

#[Layout('layouts.board')]
class ProjectSettings extends Component
{
    public Project $project;
    public $activeTab = 'general';

    public $name;
    public $description;

    public $newColumnName = '';
    public $newColumnColor = 'blue';

    public $showInviteModal = false;
    public $inviteEmail = '';
    public $inviteRole = 'member';

    public function mount(Project $project)
    {
        $this->project = $project;
        $this->name = $project->name;
        $this->description = $project->description;
    }

    public function saveGeneral()
    {
        $this->validate([
            'name' => 'required|min:3',
        ]);

        $this->project->update([
            'name' => $this->name,
            'description' => $this->description,
        ]);
        
        session()->flash('message', 'Settings saved successfully.');
    }

    public function addColumn()
    {
        $this->validate([
            'newColumnName' => 'required|string|max:50',
            'newColumnColor' => 'required|string|in:blue,green,yellow,red,gray',
        ]);

        $position = $this->project->columns()->max('position') + 1000;

        $this->project->columns()->create([
            'name' => $this->newColumnName,
            'color' => $this->newColumnColor,
            'position' => $position,
        ]);

        $this->reset(['newColumnName', 'newColumnColor']);
    }

    public function deleteColumn($columnId)
    {
        $column = $this->project->columns()->find($columnId);
        if ($column && $column->issues()->count() === 0) {
            $column->delete();
        } else {
            session()->flash('column_error', 'Cannot delete column with active issues.');
        }
    }

    public function updateMemberRole($userId, $role)
    {
        if (in_array($role, ['admin', 'member', 'viewer'])) {
            $this->project->members()->updateExistingPivot($userId, ['role' => $role]);
        }
    }

    public function removeMember($userId)
    {
        // Don't allow removing yourself
        if ($userId !== auth()->id()) {
            $this->project->members()->detach($userId);
        }
    }

    public function inviteMember()
    {
        $this->validate([
            'inviteEmail' => 'required|email',
            'inviteRole' => 'required|in:admin,member,viewer',
        ]);

        $user = \App\Models\User::firstOrCreate(
            ['email' => $this->inviteEmail],
            [
                'name' => explode('@', $this->inviteEmail)[0],
                'password' => \Illuminate\Support\Facades\Hash::make(\Illuminate\Support\Str::random(16)),
            ]
        );

        if ($this->project->members()->where('user_id', $user->id)->exists()) {
            $this->addError('inviteEmail', 'This user is already a member of the project.');
            return;
        }

        $this->project->members()->attach($user->id, ['role' => $this->inviteRole]);
        
        $this->reset(['inviteEmail', 'inviteRole', 'showInviteModal']);
        session()->flash('message', 'Member added successfully.');
    }

    public function render()
    {
        return view('livewire.project-settings', [
            'members' => $this->project->members()->get(),
            'columns' => $this->project->columns()->orderBy('position')->get(),
        ]);
    }
}
