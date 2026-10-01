<?php

namespace Src\Domain\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class IssueUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public function __construct(
        public readonly int $issueId,
        public readonly int $projectId,
        public readonly string $field,
        public readonly ?string $oldValue,
        public readonly ?string $newValue,
        public readonly int $updatedByUserId,
    ) {}

    public function broadcastOn(): array
    {
        return [
            new \Illuminate\Broadcasting\PrivateChannel("project.{$this->projectId}"),
        ];
    }
}
