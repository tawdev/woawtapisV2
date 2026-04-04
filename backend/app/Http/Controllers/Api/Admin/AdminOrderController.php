<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use Illuminate\Validation\Rule;

class AdminOrderController extends Controller
{
    /**
     * Display a listing of orders.
     */
    public function index()
    {
        return Order::latest()->paginate(20);
    }

    /**
     * Display the specified order.
     */
    public function show(Order $order)
    {
        return $order->load(['items.product.primaryImage']);
    }

    /**
     * Update the status of the specified order.
     */
    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])],
        ]);

        $oldStatus = $order->status;
        $newStatus = $validated['status'];

        if ($newStatus === 'cancelled' && $oldStatus !== 'cancelled') {
            foreach ($order->items as $item) {
                if ($item->product && $item->product->stock !== null) {
                    $item->product->increment('stock', (int)$item->quantity);
                }
            }
        } elseif ($oldStatus === 'cancelled' && $newStatus !== 'cancelled') {
            // If reactivating a cancelled order, decrement stock again
            foreach ($order->items as $item) {
                if ($item->product && $item->product->stock !== null) {
                    $item->product->decrement('stock', (int)$item->quantity);
                }
            }
        }

        $order->update($validated);

        return response()->json($order);
    }

    /**
     * Remove the specified order.
     */
    public function destroy(Order $order)
    {
        $order->delete();

        return response()->json(null, 204);
    }
}
