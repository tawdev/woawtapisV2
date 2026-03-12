<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ContactMessage;

class AdminMessageController extends Controller
{
    /**
     * Display a listing of messages.
     */
    public function index()
    {
        return ContactMessage::latest()->paginate(20);
    }

    /**
     * Display the specified message.
     */
    public function show(ContactMessage $message)
    {
        return $message;
    }

    /**
     * Remove the specified message.
     */
    public function destroy(ContactMessage $message)
    {
        $message->delete();

        return response()->json(null, 204);
    }
}
