<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Product;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'images', 'type']);

        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        if ($request->filled('type')) {
            $typeName = $request->input('type');
            $query->whereHas('type', function ($q) use ($typeName) {
                $q->where('name', $typeName);
            });
        }

        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                    ->orWhere('description', 'like', "%{$searchTerm}%")
                    ->orWhere('material', 'like', "%{$searchTerm}%");
            });
        }

        if ($request->filled('colors')) {
            $colorList = explode(',', $request->input('colors'));
            $query->where(function ($q) use ($colorList) {
                foreach ($colorList as $color) {
                    $color = trim($color);
                    $q->orWhere('color', 'like', "%{$color}%");
                }
            });
        }

        // Legacy single color param support
        if ($request->filled('color') && !$request->filled('colors')) {
            $color = $request->input('color');
            $query->where('color', 'like', "%{$color}%");
        }

        return $query->paginate($request->input('per_page', 12));
    }

    public function show(Product $product)
    {
        return $product->load([
            'category',
            'type',
            'images' => function ($q) {
                $q->orderBy('display_order', 'asc');
            }
        ]);
    }

    public function featured()
    {
        return Product::with([
            'category',
            'type',
            'images' => function ($q) {
                $q->where('is_primary', true);
            }
        ])
            ->where('featured', true)
            ->where('status', 'active')
            ->limit(8)
            ->get();
    }

    public function bestSellers()
    {
        return Product::with([
            'category',
            'type',
            'images' => function ($q) {
                $q->where('is_primary', true);
            }
        ])
            ->where('best_seller', true)
            ->where('status', 'active')
            ->limit(8)
            ->get();
    }
}
