<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ChatMessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $room;
    public $user;
    public $message;
    public $createdAt;

    public function __construct($room, $user, $message, $createdAt)
    {
        $this->room = $room;
        $this->user = $user;
        $this->message = $message;
        $this->createdAt = $createdAt;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('room.' . $this->room->id);
    }

    public function broadcastAs()
    {
        return 'chat.message';
    }
}
