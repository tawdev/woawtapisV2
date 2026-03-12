<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Product;
use App\Models\ContactMessage;

class AdminStatsController extends Controller
{
    /**
     * Get dashboard statistics.
     */
    public function index()
    {
        $totalSales = Order::where('status', 'delivered')->sum('total_amount');
        $ordersCount = Order::count();
        $productsCount = Product::count();
        $messagesCount = ContactMessage::count();

        $recentOrders = Order::latest()->take(5)->get();

        return response()->json([
            'total_sales' => $totalSales,
            'orders_count' => $ordersCount,
            'products_count' => $productsCount,
            'messages_count' => $messagesCount,
            'recent_orders' => $recentOrders,
        ]);
    }
}
