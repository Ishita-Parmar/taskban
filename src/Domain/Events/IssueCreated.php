<?php

namespace Src\Domain\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class IssueCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public function __construct(
        public readonly int $issueId,
        public readonly int $projectId,
        public readonly int $columnId,
        public readonly string $issueKey,
        public readonly string $summary,
        public readonly string $type,
        public readonly string $priority,
        public readonly ?int $assigneeId,
        public readonly int $reporterId,
    ) {}

    public function broadcastOn(): array
    {
        return [
            new \Illuminate\Broadcasting\PrivateChannel("project.{$this->projectId}"),
        ];
    }
}
