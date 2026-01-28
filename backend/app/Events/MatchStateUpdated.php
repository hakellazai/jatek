<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MatchStateUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $match;
    public $tick;
    public $playersState;
    public $pickupsState;

    public function __construct($match, $tick, $playersState, $pickupsState)
    {
        $this->match = $match;
        $this->tick = $tick;
        $this->playersState = $playersState;
        $this->pickupsState = $pickupsState;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('match.' . $this->match->id);
    }

    public function broadcastAs()
    {
        return 'match.state';
    }
}
