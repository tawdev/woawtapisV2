<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'short_description',
        'price',
        'sale_price',
        'category_id',
        'type_id',
        'type_category_id', // Added this line
        'material',
        'size',
        'color',
        'stock',
        'featured',
        'best_seller',
        'status',
        'max_longueur',
        'max_largeur'
    ];

    protected $casts = [
        'color' => 'array',
        'featured' => 'boolean',
        'best_seller' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function type()
    {
        return $this->belongsTo(Type::class);
    }

    public function typeCategory()
    {
        return $this->belongsTo(TypeCategory::class, 'type_category_id');
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function primaryImage()
    {
        return $this->hasOne(ProductImage::class)->where('is_primary', true);
    }
}
