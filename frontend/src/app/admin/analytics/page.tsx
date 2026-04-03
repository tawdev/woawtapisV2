'use client';

import React, { useState, useEffect } from 'react';
import { adminService } from '@/services/admin';
import { getImageUrl } from '@/services/api';
import { 
    TrendingUp, 
    Calendar, 
    ArrowLeft, 
    ShoppingBag, 
    ArrowUpRight,
    BarChart3,
    History
} from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsPage() {
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
            <div className="p-10 space-y-8 animate-pulse">
                <div className="h-20 bg-white rounded-3xl border border-stone-100"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-96 bg-white rounded-[2.5rem] border border-stone-100"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-10 space-y-10 pb-20 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <Link href="/admin" className="flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors text-xs font-black uppercase tracking-widest mb-4">
                        <ArrowLeft size={14} /> Retour Dashboard
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-stone-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                            <History size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-playfair font-bold text-stone-900 tracking-tight">Analyse des Performances</h1>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 mt-1 italic">Historique détaillé des 6 derniers mois</p>
                        </div>
                    </div>
                </div>
                
                <div className="flex bg-white p-1 rounded-2xl border border-stone-200 shadow-sm">
                    <button className="px-6 py-2.5 bg-stone-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Vue Mensuelle</button>
                    <button className="px-6 py-2.5 text-stone-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-stone-900 transition-colors">Vue Annuelle</button>
                </div>
            </div>

            {/* Stats Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-stone-900 rounded-3xl p-8 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                        <BarChart3 size={60} />
                    </div>
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-2">Record Mensuel</p>
                    <h3 className="text-3xl font-bold italic mb-1">
                        {stats?.monthly_sales?.reduce((prev: any, curr: any) => (prev.total > curr.total) ? prev : curr).total?.toLocaleString()} MAD
                    </h3>
                    <p className="text-xs text-stone-400">Atteint en <span className="text-white capitalize">{stats?.monthly_sales?.reduce((prev: any, curr: any) => (prev.total > curr.total) ? prev : curr).name}</span></p>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm relative overflow-hidden group border-b-4 border-b-emerald-500">
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-2">Croissance Moyenne</p>
                    <h3 className="text-3xl font-bold text-stone-900 mb-1">+24.8%</h3>
                    <p className="text-xs text-emerald-500 font-bold uppercase tracking-widest">Progression constante</p>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm relative overflow-hidden group border-b-4 border-b-primary">
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-2">Top Catégorie</p>
                    <h3 className="text-3xl font-bold text-stone-900 mb-1">Vintage</h3>
                    <p className="text-xs text-stone-400 italic">Basé sur le volume de ventes</p>
                </div>
            </div>

            {/* Monthly Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {stats?.monthly_sales?.map((monthData: any, idx: number) => (
                    <div 
                        key={idx} 
                        className="bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-sm hover:shadow-2xl transition-all duration-700 group overflow-hidden relative flex flex-col h-full"
                    >
                        {/* Card Background Branding */}
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-stone-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-3xl pointer-events-none" />
                        
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold text-stone-900 capitalize italic">{monthData.name}</h3>
                                <div className="h-1 w-12 bg-primary rounded-full group-hover:w-full transition-all duration-700" />
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Volume Ventes</p>
                                <p className="text-base font-bold text-stone-900">{monthData.total?.toLocaleString()} MAD</p>
                            </div>
                        </div>

                        {/* Monthly Product Distribution Graph */}
                        <div className="space-y-6 flex-grow relative z-10">
                            {monthData.top_products && monthData.top_products.length > 0 ? (
                                monthData.top_products.map((product: any, pIdx: number) => {
                                    const maxInMonth = Math.max(...monthData.top_products.map((p: any) => p.sold)) || 1;
                                    const width = (product.sold / maxInMonth) * 100;
                                    
                                    return (
                                        <div key={pIdx} className="space-y-2 group/item">
                                            <div className="flex items-center justify-between px-1">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-stone-50 border border-stone-100">
                                                        {product.image ? (
                                                            <img src={getImageUrl(product.image)} className="w-full h-full object-cover" alt="" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center"><ShoppingBag size={12} className="text-stone-300" /></div>
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] font-bold text-stone-700 truncate max-w-[120px]">{product.name}</p>
                                                </div>
                                                <span className="text-[10px] font-black text-stone-900 bg-stone-50 px-2 py-0.5 rounded-full ring-1 ring-stone-100">{product.sold}</span>
                                            </div>
                                            <div className="h-2 w-full bg-stone-50 rounded-full overflow-hidden border border-stone-50 p-0.5">
                                                <div 
                                                    className="h-full bg-stone-900 rounded-full transition-all duration-1000 group-hover:bg-primary" 
                                                    style={{ width: `${Math.max(width, 2)}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="h-64 flex flex-col items-center justify-center opacity-30">
                                    <div className="w-16 h-16 rounded-full border border-dashed border-stone-200 flex items-center justify-center mb-4">
                                        <TrendingUp className="text-stone-300" size={24} />
                                    </div>
                                    <p className="text-xs font-bold text-stone-300 uppercase tracking-widest italic">Aucune donnée</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
