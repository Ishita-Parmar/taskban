<?php

namespace Src\Domain\ValueObjects;

enum Priority: string
{
    case HIGHEST = 'highest';
    case HIGH = 'high';
    case MEDIUM = 'medium';
    case LOW = 'low';
    case LOWEST = 'lowest';

    public function label(): string
    {
        return match ($this) {
            self::HIGHEST => 'Highest',
            self::HIGH => 'High',
            self::MEDIUM => 'Medium',
            self::LOW => 'Low',
            self::LOWEST => 'Lowest',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::HIGHEST => '#FF5630',
            self::HIGH => '#FF5630',
            self::MEDIUM => '#FF991F',
            self::LOW => '#36B37E',
            self::LOWEST => '#36B37E',
        };
    }

    public function icon(): string
    {
        return match ($this) {
            self::HIGHEST => '⬆⬆',
            self::HIGH => '⬆',
            self::MEDIUM => '➡',
            self::LOW => '⬇',
            self::LOWEST => '⬇⬇',
        };
    }
}
