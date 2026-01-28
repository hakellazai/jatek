<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;

class AdminPolicy
{
    public function isAdmin(User $user): Response
    {
        return $user->role === 'admin'
            ? Response::allow()
            : Response::deny('Only admins can access this resource');
    }
}
