<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

try {
    $products = App\Models\Product::all();
    $productsJson = $products->toJson();
    echo "All Products JSON Length: " . strlen($productsJson) . "\n";
} catch (\Exception $e) {
    echo "Error all products: " . $e->getMessage() . "\n";
}
