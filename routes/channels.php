<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('chat', function () {
    $user = auth()->user();

    return ['id' => $user->id, 'name' => $user->name];
});
