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
    User
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

    useEffect(() => {
        // Basic check for token
        const token = localStorage.getItem('admin_token');
        if (!token && pathname !== '/admin/login') {
            router.push('/admin/login');
        } else {
            setIsAuthenticated(true);
        }
    }, [pathname, router]);

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
        { name: 'Produits', href: '/admin/products', icon: Package },
        { name: 'Catégories', href: '/admin/categories', icon: Layers },
        { name: 'Commandes', href: '/admin/orders', icon: ShoppingCart },
        { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
    ];

    return (
        <div className="min-h-screen bg-stone-50 flex">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-stone-200 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 lg:static lg:inset-0`}
            >
                <div className="h-full flex flex-col">
                    <div className="h-16 flex items-center px-6 border-b border-stone-100">
                        <Link href="/" className="text-xl font-bold text-stone-900 tracking-tight">
                            TAPIS<span className="text-stone-400">ADMIN</span>
                        </Link>
                    </div>

                    <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                            ? 'bg-stone-900 text-white'
                                            : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-stone-100">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Déconnexion
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-4 lg:px-8">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg hover:bg-stone-100 lg:hidden"
                    >
                        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                    <div className="flex items-center gap-4 ml-auto">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-sm font-semibold text-stone-900">Admin</span>
                            <span className="text-xs text-stone-500">Administrateur</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center border border-stone-200">
                            <User className="w-5 h-5 text-stone-600" />
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
