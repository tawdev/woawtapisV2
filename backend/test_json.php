<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

try {
    $product = App\Models\Product::with(['category', 'type', 'images'])->findOrFail(47);
    $productJson = $product->toJson();
    echo "Product JSON Length: " . strlen($productJson) . "\n";
} catch (\Exception $e) {
    echo "Error Product: " . $e->getMessage() . "\n";
}

try {
    $categories = App\Models\Category::with('type')->get();
    $categoriesJson = $categories->toJson();
    echo "Categories JSON Length: " . strlen($categoriesJson) . "\n";
} catch (\Exception $e) {
    echo "Error Categories: " . $e->getMessage() . "\n";
}
