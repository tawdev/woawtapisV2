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
        
        $pendingOrders = Order::where('status', 'pending')->count();
        $lowStockProducts = Product::where('stock', '<=', 2)->get();
        $lowStockCount = $lowStockProducts->count();

        $recentOrders = Order::latest()->take(6)->get();

        // Monthly trends (last 6 months)
        $monthlySales = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            
            // Sales
            $sales = Order::whereMonth('created_at', $date->month)
                ->whereYear('created_at', $date->year)
                ->where('status', 'delivered')
                ->sum('total_amount');

            // Top 5 sellers of that month
            $topProducts = \App\Models\OrderItem::whereMonth('created_at', $date->month)
                ->whereYear('created_at', $date->year)
                ->select('product_id', 'product_name', \Illuminate\Support\Facades\DB::raw('sum(quantity) as total_sold'))
                ->with(['product.primaryImage'])
                ->groupBy('product_id', 'product_name')
                ->orderByDesc('total_sold')
                ->take(5)
                ->get();

            $monthlySales[] = [
                'name' => $date->translatedFormat('F'), // Full month name
                'total' => (float)$sales,
                'top_products' => $topProducts->map(function($item) {
                    return [
                        'name' => $item->product_name,
                        'sold' => (int)$item->total_sold,
                        'image' => $item->product?->primaryImage?->image_path,
                        'id' => $item->product_id
                    ];
                })
            ];
        }

        return response()->json([
            'total_sales' => (float)$totalSales,
            'orders_count' => $ordersCount,
            'products_count' => $productsCount,
            'messages_count' => $messagesCount,
            'pending_orders' => $pendingOrders,
            'low_stock_count' => $lowStockCount,
            'low_stock_products' => $lowStockProducts->take(5),
            'recent_orders' => $recentOrders,
            'monthly_sales' => $monthlySales
        ]);
    }
}
