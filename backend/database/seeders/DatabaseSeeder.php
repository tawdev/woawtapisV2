<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Type;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $type = Type::create([
            'name' => 'Traditionnel',
            'description' => 'Tapis traditionnels faits main.',
        ]);

        $category = Category::create([
            'type_id' => $type->id,
            'name' => 'Beni Ourain',
            'slug' => 'beni-ourain',
            'description' => 'Tapis berbères authentiques.',
        ]);

        Product::create([
            'name' => 'Tapis Beni Ourain Premium',
            'slug' => 'tapis-beni-ourain-premium',
            'description' => 'Un tapis Beni Ourain 100% laine de mouton, tissé à la main dans le Moyen Atlas.',
            'short_description' => 'Tapis berbère authentique en laine blanche.',
            'price' => 2500,
            'sale_price' => 1999,
            'category_id' => $category->id,
            'type_id' => $type->id,
            'material' => 'Laine',
            'size' => '200x300',
            'color' => json_encode([['name' => 'Blanc/Noir', 'image' => '']]),
            'stock' => 5,
            'featured' => true,
            'best_seller' => true,
            'status' => 'active',
        ]);

        Product::create([
            'name' => 'Tapis Kilim Moderne',
            'slug' => 'tapis-kilim-moderne',
            'description' => 'Tapis Kilim aux motifs géométriques et couleurs vibrantes.',
            'short_description' => 'Kilim moderne tissé main.',
            'price' => 1200,
            'category_id' => $category->id,
            'type_id' => $type->id,
            'material' => 'Laine/Coton',
            'size' => '150x250',
            'color' => json_encode([['name' => 'Multicolore', 'image' => '']]),
            'stock' => 10,
            'featured' => true,
            'status' => 'active',
        ]);
    }
}
