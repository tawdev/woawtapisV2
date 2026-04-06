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
    public function index(Request $request)
    {
        $selectedMonth = $request->input('month');
        $selectedYear = $request->input('year');

        $totalSales = Order::where('status', 'delivered')->sum('total_amount');
        $ordersCount = Order::count();
        $productsCount = Product::count();
        $messagesCount = ContactMessage::count();
        
        $pendingOrders = Order::where('status', 'pending')->count();
        $surMesureCount = ContactMessage::where('subject', 'LIKE', '%SUR MESURE%')->count();
        $lowStockProducts = Product::where('stock', '<=', 2)->get();
        $lowStockCount = $lowStockProducts->count();

        $recentOrders = Order::latest()->take(6)->get();

        // Monthly trends
        $monthlySales = [];
        
        if ($selectedMonth && $selectedYear) {
            $iterations = 1;
        } else {
            $iterations = 6;
        }

        for ($i = $iterations - 1; $i >= 0; $i--) {
            if ($selectedMonth && $selectedYear) {
                $date = \Carbon\Carbon::createFromDate($selectedYear, $selectedMonth, 1);
            } else {
                $date = now()->subMonths($i);
            }
            
            // Sales
            $sales = Order::whereMonth('created_at', $date->month)
                ->whereYear('created_at', $date->year)
                ->where('status', 'delivered')
                ->sum('total_amount');

            // Top 10 sellers of that month
            $topProducts = \App\Models\OrderItem::join('orders', 'order_items.order_id', '=', 'orders.id')
                ->whereMonth('orders.created_at', $date->month)
                ->whereYear('orders.created_at', $date->year)
                ->where('orders.status', 'delivered')
                ->select(
                    'order_items.product_id', 
                    'order_items.product_name', 
                    \Illuminate\Support\Facades\DB::raw('sum(order_items.quantity) as total_sold')
                )
                ->groupBy('order_items.product_id', 'order_items.product_name')
                ->orderByDesc('total_sold')
                ->with(['product.primaryImage'])
                ->take(10)
                ->get();

            // Top Categories of that month
            $topCategories = \App\Models\OrderItem::join('orders', 'order_items.order_id', '=', 'orders.id')
                ->join('products', 'order_items.product_id', '=', 'products.id')
                ->join('categories', 'products.category_id', '=', 'categories.id')
                ->whereMonth('orders.created_at', $date->month)
                ->whereYear('orders.created_at', $date->year)
                ->where('orders.status', 'delivered')
                ->select(
                    'categories.id', 
                    'categories.name', 
                    \Illuminate\Support\Facades\DB::raw('count(order_items.id) as orders_count'),
                    \Illuminate\Support\Facades\DB::raw('sum(order_items.quantity) as total_sold'),
                    \Illuminate\Support\Facades\DB::raw('sum(order_items.subtotal) as total_revenue')
                )
                ->groupBy('categories.id', 'categories.name')
                ->orderByDesc('total_revenue')
                ->take(5)
                ->get();

            $monthlySales[] = [
                'name' => $date->translatedFormat('F'),
                'month' => $date->month,
                'year' => $date->year,
                'total' => (float)$sales,
                'top_products' => $topProducts->map(function($item) {
                    return [
                        'name' => $item->product_name,
                        'sold' => (int)$item->total_sold,
                        'image' => $item->product?->primaryImage?->image_path,
                        'product_id' => $item->product_id
                    ];
                }),
                'top_categories' => $topCategories->map(function($item) {
                    return [
                        'name' => $item->name,
                        'orders' => (int)$item->orders_count,
                        'sold' => (int)$item->total_sold,
                        'revenue' => (float)$item->total_revenue
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
            'sur_mesure_count' => $surMesureCount,
            'low_stock_count' => $lowStockCount,
            'low_stock_products' => $lowStockProducts->take(5),
            'recent_orders' => $recentOrders,
            'monthly_sales' => $monthlySales,
            'selected_filter' => [
                'month' => $selectedMonth,
                'year' => $selectedYear
            ]
        ]);
    }
}
