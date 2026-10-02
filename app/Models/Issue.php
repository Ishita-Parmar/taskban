<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Src\Domain\ValueObjects\IssueType;
use Src\Domain\ValueObjects\Priority;

class Issue extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'project_id',
        'board_column_id',
        'assignee_id',
        'reporter_id',
        'epic_id',
        'issue_key',
        'type',
        'summary',
        'description',
        'priority',
        'deadline',
        'position',
    ];

    protected $casts = [
        'type' => IssueType::class,
        'priority' => Priority::class,
        'position' => 'double',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function column(): BelongsTo
    {
        return $this->belongsTo(BoardColumn::class, 'board_column_id');
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assignee_id');
    }

    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    public function epic(): BelongsTo
    {
        return $this->belongsTo(Issue::class, 'epic_id');
    }

    public function subtasks(): HasMany
    {
        return $this->hasMany(Issue::class, 'epic_id');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class)->orderBy('created_at', 'desc');
    }

    public function activities(): HasMany
    {
        return $this->hasMany(IssueActivity::class)->orderBy('created_at', 'desc');
    }
}
