<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

$products = DB::table('products')->get(['id', 'name', 'color']);
$fixedCount = 0;

foreach ($products as $product) {
    if (!empty($product->color)) {
        json_decode($product->color);
        if (json_last_error() !== JSON_ERROR_NONE) {
            // It's invalid JSON. Let's assume it's a comma-separated string or just a single string.
            // Example: "Green" -> ["Green"]
            // Example: "Green, Blue" -> ["Green", "Blue"]
            
            $colorsArray = array_map('trim', explode(',', $product->color));
            $newColorJson = json_encode($colorsArray, JSON_UNESCAPED_UNICODE);
            
            DB::table('products')->where('id', $product->id)->update([
                'color' => $newColorJson
            ]);
            
            echo "Fixed Product ID {$product->id}: {$product->color} -> {$newColorJson}\n";
            $fixedCount++;
        }
    }
}

echo "Successfully fixed {$fixedCount} product colors.\n";
