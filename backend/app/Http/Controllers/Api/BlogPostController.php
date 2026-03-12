<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BlogPost;

class BlogPostController extends Controller
{
    public function index()
    {
        return BlogPost::where('status', 'published')
            ->orderBy('published_at', 'desc')
            ->paginate(12);
    }

    public function show($slug)
    {
        return BlogPost::where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();
    }
}
