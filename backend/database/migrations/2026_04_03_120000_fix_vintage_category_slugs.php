<?php

namespace Database\Migrations;

use Illuminate\Database\Migrations\Migration;
use App\Models\Category;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $vintageCats = [
            'marocain vintage' => 'marocain-vintage',
            'turc vintage' => 'turc-vintage',
            "L'iran vintage" => 'liran-vintage',
            "L'iran on stock" => 'l-iran-on-stock'
        ];

        foreach ($vintageCats as $name => $targetSlug) {
            $category = Category::where('name', $name)->first();
            if ($category) {
                $category->slug = $targetSlug;
                $category->save();
                echo "Updated category '{$name}' to slug '{$targetSlug}'\n";
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No reverse needed for data fix
    }
};
