<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\IssueController;
use App\Http\Controllers\TeamMemberController;
use App\Http\Controllers\CommentController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/super-admin/data', [\App\Http\Controllers\SuperAdminController::class, 'dashboardData']);
    Route::post('/super-admin/managers', [\App\Http\Controllers\SuperAdminController::class, 'createManager']);
    Route::post('/super-admin/users/{user}/grant-manager', [\App\Http\Controllers\SuperAdminController::class, 'grantManager']);
    Route::post('/super-admin/users/{user}/revoke-manager', [\App\Http\Controllers\SuperAdminController::class, 'revokeManager']);
    Route::get('/my-tasks', [\App\Http\Controllers\MyTasksController::class, 'index']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    Route::apiResource('projects', ProjectController::class);
    
    Route::apiResource('projects.issues', IssueController::class);
    Route::put('projects/{project}/issues/{issue}/move', [IssueController::class, 'move']);

    Route::apiResource('projects.members', TeamMemberController::class)->except(['show']);
    
    Route::apiResource('issues.comments', CommentController::class)->except(['show']);
});
