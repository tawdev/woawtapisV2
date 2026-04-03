<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$categories = ['marocain vintage', 'turc vintage', "L'iran vintage"];
foreach ($categories as $name) {
    $m = App\Models\Category::where('name', $name)->first();
    if ($m) {
        $count = App\Models\Product::where('category_id', $m->id)->count();
        echo "NAME: {$m->name} | ID: {$m->id} | Slug: {$m->slug} | Count: {$count}\n";
    } else {
        echo "NAME: {$name} | NOT FOUND\n";
    }
}
