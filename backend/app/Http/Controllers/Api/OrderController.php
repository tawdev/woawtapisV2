<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:100',
            'customer_email' => 'required|email|max:100',
            'customer_phone' => 'required|string|max:20',
            'customer_address' => 'required|string',
            'customer_city' => 'required|string|max:100',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.custom_dimensions' => 'nullable|array',
            'items.*.custom_dimensions.longueur' => 'nullable|numeric',
            'items.*.custom_dimensions.largeur' => 'nullable|numeric',
            'items.*.price' => 'nullable|numeric',
            'items.*.color' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated) {
            $order = Order::create([
                'order_number' => 'ORD-' . strtoupper(Str::random(10)),
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_phone' => $validated['customer_phone'],
                'customer_address' => $validated['customer_address'],
                'customer_city' => $validated['customer_city'],
                'total_amount' => 0, // Will be calculated
                'status' => 'pending',
            ]);

            $total = 0;
            foreach ($validated['items'] as $itemData) {
                $product = \App\Models\Product::find($itemData['product_id']);
                
                $price = $itemData['price'] ?? ($product->sale_price ?? $product->price);
                $subtotal = $price * $itemData['quantity'];

                $orderItemData = [
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_price' => $product->sale_price ?? $product->price,
                    'quantity' => $itemData['quantity'],
                    'subtotal' => $subtotal,
                    'color' => $itemData['color'] ?? null,
                ];

                if (!empty($itemData['custom_dimensions'])) {
                    $orderItemData['length_cm'] = $itemData['custom_dimensions']['longueur'] ?? null;
                    $orderItemData['width_cm'] = $itemData['custom_dimensions']['largeur'] ?? null;
                    $orderItemData['unit_price'] = $product->sale_price ?? $product->price;
                    $orderItemData['calculated_price'] = $price;
                    
                    if ($orderItemData['length_cm'] && $orderItemData['width_cm']) {
                        $orderItemData['surface_m2'] = ($orderItemData['length_cm'] * $orderItemData['width_cm']) / 10000;
                    }
                }

                OrderItem::create($orderItemData);
                $total += $subtotal;
            }

            $order->update(['total_amount' => $total]);

            return $order->load('items.product.images', 'items.product.primaryImage');
        });
    }

    public function track($order_number)
    {
        $order = Order::where('order_number', $order_number)->firstOrFail();
        return $order->load('items.product.images', 'items.product.primaryImage');
    }
}
