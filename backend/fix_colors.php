<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$products = DB::table('products')->get(['id', 'name', 'color']);
$invalid = [];

foreach ($products as $product) {
    if (!empty($product->color)) {
        $decoded = json_decode($product->color);
        if (json_last_error() !== JSON_ERROR_NONE) {
            $invalid[] = [
                'id' => $product->id,
                'name' => $product->name,
                'color' => $product->color
            ];
        }
    }
}

echo "Found " . count($invalid) . " products with invalid color JSON:\n";
foreach ($invalid as $p) {
    echo "ID: {$p['id']} | Color: {$p['color']}\n";
}
