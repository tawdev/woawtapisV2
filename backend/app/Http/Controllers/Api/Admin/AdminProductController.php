<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AdminProductController extends Controller
{
    /**
     * Display a listing of products.
     */
    public function index(Request $request)
    {
        $query = Product::with(['category', 'type', 'images']);
        
        if ($request->has('search') && !empty($request->search)) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->has('category_id') && !empty($request->category_id)) {
            $query->where('category_id', $request->category_id);
        }

        return $query->latest()->paginate(20);
    }

    /**
     * Store a newly created product.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'status' => ['required', Rule::in(['active', 'inactive'])],
            'category_id' => 'required|exists:categories,id',
            'type_id' => 'required|exists:types,id',
            'material' => 'nullable|string',
            'size' => 'nullable|string',
            'color' => 'nullable|array',
            'is_featured' => 'boolean',
            'is_best_seller' => 'boolean',
            'max_longueur' => 'nullable|integer|min:0',
            'max_largeur' => 'nullable|integer|min:0',
        ]);

        $validated['slug'] = Str::slug($validated['name']) . '-' . rand(100, 999);

        // Map frontend fields to backend columns
        if (isset($validated['is_featured'])) {
            $validated['featured'] = $validated['is_featured'];
        }
        if (isset($validated['is_best_seller'])) {
            $validated['best_seller'] = $validated['is_best_seller'];
        }

        $product = Product::create($validated);

        return response()->json($product, 201);
    }

    /**
     * Display the specified product.
     */
    public function show($id)
    {
        return Product::with(['category', 'type', 'images'])->findOrFail($id);
    }

    /**
     * Update the specified product.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string',
            'price' => 'sometimes|required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'stock' => 'sometimes|required|integer|min:0',
            'status' => ['sometimes', 'required', Rule::in(['active', 'inactive'])],
            'category_id' => 'sometimes|required|exists:categories,id',
            'type_id' => 'sometimes|required|exists:types,id',
            'material' => 'nullable|string',
            'size' => 'nullable|string',
            'color' => 'nullable|array',
            'is_featured' => 'boolean',
            'is_best_seller' => 'boolean',
            'max_longueur' => 'nullable|integer|min:0',
            'max_largeur' => 'nullable|integer|min:0',
        ]);

        if (isset($validated['name']) && $validated['name'] !== $product->name) {
            $validated['slug'] = Str::slug($validated['name']) . '-' . rand(100, 999);
        }

        // Map frontend fields to backend columns
        if (isset($validated['is_featured'])) {
            $validated['featured'] = $validated['is_featured'];
        }
        if (isset($validated['is_best_seller'])) {
            $validated['best_seller'] = $validated['is_best_seller'];
        }

        $product->update($validated);

        return response()->json($product);
    }

    /**
     * Remove the specified product.
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json(null, 204);
    }

    /**
     * Add an image to a product.
     */
    public function addImage(Request $request, $id)
    {
        $request->validate([
            'image_url' => 'nullable|string|url',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $product = Product::findOrFail($id);
        $addedImages = [];

        // Handle multiple files
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('products', 'public');
                $addedImages[] = $product->images()->create([
                    'image_path' => 'storage/' . $path,
                    'is_primary' => $product->images()->count() === 0,
                    'display_order' => $product->images()->count() + 1
                ]);
            }
            return response()->json($addedImages, 201);
        }

        // Handle single file or URL
        $imagePath = null;
        if ($request->hasFile('image_file')) {
            $imagePath = $request->file('image_file')->store('products', 'public');
            $imagePath = 'storage/' . $imagePath;
        } elseif ($request->filled('image_url')) {
            $imagePath = $request->image_url;
        }

        if (!$imagePath) {
            return response()->json(['message' => 'L\'image est requise (URL ou fichier).'], 422);
        }

        $isFirst = $product->images()->count() === 0;

        $image = $product->images()->create([
            'image_path' => $imagePath,
            'is_primary' => $isFirst,
            'display_order' => $product->images()->count() + 1
        ]);

        return response()->json($image, 201);
    }

    /**
     * Delete a product image.
     */
    public function deleteImage($id, $imageId)
    {
        $product = Product::findOrFail($id);
        $image = $product->images()->findOrFail($imageId);

        // If local file, delete from storage
        if (Str::startsWith($image->image_path, 'storage/')) {
            $storagePath = Str::after($image->image_path, 'storage/');
            \Illuminate\Support\Facades\Storage::disk('public')->delete($storagePath);
        }

        $wasPrimary = $image->is_primary;
        $image->delete();

        // If we deleted the primary image, set another one as primary
        if ($wasPrimary) {
            $nextPrimary = $product->images()->first();
            if ($nextPrimary) {
                $nextPrimary->update(['is_primary' => true]);
            }
        }

        return response()->json(null, 204);
    }

    /**
     * Set an image as primary.
     */
    public function setPrimaryImage($id, $imageId)
    {
        $product = Product::findOrFail($id);
        
        // Reset all to false
        $product->images()->update(['is_primary' => false]);
        
        // Set the selected one to true
        $image = $product->images()->findOrFail($imageId);
        $image->update(['is_primary' => true]);

        return response()->json($image);
    }
}
