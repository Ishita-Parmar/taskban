<?php

namespace Src\Domain\ValueObjects;

enum ProjectRole: string
{
    case ADMIN = 'admin';
    case MEMBER = 'member';
    case VIEWER = 'viewer';

    public function label(): string
    {
        return match ($this) {
            self::ADMIN => 'Admin',
            self::MEMBER => 'Member',
            self::VIEWER => 'Viewer',
        };
    }

    public function canEditIssues(): bool
    {
        return match ($this) {
            self::ADMIN, self::MEMBER => true,
            self::VIEWER => false,
        };
    }

    public function canManageProject(): bool
    {
        return $this === self::ADMIN;
    }
}
