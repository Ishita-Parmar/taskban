<?php

namespace Src\Domain\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class IssueMoved implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public function __construct(
        public readonly int $issueId,
        public readonly int $projectId,
        public readonly int $oldColumnId,
        public readonly int $newColumnId,
        public readonly float $newPosition,
        public readonly int $movedByUserId,
    ) {}

    public function broadcastOn(): array
    {
        return [
            new \Illuminate\Broadcasting\PrivateChannel("project.{$this->projectId}"),
        ];
    }
}
