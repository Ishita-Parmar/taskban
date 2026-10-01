<?php

namespace Src\Application\DTOs;

class CreateIssueData
{
    public function __construct(
        public readonly int $projectId,
        public readonly string $type,
        public readonly string $summary,
        public readonly ?string $description = null,
        public readonly string $priority = 'medium',
        public readonly ?int $assigneeId = null,
        public readonly int $reporterId = 0,
        public readonly ?int $columnId = null,
    ) {}
}
