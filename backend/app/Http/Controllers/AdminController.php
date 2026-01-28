<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\AuditLog;
use App\Http\Requests\AdminLoginRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AdminController extends Controller
{
    public function login(AdminLoginRequest $request)
    {
        $user = User::where('username', $request->username)->first();

        if (!$user || $user->role !== 'admin' || !Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Invalid admin credentials'], 401);
        }

        $token = $user->createToken('admin-token', ['admin'])->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function listUsers()
    {
        $users = User::all();

        return response()->json($users);
    }

    public function banUser(Request $request, $userId)
    {
        $user = User::findOrFail($userId);
        $user->update(['is_banned' => true]);

        AuditLog::create([
            'admin_user_id' => auth()->id(),
            'action' => 'BAN_USER',
            'payload' => ['user_id' => $userId, 'username' => $user->username],
        ]);

        return response()->json(['message' => 'User banned']);
    }

    public function muteUser(Request $request, $userId)
    {
        $duration = $request->input('duration_minutes', 60); // Alapértelmezés: 1 óra
        $user = User::findOrFail($userId);
        $user->update(['muted_until' => now()->addMinutes($duration)]);

        AuditLog::create([
            'admin_user_id' => auth()->id(),
            'action' => 'MUTE_USER',
            'payload' => ['user_id' => $userId, 'username' => $user->username, 'duration_minutes' => $duration],
        ]);

        return response()->json(['message' => 'User muted']);
    }

    public function deleteMessage(Request $request, $messageId)
    {
        $message = \App\Models\ChatMessage::findOrFail($messageId);
        $message->update(['is_deleted' => true]);

        AuditLog::create([
            'admin_user_id' => auth()->id(),
            'action' => 'DELETE_MESSAGE',
            'payload' => ['message_id' => $messageId, 'room_id' => $message->room_id],
        ]);

        return response()->json(['message' => 'Message deleted']);
    }

    public function getAuditLogs()
    {
        $logs = AuditLog::with('admin')
            ->orderByDesc('created_at')
            ->limit(100)
            ->get();

        return response()->json($logs);
    }
}
