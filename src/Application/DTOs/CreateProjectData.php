<?php

namespace Src\Application\DTOs;

class CreateProjectData
{
    public function __construct(
        public readonly string $name,
        public readonly string $key,
        public readonly ?string $description = null,
        public readonly int $ownerId = 0,
    ) {}
}
