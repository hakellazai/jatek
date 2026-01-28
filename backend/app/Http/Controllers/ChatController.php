<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use App\Models\Room;
use App\Http\Requests\ChatMessageRequest;
use App\Events\ChatMessageSent;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function store(ChatMessageRequest $request, $roomId)
    {
        $room = Room::findOrFail($roomId);

        // Ellenőrzés: muted?
        if (auth()->user()->isMuted()) {
            return response()->json(['error' => 'You are muted'], 403);
        }

        $message = ChatMessage::create([
            'room_id' => $roomId,
            'user_id' => auth()->id(),
            'message' => $request->message,
            'is_deleted' => false,
        ]);

        // Broadcast az üzenetet
        broadcast(new ChatMessageSent(
            $room,
            auth()->user(),
            $message->message,
            $message->created_at
        ));

        return response()->json($message, 201);
    }

    public function getByRoom($roomId)
    {
        $messages = ChatMessage::where('room_id', $roomId)
            ->where('is_deleted', false)
            ->with('user')
            ->orderByDesc('created_at')
            ->limit(50)
            ->get()
            ->reverse();

        return response()->json($messages);
    }
}
