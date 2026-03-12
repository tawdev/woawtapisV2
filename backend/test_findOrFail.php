<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

try {
    $product = App\Models\Product::with(['category', 'type', 'images'])->findOrFail("some-slug");
    echo "Found!\n";
} catch (\Exception $e) {
    echo "Exception Class: " . get_class($e) . "\n";
    echo "Message: " . $e->getMessage() . "\n";
}
