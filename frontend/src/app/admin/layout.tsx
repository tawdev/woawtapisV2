'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    Layers,
    ShoppingCart,
    MessageSquare,
    LogOut,
    Menu,
    X,
    User,
    BarChart3,
    History as StockIcon
} from 'lucide-react';
import adminService from '@/services/admin';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    const [lowStockCount, setLowStockCount] = useState(0);
    const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

    useEffect(() => {
        // Basic check for token
        const token = localStorage.getItem('admin_token');
        if (!token && pathname !== '/admin/login') {
            router.push('/admin/login');
        } else {
            setIsAuthenticated(true);
        }
    }, [pathname, router]);

    useEffect(() => {
        if (pathname === '/admin/login') return;

        const fetchCounts = async () => {
            try {
                // Fetch low stock products
                const productRes = await adminService.getProducts(1, '', '');
                const lowStock = productRes.data.data.filter((p: any) => (p.stock ?? 0) < 10);
                setLowStockCount(lowStock.length);

                // Fetch pending orders
                const orderRes = await adminService.getOrders(1);
                const pending = orderRes.data.data.filter((o: any) => o.status === 'pending');
                setPendingOrdersCount(pending.length);
            } catch (error) {
                console.error('Failed to fetch counts:', error);
            }
        };
        fetchCounts();
        
        // Refresh every 5 minutes
        const interval = setInterval(fetchCounts, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [pathname]);

    const handleLogout = async () => {
        try {
            await adminService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('admin_token');
            router.push('/admin/login');
        }
    };

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900"></div>
            </div>
        );
    }


    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Analyse', href: '/admin/analytics', icon: BarChart3 },
        { name: 'Produits', href: '/admin/products', icon: Package },
        { name: 'Stock', href: '/admin/inventory', icon: StockIcon, badge: lowStockCount > 0 ? lowStockCount : null },
        { name: 'Catégories', href: '/admin/categories', icon: Layers },
        { name: 'Commandes', href: '/admin/orders', icon: ShoppingCart, badge: pendingOrdersCount > 0 ? pendingOrdersCount : null },
        { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
    ];

    return (
        <div className="h-screen bg-stone-50 flex overflow-hidden print:h-auto print:overflow-visible print:block">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-white border-r border-stone-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] transform print:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 lg:static lg:inset-0`}
            >
                <div className="h-full flex flex-col relative overflow-hidden">
                    {/* Decorative background element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-stone-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                    
                    <div className="h-24 flex items-center px-8 relative z-10">
                        <Link href="/admin" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-stone-900 rounded-[1.25rem] flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:rotate-3 transition-transform duration-500">
                                <span className="text-white font-playfair font-bold italic text-xl leading-none">W</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-playfair font-bold text-stone-900 tracking-tight italic leading-none">
                                    Woaw<span className="text-emerald-600">.</span>
                                </span>
                                <span className="text-[9px] font-black tracking-[0.3em] text-stone-400 uppercase mt-1">Workspace</span>
                            </div>
                        </Link>
                    </div>

                    <nav className="flex-1 overflow-y-auto py-8 px-5 space-y-2 relative z-10">
                        <div className="text-[10px] font-black text-stone-300 uppercase tracking-widest px-3 mb-4">Menu Principal</div>
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`relative flex items-center justify-between px-4 py-3.5 rounded-[1.25rem] text-sm font-bold transition-all duration-500 group overflow-hidden ${isActive
                                            ? 'bg-stone-900 text-white shadow-xl shadow-stone-200/50 scale-[1.02]'
                                            : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'
                                        }`}
                                >
                                    {isActive && <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-stone-700 to-stone-600 opacity-50" />}
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className={`p-2 rounded-xl transition-colors duration-500 ${isActive ? 'bg-white/10' : 'bg-transparent group-hover:bg-white'}`}>
                                            <item.icon className={`w-5 h-5 transition-transform duration-500 group-hover:scale-110 ${isActive ? 'text-white' : 'text-stone-400 group-hover:text-stone-900'}`} />
                                        </div>
                                        <span className={`tracking-wide ${isActive ? 'font-black' : 'font-semibold'}`}>{item.name}</span>
                                    </div>
                                    {item.badge && (
                                        <span className={`relative z-10 flex items-center justify-center min-w-[24px] h-6 px-2 text-[10px] font-black rounded-xl shadow-sm transition-colors duration-500 ${isActive ? 'bg-white text-stone-900' : 'bg-stone-900 text-white group-hover:bg-primary'}`}>
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-6 border-t border-stone-100/50 bg-stone-50/50 relative z-10">
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-3 w-full px-4 py-3.5 rounded-[1.25rem] text-sm font-bold text-stone-500 hover:bg-white hover:text-red-500 hover:shadow-sm transition-all duration-300 border border-transparent hover:border-red-100 group"
                        >
                            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Session Active
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 print:block print:w-full bg-stone-50">
                <header className="h-24 bg-stone-50/80 backdrop-blur-xl border-b border-stone-200/50 flex items-center justify-between px-6 lg:px-10 print:hidden sticky top-0 z-40">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="w-12 h-12 flex items-center justify-center rounded-[1.25rem] bg-white border border-stone-200 text-stone-600 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all duration-300 shadow-sm lg:hidden focus:ring-4 focus:ring-stone-200"
                    >
                        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>

                    <div className="flex items-center gap-5 ml-auto">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-sm font-black text-stone-900 tracking-wide">Privilège Admin</span>
                            <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest italic mt-0.5">Accès Complet</span>
                        </div>
                        <div className="w-12 h-12 rounded-[1.25rem] bg-white shadow-sm flex items-center justify-center border border-stone-200 relative group cursor-pointer">
                            <div className="absolute inset-0 bg-stone-900 opacity-0 group-hover:opacity-5 rounded-[1.25rem] transition-opacity duration-300" />
                            <User className="w-5 h-5 text-stone-700" />
                            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 lg:p-10 pt-8 lg:pt-12 overflow-y-auto print:p-0 print:overflow-visible print:w-full relative">
                    {children}
                </main>
            </div>
        </div>
    );
}
