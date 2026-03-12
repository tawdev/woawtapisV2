<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'order_number',
        'customer_name',
        'customer_email',
        'customer_phone',
        'customer_address',
        'customer_city',
        'customer_postal_code',
        'total_amount',
        'status',
        'notes'
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
