<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->handle(Illuminate\Http\Request::capture());

use App\Models\Product;

$p = Product::with('type')->where('slug', 'tapis-marocain-beni-ourain')->first();

if ($p) {
    echo "ID: " . $p->id . "\n";
    echo "Name: " . $p->name . "\n";
    echo "Type: " . ($p->type ? $p->type->name : 'NONE' ) . "\n";
    echo "Max Length: " . $p->max_longueur . "\n";
    echo "Max Width: " . $p->max_largeur . "\n";
    echo "Price: " . $p->price . "\n";
    echo "Color: " . json_encode($p->color) . "\n";
} else {
    echo "Product not found.\n";
}
