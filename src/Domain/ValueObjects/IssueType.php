<?php

namespace Src\Domain\ValueObjects;

enum IssueType: string
{
    case EPIC = 'epic';
    case STORY = 'story';
    case TASK = 'task';
    case BUG = 'bug';

    public function label(): string
    {
        return match ($this) {
            self::EPIC => 'Epic',
            self::STORY => 'Story',
            self::TASK => 'Task',
            self::BUG => 'Bug',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::EPIC => '#6554C0',
            self::STORY => '#36B37E',
            self::TASK => '#4C9AFF',
            self::BUG => '#FF5630',
        };
    }

    public function icon(): string
    {
        return match ($this) {
            self::EPIC => '⚡',
            self::STORY => '📖',
            self::TASK => '✓',
            self::BUG => '🐛',
        };
    }
}
