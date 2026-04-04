<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\BlogPostController;
use App\Http\Controllers\Api\Admin\AdminAuthController;
use App\Http\Controllers\Api\Admin\AdminProductController;
use App\Http\Controllers\Api\Admin\AdminCategoryController;
use App\Http\Controllers\Api\Admin\AdminOrderController;
use App\Http\Controllers\Api\Admin\AdminMessageController;
use App\Http\Controllers\Api\Admin\AdminStatsController;
use App\Http\Controllers\Api\SearchController;

Route::get('/products', [ProductController::class, 'index']);
Route::get('/search/suggestions', [SearchController::class, 'suggestions']);
Route::get('/products/{product:slug}', [ProductController::class, 'show']);
Route::get('/featured-products', [ProductController::class, 'featured']);
Route::get('/best-sellers', [ProductController::class, 'bestSellers']);

Route::get('/categories', [CategoryController::class, 'index']);

Route::post('/orders', [OrderController::class, 'store']);
Route::get('/orders/track/{order_number}', [OrderController::class, 'track']);

Route::post('/contact', [ContactController::class, 'store']);

// Blog Routes
Route::get('/blog', [BlogPostController::class, 'index']);
Route::get('/blog/{slug}', [BlogPostController::class, 'show']);

// Admin Routes
Route::prefix('admin')->group(function () {
    Route::post('/login', [AdminAuthController::class, 'login'])->middleware('throttle:5,1');

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AdminAuthController::class, 'me']);
        Route::post('/logout', [AdminAuthController::class, 'logout']);

        Route::get('/stats', [AdminStatsController::class, 'index']);

        Route::apiResource('products', AdminProductController::class);
        Route::post('products/{id}/images', [AdminProductController::class, 'addImage']);
        Route::delete('products/{id}/images/{imageId}', [AdminProductController::class, 'deleteImage']);
        Route::patch('products/{id}/images/{imageId}/primary', [AdminProductController::class, 'setPrimaryImage']);
        Route::apiResource('categories', AdminCategoryController::class);
        Route::apiResource('orders', AdminOrderController::class)->except(['store', 'update']);
        Route::patch('orders/{order}/status', [AdminOrderController::class, 'updateStatus']);
        Route::apiResource('messages', AdminMessageController::class)->only(['index', 'show', 'destroy']);
    });
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
