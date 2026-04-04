'use client';

import React, { useState, useEffect } from 'react';
import { adminService } from '@/services/admin';
import { getImageUrl } from '@/services/api';
import { orderStatusMap } from '@/utils/status';
import {
    TrendingUp,
    ShoppingBag,
    Package as PackageIcon,
    MessageSquare,
    Clock,
    ChevronRight,
    AlertTriangle,
    ArrowUpRight,
    ArrowDownRight,
    ExternalLink,
    Search,
    Filter,
    Zap,
    CheckCircle,
    Users,
    Bell,
    Layers
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await adminService.getStats();
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="space-y-10 animate-pulse">
                <div className="flex justify-between items-end">
                    <div className="space-y-2">
                        <div className="h-8 w-48 bg-stone-200 rounded-lg"></div>
                        <div className="h-4 w-64 bg-stone-100 rounded-lg"></div>
                    </div>
                    <div className="h-10 w-32 bg-stone-200 rounded-lg"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 bg-white rounded-[2rem] border border-stone-200 shadow-sm"></div>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 h-[450px] bg-white rounded-[2rem] border border-stone-200 shadow-sm"></div>
                    <div className="h-[450px] bg-white rounded-[2rem] border border-stone-200 shadow-sm"></div>
                </div>
            </div>
        );
    }

    const cards = [
        {
            label: 'Chiffre Affaires',
            value: `${stats?.total_sales?.toLocaleString()} MAD`,
            sub: '+12.5% vs mois dernier',
            icon: TrendingUp,
            trend: 'up',
            gradient: 'from-emerald-50 to-emerald-100/30',
            iconBg: 'bg-emerald-500 text-white shadow-emerald-200'
        },
        {
            label: 'Commandes Total',
            value: stats?.orders_count,
            sub: `${stats?.pending_orders} en attente`,
            icon: ShoppingBag,
            trend: 'up',
            gradient: 'from-blue-50 to-blue-100/30',
            iconBg: 'bg-blue-500 text-white shadow-blue-200'
        },
        {
            label: 'Produits Actifs',
            value: stats?.products_count,
            sub: 'Dans 8 catégories',
            icon: PackageIcon,
            trend: 'neutral',
            gradient: 'from-purple-50 to-purple-100/30',
            iconBg: 'bg-purple-500 text-white shadow-purple-200'
        },
        {
            label: 'Projets Sur-Mesure',
            value: stats?.sur_mesure_count || 0,
            sub: 'Demandes artisanales',
            icon: Layers,
            trend: 'up',
            gradient: 'from-amber-50 to-amber-100/30',
            iconBg: 'bg-amber-500 text-white shadow-amber-200',
            href: '/admin/sur-mesure'
        },
    ];

    return (
        <div className="space-y-10 pb-12">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-playfair font-bold text-stone-900 tracking-tight mb-2">Tableau de Bord</h1>
                    <div className="flex items-center gap-3">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <p className="text-stone-500 text-sm font-medium italic">Système opérationnel • Mise à jour en temps réel</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-600 rounded-xl font-bold text-sm hover:bg-stone-200 transition-all">
                        <Filter className="w-4 h-4" /> Filtres
                    </button>
                    <Link href="/admin/products/create" className="flex items-center gap-2 px-6 py-2.5 bg-stone-900 text-white rounded-xl font-bold text-sm shadow-xl shadow-stone-200 hover:scale-[1.03] active:scale-95 transition-all">
                        <PackageIcon className="w-4 h-4" /> Nouveau Produit
                    </Link>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => {
                    const CardContent = (
                        <div className={`relative h-full overflow-hidden bg-white p-7 rounded-[2rem] border border-stone-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}>
                            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                            
                            <div className="relative z-10">
                                <div className={`w-11 h-11 rounded-2xl ${card.iconBg} flex items-center justify-center mb-5 shadow-lg`}>
                                    <card.icon className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-black text-stone-400 uppercase tracking-widest">{card.label}</p>
                                        {card.trend === 'up' && <ArrowUpRight className="w-4 h-4 text-emerald-500" />}
                                        {card.trend === 'down' && <ArrowDownRight className="w-4 h-4 text-red-500" />}
                                    </div>
                                    <h3 className="text-3xl font-bold text-stone-900 tracking-tight">{card.value}</h3>
                                    <p className="text-[11px] font-bold text-stone-400 flex items-center gap-1">
                                        {card.sub}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );

                    if (card.href) {
                        return (
                            <Link key={i} href={card.href} className="block group transition-all duration-500 h-full">
                                {CardContent}
                            </Link>
                        );
                    }

                    return (
                        <div key={i} className="block h-full">
                            {CardContent}
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions Section */}
            <div className="bg-white rounded-[2.5rem] border border-stone-200 shadow-sm p-8">
                <div className="flex items-center gap-3 mb-6">
                    <Zap className="w-5 h-5 text-amber-500" />
                    <h2 className="text-xl font-bold text-stone-900">Actions Rapides</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link href="/admin/products/create" className="flex flex-col items-center justify-center p-6 bg-stone-50 border border-transparent rounded-[2rem] hover:bg-white hover:border-stone-200 hover:shadow-xl transition-all duration-300 group">
                        <span className="w-14 h-14 bg-white shadow-sm border border-stone-100 rounded-full flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white transition-colors mb-4">
                            <PackageIcon size={22} className="text-stone-600 group-hover:text-white transition-colors" />
                        </span>
                        <span className="text-xs font-bold text-stone-900">Nouveau Produit</span>
                    </Link>
                    
                    <Link href="/admin/categories" className="flex flex-col items-center justify-center p-6 bg-stone-50 border border-transparent rounded-[2rem] hover:bg-white hover:border-stone-200 hover:shadow-xl transition-all duration-300 group">
                        <span className="w-14 h-14 bg-white shadow-sm border border-stone-100 rounded-full flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white transition-colors mb-4">
                            <Filter size={22} className="text-stone-600 group-hover:text-white transition-colors" />
                        </span>
                        <span className="text-xs font-bold text-stone-900">Catégories</span>
                    </Link>

                    <Link href="/admin/orders" className="flex flex-col items-center justify-center p-6 bg-stone-50 border border-transparent rounded-[2rem] hover:bg-white hover:border-stone-200 hover:shadow-xl transition-all duration-300 group relative">
                        {stats?.pending_orders > 0 && (
                            <>
                                <span className="absolute top-4 right-4 w-3.5 h-3.5 bg-red-500 rounded-full animate-ping opacity-75" />
                                <span className="absolute top-4 right-4 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white" />
                            </>
                        )}
                        <span className="w-14 h-14 bg-white shadow-sm border border-stone-100 rounded-full flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white transition-colors mb-4">
                            <ShoppingBag size={22} className="text-stone-600 group-hover:text-white transition-colors" />
                        </span>
                        <span className="text-xs font-bold text-stone-900">Gérer Commandes</span>
                    </Link>

                    <Link href="/admin/messages" className="flex flex-col items-center justify-center p-6 bg-stone-50 border border-transparent rounded-[2rem] hover:bg-white hover:border-stone-200 hover:shadow-xl transition-all duration-300 group relative">
                        {stats?.messages_count > 0 && (
                            <span className="absolute top-4 right-4 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-sm z-10">
                                {stats.messages_count}
                            </span>
                        )}
                        <span className="w-14 h-14 bg-white shadow-sm border border-stone-100 rounded-full flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white transition-colors mb-4">
                            <MessageSquare size={22} className="text-stone-600 group-hover:text-white transition-colors" />
                        </span>
                        <span className="text-xs font-bold text-stone-900">Messagerie</span>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Chart Section */}
                <div className="lg:col-span-2 flex flex-col h-full">
                    <div className="bg-white rounded-[2.5rem] border border-stone-200 shadow-sm p-8 flex flex-col flex-1 min-h-[450px]">
                        <div className="flex items-center justify-between mb-10">
                            <div className="space-y-1">
                                <h2 className="text-xl font-bold text-stone-900">Performance des Ventes</h2>
                                <p className="text-xs text-stone-400 font-medium tracking-wide">Evolution mensuelle du chiffre d'affaires</p>
                            </div>
                            <div className="flex gap-2">
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase">Plus haut</span>
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-stone-50 text-stone-400 rounded-lg text-[10px] font-black uppercase tracking-widest">6 Mois</span>
                            </div>
                        </div>

                        {/* Visual Trend Chart (Simple CSS implementation) */}
                        <div className="flex-grow flex items-end justify-between gap-4 h-60 mt-4 px-2">
                            {stats?.monthly_sales?.map((data: any, idx: number) => {
                                const max = Math.max(...stats.monthly_sales.map((m: any) => m.total)) || 1;
                                const height = (data.total / max) * 100;
                                return (
                                    <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                                        <div className="absolute -top-8 bg-stone-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-bold">
                                            {data.total} MAD
                                        </div>
                                        <div 
                                            className="w-full max-w-[40px] bg-stone-100 rounded-t-xl group-hover:bg-stone-900 transition-all duration-500 relative overflow-hidden" 
                                            style={{ height: `${Math.max(height, 5)}%` }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
                                        </div>
                                        <span className="mt-4 text-[10px] font-black uppercase tracking-tighter text-stone-400 group-hover:text-stone-900 transition-colors">
                                            {data.name}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Stock Warning Sidebar */}
                <div className="flex flex-col gap-6 h-full">
                    <div className="bg-white rounded-[2.5rem] border border-stone-200 shadow-sm p-8 flex flex-col flex-1 min-h-[250px]">
                        <div className="flex items-center justify-between mb-8">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                                    <h2 className="text-xl font-bold text-stone-900">Stock Critique</h2>
                                </div>
                                <p className="text-xs text-stone-400 font-medium tracking-wide">{stats?.low_stock_count} produits en alerte</p>
                            </div>
                        </div>

                        <div className="space-y-6 flex-grow overflow-y-auto pr-2">
                            {stats?.low_stock_products?.map((product: any) => (
                                <div key={product.id} className="group flex items-center justify-between p-4 rounded-2xl hover:bg-stone-50 border border-transparent hover:border-stone-100 transition-all cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-stone-100 rounded-xl overflow-hidden shadow-inner border border-stone-100 p-1">
                                            <div className="w-full h-full bg-stone-200 rounded-lg"></div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-stone-900 group-hover:text-amber-600 transition-colors">{product.name}</p>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Restant: <span className="text-red-500">{product.stock}</span></p>
                                        </div>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-stone-200 group-hover:text-stone-400 transition-colors" />
                                </div>
                            ))}
                            {stats?.low_stock_count === 0 && (
                                <div className="flex flex-col items-center justify-center p-8 text-center h-full">
                                    <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                                        <TrendingUp className="w-8 h-8" />
                                    </div>
                                    <p className="text-sm font-bold text-stone-900">Stock Optimal</p>
                                    <p className="text-xs text-stone-400 mt-2">Tous vos tapis sont bien approvisionnés.</p>
                                </div>
                            )}
                        </div>

                        <Link href="/admin/inventory" className="mt-8 flex items-center justify-center py-4 bg-stone-50 hover:bg-stone-100 rounded-2xl text-xs font-black uppercase tracking-widest text-stone-600 transition-all">
                            Gérer l'inventaire
                        </Link>
                    </div>

                    {/* Todo/Alerts Mini-widget */}
                    <div className="bg-stone-900 rounded-[2.5rem] shadow-xl p-8 flex flex-col relative overflow-hidden shrink-0">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <Bell className="w-5 h-5 text-emerald-400" />
                            <h2 className="text-xl font-bold text-white">À Traiter</h2>
                        </div>
                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${stats?.pending_orders > 0 ? 'bg-red-500' : 'bg-stone-500'}`} />
                                    <span className="text-sm font-medium text-stone-200">Commandes en attente</span>
                                </div>
                                <span className="text-lg font-bold text-white">{stats?.pending_orders || 0}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${stats?.messages_count > 0 ? 'bg-stone-300' : 'bg-stone-500'}`} />
                                    <span className="text-sm font-medium text-stone-200">Messages contact</span>
                                </div>
                                <span className="text-lg font-bold text-white">{stats?.messages_count || 0}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white/8 rounded-2xl hover:bg-white/15 transition-colors cursor-pointer border border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${stats?.sur_mesure_count > 0 ? 'bg-amber-400 animate-pulse' : 'bg-stone-500'}`} />
                                    <span className="text-sm font-bold text-amber-200">Inspirations Sur-Mesure</span>
                                </div>
                                <span className="text-xl font-black text-amber-400">{stats?.sur_mesure_count || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Separated Monthly Performance - CURRENT MONTH ONLY */}
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-2">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-stone-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-stone-200">
                            <TrendingUp size={28} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-playfair font-bold text-stone-900 tracking-tight">Performance du Mois Actuel</h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 mt-1 italic">Produits stars de cette période</p>
                        </div>
                    </div>
                    <Link href="/admin/analytics" className="px-6 py-3 bg-white border border-stone-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-stone-600 hover:bg-stone-900 hover:text-white hover:border-stone-900 shadow-sm transition-all flex items-center gap-2 group">
                        Voir Historique Complet <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 gap-8">
                    {stats?.monthly_sales?.slice(-1).map((monthData: any, idx: number) => (
                        <div 
                            key={idx} 
                            className="bg-white rounded-[3rem] p-10 border border-stone-100 shadow-sm hover:shadow-2xl transition-all duration-700 group overflow-hidden relative flex flex-col md:flex-row gap-12"
                        >
                            {/* Card Background Branding */}
                            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-stone-50 rounded-full opacity-50 group-hover:opacity-100 transition-opacity blur-3xl pointer-events-none" />
                            
                            {/* Left Side: Header & Total */}
                            <div className="md:w-1/3 space-y-8 relative z-10">
                                <div className="space-y-2">
                                    <h3 className="text-4xl font-playfair font-bold text-stone-900 capitalize italic">{monthData.name}</h3>
                                    <div className="h-1.5 w-24 bg-primary rounded-full" />
                                </div>
                                <div className="p-8 bg-stone-50 rounded-[2rem] border border-stone-100">
                                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Chiffre d'Affaires</p>
                                    <p className="text-3xl font-bold text-stone-900">{monthData.total?.toLocaleString()} MAD</p>
                                    <div className="mt-4 flex items-center gap-2 text-emerald-500 font-bold text-xs">
                                        <TrendingUp size={14} /> +12.4% vs mois dernier
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Graph */}
                            <div className="md:w-2/3 space-y-6 relative z-10">
                                {monthData.top_products && monthData.top_products.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-4">
                                        {monthData.top_products.map((product: any, pIdx: number) => {
                                            const maxInMonth = Math.max(...monthData.top_products.map((p: any) => p.sold)) || 1;
                                            const width = (product.sold / maxInMonth) * 100;
                                            
                                            return (
                                                <div key={pIdx} className="space-y-3 group/item">
                                                    <div className="flex items-center justify-between px-1">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-50 border border-stone-100 shadow-sm group-hover/item:scale-110 transition-transform">
                                                                {product.image ? (
                                                                    <img src={getImageUrl(product.image)} className="w-full h-full object-cover" alt="" />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center"><ShoppingBag size={14} className="text-stone-300" /></div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-stone-900">{product.name}</p>
                                                                <p className="text-[10px] font-medium text-stone-400 italic">Produit Performance</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-xs font-black text-stone-900">{product.sold} <span className="text-stone-400 font-bold uppercase text-[9px] tracking-widest">Ventes</span></span>
                                                        </div>
                                                    </div>
                                                    <div className="h-3 w-full bg-stone-50 rounded-full overflow-hidden border border-stone-100 p-0.5">
                                                        <div 
                                                            className="h-full bg-stone-900 rounded-full transition-all duration-1000 group-hover:bg-primary shadow-lg shadow-primary/5" 
                                                            style={{ width: `${Math.max(width, 2)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center opacity-30 min-h-[300px]">
                                        <div className="w-20 h-20 rounded-full border-2 border-dashed border-stone-200 flex items-center justify-center mb-4">
                                            <TrendingUp className="text-stone-400" size={32} />
                                        </div>
                                        <p className="text-sm font-bold text-stone-400 uppercase tracking-widest italic">Analyse en cours...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sub-Header for Orders */}
            <div className="pt-12 flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                    <Clock className="w-6 h-6 text-stone-900" />
                    <h2 className="text-2xl font-playfair font-bold text-stone-900">Commandes Récentes</h2>
                </div>
                <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input 
                        type="text" 
                        placeholder="Rechercher une commande..." 
                        className="w-full pl-10 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-black/5"
                    />
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-[2.5rem] border border-stone-200 shadow-xl overflow-hidden ring-1 ring-black/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-stone-900 text-stone-400 text-xs font-black uppercase tracking-[0.2em]">
                                <th className="px-10 py-6">ID Commande</th>
                                <th className="px-10 py-6">Client & Destination</th>
                                <th className="px-10 py-6">Date</th>
                                <th className="px-10 py-6">Montant</th>
                                <th className="px-10 py-6">Statut de Livraison</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {stats?.recent_orders?.map((order: any) => {
                                const status = orderStatusMap[order.status as keyof typeof orderStatusMap] || { label: order.status, color: 'text-stone-500 bg-stone-50 border-stone-200' };
                                return (
                                    <tr key={order.id} className="hover:bg-stone-50/80 transition-colors group cursor-pointer">
                                        <td className="px-10 py-8">
                                            <div className="font-playfair font-bold text-stone-900 text-lg">#{order.order_number}</div>
                                            <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest mt-1 group-hover:text-stone-900 transition-colors underline decoration-dotted">Détails de transaction</div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="text-base font-bold text-stone-900">{order.customer_name}</div>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-stone-300"></div>
                                                <div className="text-xs font-bold text-stone-400 italic">{order.customer_city}, Maroc</div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="text-sm font-bold text-stone-600 bg-stone-100 px-3 py-1.5 rounded-lg inline-block">
                                                {new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="font-black text-stone-900 text-lg flex items-baseline gap-1">
                                                {order.total_amount?.toLocaleString()} 
                                                <span className="text-[10px] text-stone-400">MAD</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 flex items-center justify-center gap-2 w-fit ${status.color}`}>
                                                <span className="flex h-1.5 w-1.5 rounded-full bg-current"></span>
                                                {status.label}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {stats?.recent_orders?.length === 0 && (
                    <div className="p-20 text-center space-y-4">
                        <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto text-stone-300">
                            <ShoppingBag className="w-10 h-10" />
                        </div>
                        <p className="text-stone-400 font-bold italic">Aucune commande enregistrée pour le moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
