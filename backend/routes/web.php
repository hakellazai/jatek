<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['message' => 'Grid Conquest API is running']);
});

// Health check
Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});
