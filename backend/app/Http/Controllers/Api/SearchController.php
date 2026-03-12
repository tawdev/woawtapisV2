<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use App\Models\Type;

class SearchController extends Controller
{
    public function suggestions(Request $request)
    {
        $query = $request->input('q');

        if (empty($query) || strlen($query) < 1) {
            return response()->json([]);
        }

        $suggestions = [];

        // 1. Search Categories (Prefix search for better index use)
        $categories = Category::where('name', 'like', "{$query}%")
            ->limit(5)
            ->get(['id', 'name', 'slug']);
        
        foreach ($categories as $category) {
            $suggestions[] = [
                'id' => 'cat_' . $category->id,
                'name' => $category->name,
                'type' => 'Catégorie',
                'url' => '/products?category=' . $category->id
            ];
        }

        // 2. Search Types (Styles)
        $types = Type::where('name', 'like', "{$query}%")
            ->limit(3)
            ->get(['id', 'name']);
        
        foreach ($types as $type) {
            $suggestions[] = [
                'id' => 'type_' . $type->id,
                'name' => $type->name,
                'type' => 'Style',
                'url' => '/products?type=' . urlencode($type->name)
            ];
        }

        // 3. Search Products
        $products = Product::where('name', 'like', "{$query}%")
            ->where('status', 'active')
            ->limit(5)
            ->get(['id', 'name', 'slug']);
        
        foreach ($products as $product) {
            $suggestions[] = [
                'id' => 'prod_' . $product->id,
                'name' => $product->name,
                'type' => 'Produit',
                'url' => '/product/' . $product->slug
            ];
        }

        return response()->json($suggestions);
    }
}
