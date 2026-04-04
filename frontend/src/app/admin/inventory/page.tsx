'use client';

import React, { useState, useEffect } from 'react';
import { adminService } from '@/services/admin';
import { getImageUrl } from '@/services/api';
import { 
    AlertTriangle, 
    TrendingUp, 
    Package, 
    ArrowLeft, 
    Clock, 
    Info,
    ChevronRight,
    ArrowUpRight,
    Search,
    Filter,
    BarChart3,
    ArrowDown
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
    id: number;
    name: string;
    stock: number;
    price: number;
    primary_image?: {
        image_path: string;
    };
    category?: {
        name: string;
    };
    sales_velocity?: number; // Mocked for prediction
}

export default function InventoryPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [addAmounts, setAddAmounts] = useState<{[key: number]: string}>({});

    const handleUpdateStock = async (id: number) => {
        const amountStr = addAmounts[id] || '';
        const amount = parseInt(amountStr);
        if (isNaN(amount) || amount === 0) return;

        setUpdatingId(id);
        try {
            const product = products.find(p => p.id === id);
            if (!product) return;

            const newStock = (product.stock || 0) + amount;
            // Assuming adminService has an updateProduct method
            await adminService.updateProduct(id, { stock: newStock });
            
            // Update local state
            setProducts(current => current.map(p => 
                p.id === id ? { ...p, stock: newStock } : p
            ));
            
            // Clear input after success
            setAddAmounts(prev => {
                const next = { ...prev };
                delete next[id];
                return next;
            });
        } catch (error) {
            console.error('Failed to update stock:', error);
            alert('Erreur lors de la mise à jour du stock. Vérifiez votre connexion.');
        } finally {
            setUpdatingId(null);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await adminService.getProducts(1, '', '');
                // For demo/prediction purposes, let's add some mock sales velocity
                const productsWithVelocity = response.data.data.map((p: any) => ({
                    ...p,
                    sales_velocity: Math.floor(Math.random() * 5) + 1, // units per day
                    stock: p.stock ?? 5 // handle null stock
                }));
                setProducts(productsWithVelocity);
            } catch (error) {
                console.error('Failed to fetch inventory:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const lowStockThreshold = 10;
    const lowStockProducts = products.filter(p => (p.stock || 0) < lowStockThreshold);
    
    // Prediction logic: Stock / Velocity = Days left
    const predictions = products
        .filter(p => p.sales_velocity && p.sales_velocity > 2 && (p.stock || 0) > 0)
        .map(p => {
            const daysLeft = Math.ceil((p.stock || 0) / (p.sales_velocity || 1));
            return { ...p, daysLeft };
        })
        .filter(p => p.daysLeft <= 15)
        .sort((a, b) => a.daysLeft - b.daysLeft);

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse p-8">
                <div className="h-20 bg-white rounded-3xl border border-stone-100"></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 h-[600px] bg-white rounded-[2.5rem] border border-stone-100"></div>
                    <div className="h-[600px] bg-white rounded-[2.5rem] border border-stone-100"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-24 mx-auto max-w-7xl relative">
            {/* Background Decorative Element */}
            <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-amber-100/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-stone-200/30 rounded-full blur-[100px] pointer-events-none" />

            {/* Header section with Glassmorphism */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative p-12 bg-white/70 backdrop-blur-xl rounded-[3.5rem] border border-stone-200/50 shadow-2xl overflow-hidden group"
            >
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-1000" />
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                    <div className="space-y-4">
                        <Link href="/admin" className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-all text-[10px] font-black uppercase tracking-widest px-5 py-2.5 bg-stone-100/50 hover:bg-stone-200/50 rounded-full">
                            <ArrowLeft size={12} /> Dashboard
                        </Link>
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-stone-900 rounded-[2rem] flex items-center justify-center text-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] group-hover:rotate-6 transition-transform duration-500">
                                <Package size={36} />
                            </div>
                            <div className="text-right sm:text-left">
                                <h1 className="text-5xl font-playfair font-bold text-stone-900 tracking-tight leading-tight">2. 📦 Gestion du Stock</h1>
                                <p className="text-[11px] font-black uppercase tracking-[0.5em] text-stone-400 mt-2 italic drop-shadow-sm">Intelligence Logistique • Temps Réel</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="px-8 py-5 bg-white/50 backdrop-blur-sm border border-stone-200/60 text-stone-900 rounded-[2rem] flex items-center gap-8 shadow-sm">
                            <div className="text-right">
                                <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest leading-none mb-2">Unités Totales</p>
                                <p className="text-2xl font-bold tracking-tighter">{products.reduce((acc, p) => acc + (p.stock || 0), 0)}</p>
                            </div>
                            <div className="w-px h-10 bg-stone-200" />
                            <div className="text-right">
                                <p className="text-[9px] font-black text-red-400 uppercase tracking-widest leading-none mb-2">Alertes Critiques</p>
                                <p className="text-2xl font-bold text-red-500 tracking-tighter">{lowStockProducts.length}</p>
                            </div>
                        </div>
                        <button className="p-5 bg-stone-900 text-white rounded-[1.5rem] shadow-xl hover:scale-105 active:scale-95 transition-all">
                            <BarChart3 size={24} />
                        </button>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Inventory List */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-6">
                        <div className="flex items-center gap-5">
                            <div className="w-2.5 h-10 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                            <h2 className="text-3xl font-playfair font-bold text-stone-900 italic tracking-tight">Alertes de Stock Bas</h2>
                        </div>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-amber-500 transition-colors" size={18} />
                            <input 
                                type="text" 
                                placeholder="Rechercher un modèle..." 
                                className="pl-12 pr-6 py-3.5 bg-white border border-stone-200 rounded-[1.5rem] text-sm font-medium focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none md:w-80 shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-[3.5rem] border border-stone-200/60 shadow-[0_30px_100px_rgba(0,0,0,0.04)] overflow-hidden ring-1 ring-black/[0.02]">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-stone-50/80 border-b border-stone-100">
                                        <th className="px-10 py-7 text-[10px] font-black text-stone-400 uppercase tracking-[0.25em]">Produit</th>
                                        <th className="px-8 py-7 text-[10px] font-black text-stone-400 uppercase tracking-[0.25em]">Catégorie</th>
                                        <th className="px-8 py-7 text-[10px] font-black text-stone-400 uppercase tracking-[0.25em]">Inventaire</th>
                                        <th className="px-8 py-7 text-[10px] font-black text-stone-400 uppercase tracking-[0.25em]">Statut</th>
                                        <th className="px-10 py-7 text-[10px] font-black text-stone-400 uppercase tracking-[0.25em]">Action Rapide</th>
                                        <th className="px-10 py-7"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-50">
                                    {lowStockProducts.length > 0 ? (
                                        lowStockProducts.map((p) => (
                                            <motion.tr 
                                                key={p.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                whileHover={{ backgroundColor: "rgba(250, 250, 249, 1)" }}
                                                className="group transition-colors cursor-pointer"
                                            >
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-16 h-20 rounded-[1.25rem] bg-stone-100 overflow-hidden border border-stone-200/50 shadow-inner flex-shrink-0 relative">
                                                            {p.primary_image?.image_path ? (
                                                                <img src={getImageUrl(p.primary_image.image_path)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-stone-300"><Package size={24} /></div>
                                                            )}
                                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="text-base font-bold text-stone-900 line-clamp-1 decoration-amber-500/0 group-hover:decoration-amber-500/100 underline underline-offset-4 transition-all duration-500">{p.name}</div>
                                                            <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                                                                <span className="w-1 h-1 bg-stone-300 rounded-full" /> REF #{p.id}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-8">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-500 px-4 py-2 bg-stone-100 rounded-full group-hover:bg-white transition-colors">{p.category?.name || 'Tapis'}</span>
                                                </td>
                                                <td className="px-8 py-8">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`text-lg font-bold tracking-tighter ${p.stock <= 5 ? 'text-red-500' : 'text-amber-500'}`}>
                                                            {p.stock} <span className="text-[10px] uppercase font-black tracking-widest ml-1">Unités</span>
                                                        </div>
                                                        <div className={`p-1.5 rounded-full ${p.stock <= 5 ? 'bg-red-50 text-red-400' : 'bg-amber-50 text-amber-400'}`}>
                                                            <ArrowDown size={14} />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-8">
                                                    {p.stock <= 0 ? (
                                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-stone-200">
                                                            Rupture
                                                        </div>
                                                    ) : p.stock <= 5 ? (
                                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-xl text-[9px] font-black uppercase tracking-[0.2em]">
                                                            Critique
                                                        </div>
                                                    ) : (
                                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-xl text-[9px] font-black uppercase tracking-[0.2em]">
                                                            Stock Bas
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-3 min-w-[200px]">
                                                        <div className="relative group/input flex-1">
                                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 font-bold text-lg select-none">+</div>
                                                            <input 
                                                                type="number" 
                                                                placeholder="Qté"
                                                                className="w-full pl-10 pr-3 py-3 bg-white border-2 border-stone-100 rounded-2xl text-base font-bold text-stone-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                                value={addAmounts[p.id] || ''}
                                                                onChange={(e) => setAddAmounts(prev => ({ ...prev, [p.id]: e.target.value }))}
                                                                onKeyDown={(e) => e.key === 'Enter' && handleUpdateStock(p.id)}
                                                            />
                                                        </div>
                                                        <button 
                                                            disabled={updatingId === p.id || !addAmounts[p.id]}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleUpdateStock(p.id);
                                                            }}
                                                            className={`p-2 rounded-xl transition-all flex-shrink-0 ${
                                                                updatingId === p.id 
                                                                ? 'bg-stone-100 text-stone-400' 
                                                                : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white shadow-sm hover:shadow-emerald-200 active:scale-95 disabled:opacity-30 disabled:hover:bg-emerald-50 disabled:hover:text-emerald-600 disabled:shadow-none'
                                                            }`}
                                                        >
                                                            {updatingId === p.id ? (
                                                                <div className="w-4 h-4 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
                                                            ) : (
                                                                <ArrowUpRight size={18} />
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8 text-right">
                                                    <Link href={`/admin/products?id=${p.id}`} className="w-10 h-10 flex items-center justify-center bg-stone-50 group-hover:bg-stone-900 group-hover:text-white rounded-xl transition-all duration-300">
                                                        <ChevronRight size={20} />
                                                    </Link>
                                                </td>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-10 py-32 text-center">
                                                <motion.div 
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="flex flex-col items-center"
                                                >
                                                    <div className="w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-500 mb-8 shadow-inner">
                                                        <Package size={40} />
                                                    </div>
                                                    <h3 className="text-2xl font-playfair font-bold text-stone-900 mb-2 italic">Inventaire Optimal</h3>
                                                    <p className="text-[10px] text-stone-400 uppercase tracking-[0.4em] font-black">Tous les modèles sont disponibles</p>
                                                </motion.div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* AI Prediction Sidebar */}
                <div className="space-y-10">
                    <div className="px-6">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                                <TrendingUp size={24} />
                            </div>
                            <h2 className="text-3xl font-playfair font-bold text-stone-900 italic tracking-tight">IA Prévisions</h2>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {predictions.length > 0 ? (
                            predictions.slice(0, 4).map((p, idx) => (
                                <motion.div 
                                    key={p.id}
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.15 }}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    className="bg-white p-8 rounded-[3rem] border border-stone-200/60 shadow-xl relative overflow-hidden group hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all cursor-pointer"
                                >
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.1] group-hover:scale-125 transition-all duration-700 text-stone-900">
                                        <Clock size={80} />
                                    </div>
                                    
                                    <div className="relative z-10 space-y-6">
                                        <div className="flex items-center gap-3">
                                            <div className="px-4 py-1.5 bg-emerald-500 text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-100">
                                                Ventes Éclairs
                                            </div>
                                        </div>

                                        <div className="flex gap-6">
                                            <div className="w-20 h-24 rounded-2xl bg-stone-50 overflow-hidden border border-stone-200 shadow-sm flex-shrink-0 group-hover:rotate-3 transition-transform duration-500">
                                                {p.primary_image?.image_path ? (
                                                    <img src={getImageUrl(p.primary_image.image_path)} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-stone-200"><Package size={28} /></div>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="text-lg font-bold text-stone-900 line-clamp-2 leading-tight">{p.name}</h4>
                                                <div className="flex items-center gap-2 text-emerald-600">
                                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                                    <p className="text-[10px] font-black uppercase tracking-widest italic">Très forte demande</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-stone-50/80 backdrop-blur-sm rounded-[1.75rem] p-6 border border-stone-100">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Flux de Stock</span>
                                                <span className="text-sm font-bold text-stone-900">~{p.daysLeft} Jours Restants</span>
                                            </div>
                                            <div className="h-2 w-full bg-stone-200/50 rounded-full overflow-hidden p-0.5 border border-stone-100">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(p.daysLeft / 15) * 100}%` }}
                                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                                    className={`h-full rounded-full ${p.daysLeft < 5 ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'} shadow-[0_0_10px_rgba(16,185,129,0.3)]`}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 pt-2">
                                            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 flex-shrink-0">
                                                <Info size={16} />
                                            </div>
                                            <p className="text-[11px] text-stone-600 leading-relaxed italic pr-4">
                                                Attention, ce tapis se vend très bien en ce moment ; votre stock pourrait être épuisé dans <span className="font-bold text-stone-900 decoration-amber-500 underline decoration-2 underline-offset-4">{p.daysLeft} jours</span>.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="bg-white p-12 rounded-[3.5rem] border border-stone-200 shadow-sm text-center">
                                <BarChart3 size={40} className="mx-auto text-stone-100 mb-6" />
                                <p className="text-[10px] text-stone-400 uppercase tracking-[0.3em] font-black italic">Analyse Prédictive Stable</p>
                            </div>
                        )}

                        <motion.div 
                            whileHover={{ scale: 1.02 }}
                            className="bg-stone-900 p-10 rounded-[3.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.3)] text-white relative overflow-hidden group"
                        >
                             <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 group-hover:scale-110 transition-all duration-700">
                                <TrendingUp size={120} />
                            </div>
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-6 bg-amber-500 rounded-full" />
                                    <h4 className="text-2xl font-playfair font-bold italic tracking-tight">Conseil Pro</h4>
                                </div>
                                <p className="text-xs text-stone-400 leading-relaxed font-medium">
                                    Les modèles <span className="text-white font-bold italic">"Modern Tapis"</span> connaissent une accélération de demande massive (+24%). Envisagez de réapprovisionner avant la fin du weekend.
                                </p>
                                <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white bg-white/10 hover:bg-white/20 px-8 py-4 rounded-2xl transition-all group/btn">
                                    Détails du Marché <ArrowUpRight size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
