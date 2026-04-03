<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Category;
use Illuminate\Support\Str;

$categories = Category::all();
echo "Checking " . $categories->count() . " categories...\n";

foreach ($categories as $category) {
    if (empty($category->slug)) {
        $category->slug = Str::slug($category->name);
        $category->save();
        echo "Updated category #{$category->id}: '{$category->name}' -> slug: '{$category->slug}'\n";
    } else {
        echo "Category #{$category->id}: '{$category->name}' already has slug: '{$category->slug}'\n";
    }
}

echo "Done.\n";
