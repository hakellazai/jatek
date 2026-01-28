<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MatchStarted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $match;
    public $config;
    public $players;

    public function __construct($match, $config, $players)
    {
        $this->match = $match;
        $this->config = $config;
        $this->players = $players;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('match.' . $this->match->id);
    }

    public function broadcastAs()
    {
        return 'match.started';
    }
}
