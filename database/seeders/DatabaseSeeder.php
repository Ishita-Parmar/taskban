<?php

namespace Database\Seeders;

use App\Models\BoardColumn;
use App\Models\Issue;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create a Test User
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
        ]);

        $user2 = User::factory()->create([
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'password' => Hash::make('password'),
        ]);

        // 2. Create a Test Project
        $project = Project::create([
            'key' => 'TASK',
            'name' => 'Website Redesign',
            'description' => 'Redesigning the corporate website',
            'owner_id' => $user->id,
        ]);
        
        $project->members()->attach([$user->id => ['role' => 'admin'], $user2->id => ['role' => 'member']]);

        // 3. Create Board Columns
        $todo = $project->columns()->create(['name' => 'To Do', 'position' => 1000]);
        $inProgress = $project->columns()->create(['name' => 'In Progress', 'position' => 2000]);
        $done = $project->columns()->create(['name' => 'Done', 'position' => 3000]);

        // 4. Create some Issues
        $project->issues()->create([
            'board_column_id' => $todo->id,
            'reporter_id' => $user->id,
            'assignee_id' => $user2->id,
            'issue_key' => $project->nextIssueKey(),
            'type' => 'task',
            'summary' => 'Design the new homepage mockup in Figma',
            'priority' => 'high',
            'position' => 1000,
        ]);

        $project->issues()->create([
            'board_column_id' => $todo->id,
            'reporter_id' => $user->id,
            'issue_key' => $project->nextIssueKey(),
            'type' => 'bug',
            'summary' => 'Fix responsive issue on mobile footer',
            'priority' => 'medium',
            'position' => 2000,
        ]);

        $project->issues()->create([
            'board_column_id' => $inProgress->id,
            'reporter_id' => $user->id,
            'assignee_id' => $user->id,
            'issue_key' => $project->nextIssueKey(),
            'type' => 'task',
            'summary' => 'Set up React frontend with Vite and Tailwind',
            'priority' => 'high',
            'position' => 1000,
        ]);
        
        $project->issues()->create([
            'board_column_id' => $done->id,
            'reporter_id' => $user->id,
            'assignee_id' => $user->id,
            'issue_key' => $project->nextIssueKey(),
            'type' => 'task',
            'summary' => 'Initialize Laravel Backend and Migrations',
            'priority' => 'high',
            'position' => 1000,
        ]);
    }
}
