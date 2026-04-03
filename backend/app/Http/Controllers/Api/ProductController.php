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

        // Dimension filters — check dedicated columns OR parse from size field (format "NxM")
        if ($request->filled('max_longueur')) {
            $val = (int) $request->input('max_longueur');
            $query->where(function ($q) use ($val) {
                // Use max_longueur column if set, else parse first part of size (e.g. "200x300" → 200)
                $q->where('max_longueur', '<=', $val)
                  ->orWhere(function ($q2) use ($val) {
                      $q2->whereNull('max_longueur')
                         ->whereRaw("CAST(SUBSTRING_INDEX(REPLACE(size, ' ', ''), 'x', 1) AS UNSIGNED) <= ?", [$val]);
                  });
            });
        }

        if ($request->filled('max_largeur')) {
            $val = (int) $request->input('max_largeur');
            $query->where(function ($q) use ($val) {
                // Use max_largeur column if set, else parse second part of size (e.g. "200x300" → 300)
                $q->where('max_largeur', '<=', $val)
                  ->orWhere(function ($q2) use ($val) {
                      $q2->whereNull('max_largeur')
                         ->whereRaw("CAST(SUBSTRING_INDEX(REPLACE(size, ' ', ''), 'x', -1) AS UNSIGNED) <= ?", [$val]);
                  });
            });
        }

        // New Special filters
        if ($request->boolean('is_couloir')) {
            $query->where('is_couloir', true);
        }
        if ($request->boolean('is_tapis_de_lit')) {
            $query->where('is_tapis_de_lit', true);
        }
        if ($request->filled('sub_category')) {
            $query->where('sub_category', $request->sub_category);
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
            'images'
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
            'images'
        ])
            ->where('best_seller', true)
            ->where('status', 'active')
            ->limit(8)
            ->get();
    }
}
