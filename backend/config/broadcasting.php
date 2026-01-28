<?php

return [
    'default' => env('BROADCAST_DRIVER', 'null'),

    'connections' => [
        'pusher' => [
            'driver' => 'pusher',
            'key' => env('PUSHER_APP_KEY'),
            'secret' => env('PUSHER_APP_SECRET'),
            'app_id' => env('PUSHER_APP_ID'),
            'options' => [
                'cluster' => env('PUSHER_APP_CLUSTER'),
                'host' => env('PUSHER_HOST'),
                'port' => env('PUSHER_PORT'),
                'scheme' => env('PUSHER_SCHEME')
            ],
            'client_options' => [
                'decode_responses' => true,
            ],
        ],

        'reverb' => [
            'driver' => 'reverb',
        ],

        'null' => [
            'driver' => 'null',
        ],
    ],
];
