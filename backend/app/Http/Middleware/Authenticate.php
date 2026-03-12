<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        if ($request->expectsJson()) {
            return null;
        }

        // Return null so it throws a 401 instead of redirecting to a named route
        return null;
    }

    /**
     * Handle an unauthenticated user.
     * Override to always return a JSON 401 response for API routes.
     */
    protected function unauthenticated($request, array $guards)
    {
        abort(response()->json(['message' => 'Unauthenticated.'], 401));
    }
}
