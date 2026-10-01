<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    protected $fillable = [
        'key',
        'name',
        'description',
        'owner_id',
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->withPivot('role')
            ->withTimestamps();
    }

    public function columns(): HasMany
    {
        return $this->hasMany(BoardColumn::class)->orderBy('position');
    }

    public function issues(): HasMany
    {
        return $this->hasMany(Issue::class);
    }

    /**
     * Generate the next issue key for this project (e.g., TASK-5).
     */
    public function nextIssueKey(): string
    {
        $maxNumber = $this->issues()
            ->withTrashed()
            ->selectRaw("MAX(CAST(SUBSTR(issue_key, LENGTH(?) + 2) AS INTEGER)) as max_num", [$this->key])
            ->value('max_num');

        $nextNumber = ($maxNumber ?? 0) + 1;

        return $this->key . '-' . $nextNumber;
    }
}
