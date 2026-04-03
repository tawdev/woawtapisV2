<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$cats = \App\Models\Category::all();
foreach($cats as $c) {
    echo $c->id . ' - ' . $c->name . ' (Slug: ' . ($c->slug ?? 'NULL') . ")\n";
}

echo "PRODUCTS TURC VINTAGE:\n";
$turc = \App\Models\Category::where('name', 'like', '%turc%vintage%')->first();
if ($turc) {
    $products = \App\Models\Product::where('category_id', $turc->id)->get();
    foreach($products as $p) {
        echo "- " . $p->id . ": " . $p->name . "\n";
    }
} else {
    echo "NO TURC VINTAGE CATEGORY FOUND\n";
}
