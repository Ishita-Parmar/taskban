<?php

namespace Database\Seeders;

use App\Models\BoardColumn;
use App\Models\Comment;
use App\Models\Issue;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        // Create demo users
        $john = User::create([
            'name' => 'John Doe',
            'email' => 'john@taskban.dev',
            'password' => Hash::make('password'),
        ]);

        $jane = User::create([
            'name' => 'Jane Smith',
            'email' => 'jane@taskban.dev',
            'password' => Hash::make('password'),
        ]);

        $alex = User::create([
            'name' => 'Alex Chen',
            'email' => 'alex@taskban.dev',
            'password' => Hash::make('password'),
        ]);

        // Create project
        $project = Project::create([
            'key' => 'TASK',
            'name' => 'TaskBan Dev',
            'description' => 'Building the next-generation project management tool.',
            'owner_id' => $john->id,
        ]);

        // Add members
        $project->members()->attach([
            $john->id => ['role' => 'admin'],
            $jane->id => ['role' => 'member'],
            $alex->id => ['role' => 'member'],
        ]);

        // Create columns
        $todo = BoardColumn::create(['project_id' => $project->id, 'name' => 'To Do', 'position' => 0, 'color' => 'gray']);
        $inProgress = BoardColumn::create(['project_id' => $project->id, 'name' => 'In Progress', 'position' => 1, 'color' => 'blue']);
        $inReview = BoardColumn::create(['project_id' => $project->id, 'name' => 'In Review', 'position' => 2, 'color' => 'yellow']);
        $done = BoardColumn::create(['project_id' => $project->id, 'name' => 'Done', 'position' => 3, 'color' => 'green']);

        // Create issues
        $issues = [
            ['column' => $todo, 'type' => 'story', 'summary' => 'Design glassmorphic login page', 'priority' => 'medium', 'assignee' => $jane, 'position' => 1000],
            ['column' => $todo, 'type' => 'task', 'summary' => 'Set up Laravel Reverb for WebSockets', 'priority' => 'high', 'assignee' => $john, 'position' => 2000],
            ['column' => $todo, 'type' => 'bug', 'summary' => 'Fix avatar fallback rendering on Safari', 'priority' => 'low', 'assignee' => $alex, 'position' => 3000],
            ['column' => $inProgress, 'type' => 'task', 'summary' => 'Implement drag-and-drop with Alpine.js Sortable', 'priority' => 'highest', 'assignee' => $john, 'position' => 1000],
            ['column' => $inProgress, 'type' => 'story', 'summary' => 'Build issue detail modal with comments', 'priority' => 'high', 'assignee' => $jane, 'position' => 2000],
            ['column' => $inReview, 'type' => 'task', 'summary' => 'Create database migrations and seeders', 'priority' => 'medium', 'assignee' => $alex, 'position' => 1000],
            ['column' => $done, 'type' => 'task', 'summary' => 'Initialize Laravel 11 project scaffold', 'priority' => 'medium', 'assignee' => $john, 'position' => 1000],
            ['column' => $done, 'type' => 'story', 'summary' => 'Design Stitch UI screens with glassmorphism', 'priority' => 'high', 'assignee' => $jane, 'position' => 2000],
        ];

        $issueNumber = 1;
        foreach ($issues as $data) {
            $issue = Issue::create([
                'project_id' => $project->id,
                'board_column_id' => $data['column']->id,
                'assignee_id' => $data['assignee']->id,
                'reporter_id' => $john->id,
                'issue_key' => 'TASK-' . $issueNumber,
                'type' => $data['type'],
                'summary' => $data['summary'],
                'description' => 'This is a sample issue for demonstrating the TaskBan Kanban board.',
                'priority' => $data['priority'],
                'position' => $data['position'],
            ]);
            $issueNumber++;
        }

        // Add some comments to the first in-progress issue
        $firstInProgress = Issue::where('issue_key', 'TASK-4')->first();
        if ($firstInProgress) {
            Comment::create([
                'issue_id' => $firstInProgress->id,
                'user_id' => $jane->id,
                'body' => 'I started looking into SortableJS and the Alpine.js wrapper. The @alpinejs/sort plugin seems like the best fit for our stack.',
            ]);
            Comment::create([
                'issue_id' => $firstInProgress->id,
                'user_id' => $john->id,
                'body' => 'Great find! Make sure we handle optimistic updates — the card should move instantly in the DOM before the server confirms.',
            ]);
        }
    }
}
