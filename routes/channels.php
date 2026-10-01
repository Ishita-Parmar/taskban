<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('project.{projectId}', function ($user, $projectId) {
    // Only allow users who are members of this project to listen to its events
    return $user->projects()->where('project_id', $projectId)->exists();
});
