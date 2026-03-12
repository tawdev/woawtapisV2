<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['type_id', 'name', 'slug', 'description', 'image'];

    public function type()
    {
        return $this->belongsTo(Type::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
