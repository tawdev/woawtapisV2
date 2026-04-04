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

    // Aggregate Legends (Top Products over 6 months)
    const legends = React.useMemo(() => {
        if (!stats?.monthly_sales) return [];
        const productMap = new Map();
        
        stats.monthly_sales.forEach((month: any) => {
            month.top_products?.forEach((p: any) => {
                const existing = productMap.get(p.product_id) || { ...p, sold: 0 };
                productMap.set(p.product_id, {
                    ...existing,
                    sold: existing.sold + p.sold
                });
            });
        });
        
        return Array.from(productMap.values())
            .sort((a: any, b: any) => b.sold - a.sold)
            .slice(0, 4);
    }, [stats]);

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
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
        <div className="space-y-12 pb-24 mx-auto">
            {/* Header with Glassmorphism Effect */}
            <div className="relative p-10 bg-white rounded-[3rem] border border-stone-100 shadow-xl overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-1000" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-3">
                        <Link href="/admin" className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-stone-50 rounded-full">
                            <ArrowLeft size={12} /> Dashboard
                        </Link>
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-stone-900 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl">
                                <History size={32} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-playfair font-bold text-stone-900 tracking-tight leading-tight">Odyssée Analytique</h1>
                                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-stone-400 mt-1 italic">Secrets de performance • Période de 6 mois</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex px-5 py-3 bg-white border border-stone-100 text-stone-900 rounded-2xl items-center gap-3 shadow-sm">
                            <div className="text-right">
                                <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest leading-none">Total Semestre</p>
                                <p className="text-lg font-bold">
                                    {stats?.monthly_sales?.reduce((acc: number, m: any) => acc + (m.total || 0), 0).toLocaleString()} MAD
                                </p>
                            </div>
                        </div>
                        <button className="p-4 bg-stone-900 text-white rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all">
                            <BarChart3 size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Legends Section - Aggregated Top products */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 px-4">
                    <TrendingUp className="text-primary" size={24} />
                    <h2 className="text-2xl font-playfair font-bold text-stone-900 italic">Légendes de la Période</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {legends.map((p: any, i: number) => (
                        <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group cursor-pointer relative overflow-hidden">
                            <div className="flex items-center gap-5 relative z-10">
                                <div className="w-20 h-28 rounded-2xl bg-stone-50 overflow-hidden shadow-inner border border-stone-100 flex-shrink-0">
                                    {p.image ? (
                                        <img src={getImageUrl(p.image)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-stone-50"><ShoppingBag size={24} className="text-stone-200" /></div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black text-primary uppercase tracking-widest leading-none italic">#0{i+1} Best-Seller</span>
                                    <h4 className="text-sm font-bold text-stone-900 line-clamp-2 leading-tight">{p.name}</h4>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <p className="text-[10px] font-black text-stone-900">{p.sold} <span className="text-stone-400 font-bold uppercase">Unités</span></p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                                <TrendingUp size={48} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Monthly Reports Detailed Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">
                {stats?.monthly_sales?.map((monthData: any, idx: number) => (
                    <div 
                        key={idx} 
                        className="bg-white rounded-[4rem] border border-stone-100 shadow-2xl overflow-hidden group hover:border-primary/20 transition-all duration-700 flex flex-col"
                    >
                        {/* Monthly Summary Header */}
                        <div className="p-12 space-y-10 flex-grow">
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-stone-50 pb-10 relative">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="px-4 py-1.5 bg-stone-900 rounded-full text-white text-[10px] font-black uppercase tracking-[0.2em] italic">
                                            Archive {new Date().getFullYear()}
                                        </div>
                                    </div>
                                    <h3 className="text-5xl font-playfair font-bold text-stone-900 capitalize italic tracking-tight">{monthData.name}</h3>
                                    <p className="text-[11px] font-black text-stone-400 uppercase tracking-[0.3em]">Performance du catalogue d'exception</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-black text-stone-300 uppercase tracking-widest mb-2">Chiffre d'Affaire</div>
                                    <div className="text-4xl font-bold text-stone-900 tracking-tighter">
                                        {monthData.total?.toLocaleString()}
                                        <span className="text-sm text-stone-400 ml-2 font-bold uppercase tracking-widest italic">MAD</span>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Product List */}
                            <div className="space-y-12">
                                {monthData.top_products && monthData.top_products.length > 0 ? (
                                    monthData.top_products.map((product: any, pIdx: number) => {
                                        const maxInMonth = Math.max(...monthData.top_products.map((p: any) => p.sold)) || 1;
                                        const width = (product.sold / maxInMonth) * 100;
                                        
                                        return (
                                            <div key={pIdx} className="group/item flex flex-col sm:flex-row items-center gap-8 p-6 rounded-[2.5rem] hover:bg-stone-50/80 transition-all border border-transparent hover:border-stone-100 relative">
                                                <div className="relative w-32 h-44 flex-shrink-0 group-hover/item:scale-105 transition-transform duration-500">
                                                    <div className="absolute inset-0 bg-stone-100 rounded-3xl shadow-inner group-hover/item:rotate-12 transition-transform duration-700" />
                                                    <div className="absolute inset-0 rounded-3xl overflow-hidden border-4 border-white shadow-2xl group-hover/item:-rotate-3 transition-transform duration-500">
                                                        {product.image ? (
                                                            <img src={getImageUrl(product.image)} className="w-full h-full object-cover" alt="" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-stone-50"><ShoppingBag size={28} className="text-stone-200" /></div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex-grow space-y-6 w-full">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="space-y-1">
                                                            <h4 className="text-xl font-bold text-stone-900 group-hover/item:text-primary transition-colors line-clamp-1">{product.name}</h4>
                                                            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest italic">Identifiant Produit #{product.product_id}</p>
                                                        </div>
                                                        <div className="w-12 h-12 rounded-2xl bg-white border border-stone-100 flex items-center justify-center text-stone-900 shadow-sm">
                                                            <ArrowUpRight size={20} />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                                <span className="text-xs font-black text-stone-900 uppercase tracking-tighter">{product.sold} Ventes Validées</span>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-stone-300 italic opacity-0 group-hover/item:opacity-100 transition-opacity">Progression {Math.round(width)}%</span>
                                                        </div>
                                                        <div className="h-2.5 w-full bg-white rounded-full overflow-hidden p-0.5 border border-stone-100">
                                                            <div 
                                                                className="h-full bg-stone-900 rounded-full transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/item:bg-primary shadow-[0_0_15px_rgba(0,0,0,0.1)]" 
                                                                style={{ width: `${Math.max(width, 4)}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="h-[400px] flex flex-col items-center justify-center bg-stone-50 rounded-[3.5rem] border-4 border-dashed border-stone-100/50">
                                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 border border-stone-100">
                                            <TrendingUp className="text-stone-200" size={32} />
                                        </div>
                                        <h5 className="text-xl font-playfair font-bold text-stone-900 mb-2 italic">Silence Radio</h5>
                                        <p className="text-xs font-bold text-stone-300 uppercase tracking-[0.3em] font-mono">Aucun mouvement transactionnel</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Premium Card Footer */}
                        <div className="px-12 py-8 bg-stone-900 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest italic underline decoration-stone-700 underline-offset-4">Rapport Mensuel</span>
                                <div className="w-1 h-1 bg-primary rounded-full" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">{monthData.name} {new Date().getFullYear()}</span>
                            </div>
                            <button className="text-[10px] font-black text-stone-400 hover:text-white transition-colors uppercase tracking-[0.2em] flex items-center gap-2 group/btn">
                                Exporter PDF <ArrowLeft size={10} className="rotate-180 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
