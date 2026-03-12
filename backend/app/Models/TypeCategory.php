<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TypeCategory extends Model
{
    protected $table = 'types_categorier';
    public $timestamps = false;

    protected $fillable = ['name', 'category_id'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class, 'type_category_id');
    }
}
