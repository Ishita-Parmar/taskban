<?php

namespace Src\Application\Actions\Projects;

use App\Models\BoardColumn;
use App\Models\Project;
use Src\Application\DTOs\CreateProjectData;

class CreateProject
{
    /**
     * Create a new project with default columns and add the owner as admin.
     */
    public function execute(CreateProjectData $data): Project
    {
        $project = Project::create([
            'name' => $data->name,
            'key' => strtoupper($data->key),
            'description' => $data->description,
            'owner_id' => $data->ownerId,
        ]);

        // Add owner as admin member
        $project->members()->attach($data->ownerId, ['role' => 'admin']);

        // Create default workflow columns
        $defaultColumns = [
            ['name' => 'To Do', 'position' => 0, 'color' => 'gray'],
            ['name' => 'In Progress', 'position' => 1, 'color' => 'blue'],
            ['name' => 'In Review', 'position' => 2, 'color' => 'yellow'],
            ['name' => 'Done', 'position' => 3, 'color' => 'green'],
        ];

        foreach ($defaultColumns as $col) {
            BoardColumn::create([
                'project_id' => $project->id,
                ...$col,
            ]);
        }

        return $project->load(['columns', 'members']);
    }
}
