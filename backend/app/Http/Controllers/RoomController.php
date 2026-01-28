<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\RoomMember;
use App\Http\Requests\CreateRoomRequest;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index()
    {
        $rooms = Room::where('is_private', false)
            ->where('status', 'open')
            ->with(['host', 'activeMembers'])
            ->get()
            ->map(function ($room) {
                return [
                    'id' => $room->id,
                    'name' => $room->name,
                    'host' => $room->host->username,
                    'max_players' => $room->max_players,
                    'current_players' => $room->activeMembers()->count(),
                    'is_private' => $room->is_private,
                    'status' => $room->status,
                    'created_at' => $room->created_at,
                ];
            });

        return response()->json($rooms);
    }

    public function store(CreateRoomRequest $request)
    {
        $room = Room::create([
            'name' => $request->name,
            'host_user_id' => auth()->id(),
            'is_private' => $request->is_private ?? false,
            'max_players' => $request->max_players,
            'status' => 'open',
        ]);

        // Host automatikusan csatlakozik
        RoomMember::create([
            'room_id' => $room->id,
            'user_id' => auth()->id(),
            'is_ready' => false,
        ]);

        return response()->json($room, 201);
    }

    public function join(Request $request, $roomId)
    {
        $room = Room::findOrFail($roomId);

        if (!$room->isOpen()) {
            return response()->json(['error' => 'Room is not available'], 400);
        }

        if ($room->isFull()) {
            return response()->json(['error' => 'Room is full'], 400);
        }

        // Ellenőrzés: már nem tagja-e a szobának
        if (RoomMember::where('room_id', $roomId)->where('user_id', auth()->id())->whereNull('left_at')->exists()) {
            return response()->json(['error' => 'Already in room'], 400);
        }

        RoomMember::create([
            'room_id' => $roomId,
            'user_id' => auth()->id(),
            'is_ready' => false,
        ]);

        return response()->json(['message' => 'Joined room successfully']);
    }

    public function leave(Request $request, $roomId)
    {
        $member = RoomMember::where('room_id', $roomId)
            ->where('user_id', auth()->id())
            ->whereNull('left_at')
            ->firstOrFail();

        $member->update(['left_at' => now()]);

        return response()->json(['message' => 'Left room successfully']);
    }

    public function toggleReady(Request $request, $roomId)
    {
        $member = RoomMember::where('room_id', $roomId)
            ->where('user_id', auth()->id())
            ->whereNull('left_at')
            ->firstOrFail();

        $member->update(['is_ready' => !$member->is_ready]);

        return response()->json(['is_ready' => $member->is_ready]);
    }

    public function start(Request $request, $roomId)
    {
        $room = Room::findOrFail($roomId);

        if ($room->host_user_id !== auth()->id()) {
            return response()->json(['error' => 'Only host can start'], 403);
        }

        $activeMembers = $room->activeMembers()->get();
        if ($activeMembers->count() < 2) {
            return response()->json(['error' => 'Minimum 2 players required'], 400);
        }

        // Összes ready?
        $allReady = $activeMembers->every(fn ($m) => $m->is_ready);
        if (!$allReady && $activeMembers->count() < 2) {
            return response()->json(['error' => 'Not all players are ready'], 400);
        }

        $room->update(['status' => 'in_game']);

        return response()->json(['message' => 'Game started']);
    }
}
