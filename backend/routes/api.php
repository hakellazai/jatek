<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\MatchController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ChatController;

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected routes (player auth)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Rooms
    Route::get('/rooms', [RoomController::class, 'index']);
    Route::post('/rooms', [RoomController::class, 'store']);
    Route::post('/rooms/{id}/join', [RoomController::class, 'join']);
    Route::post('/rooms/{id}/leave', [RoomController::class, 'leave']);
    Route::post('/rooms/{id}/ready', [RoomController::class, 'toggleReady']);
    Route::post('/rooms/{id}/start', [RoomController::class, 'start']);

    // Chat
    Route::post('/rooms/{roomId}/chat', [ChatController::class, 'store']);
    Route::get('/rooms/{roomId}/chat', [ChatController::class, 'getByRoom']);

    // Matches
    Route::get('/matches', [MatchController::class, 'index']);
    Route::get('/matches/{id}', [MatchController::class, 'show']);

    // Leaderboard
    Route::get('/leaderboard/global', [LeaderboardController::class, 'global']);
    Route::get('/leaderboard/season/{seasonId}', [LeaderboardController::class, 'bySeason']);
    Route::get('/leaderboard/me', [LeaderboardController::class, 'myRank']);
});

// Admin routes (Bearer token)
Route::post('/admin/login', [AdminController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::middleware('can:isAdmin')->group(function () {
        Route::get('/admin/users', [AdminController::class, 'listUsers']);
        Route::patch('/admin/users/{id}/ban', [AdminController::class, 'banUser']);
        Route::patch('/admin/users/{id}/mute', [AdminController::class, 'muteUser']);
        Route::delete('/admin/chat/{messageId}', [AdminController::class, 'deleteMessage']);
        Route::get('/admin/audit-logs', [AdminController::class, 'getAuditLogs']);
    });
});
