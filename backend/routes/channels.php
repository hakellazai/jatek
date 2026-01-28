<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Match channels (private)
Broadcast::channel('match.{id}', function ($user) {
    return true; // Bárki hallgathatja, aki autentikálva van
});

// Room channels (private)
Broadcast::channel('room.{id}', function ($user) {
    return true;
});
