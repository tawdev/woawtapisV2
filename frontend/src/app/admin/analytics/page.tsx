'use client';

import React, { useState, useEffect, useRef } from 'react';
import { adminService } from '@/services/admin';
import { getImageUrl } from '@/services/api';
import { orderStatusMap } from '@/utils/status';
import { 
    TrendingUp, 
    Calendar, 
    ArrowLeft, 
    ShoppingBag, 
    ArrowUpRight,
    ArrowDownRight,
    BarChart3,
    History,
    Download,
    ChevronLeft,
    ChevronRight,
    FileText,
    Users,
    TableProperties,
    Layers
} from 'lucide-react';
import Link from 'next/link';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface AnalyticsData {
    monthly_sales?: any[];
    recent_orders?: any[];
    [key: string]: any;
}

export default function AnalyticsPage() {
    const [stats, setStats] = useState<AnalyticsData | null>(null);
    const [allStats, setAllStats] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [pickerOpen, setPickerOpen] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);

    // Default to current month and year using lazy initialization
    const [selectedMonth, setSelectedMonth] = useState(() => new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());
    const [pickerYear, setPickerYear] = useState(() => new Date().getFullYear());

    useEffect(() => {
        const fetchStats = async () => {
            // Seul le premier chargement affiche le squelette, les suivants font juste clignoter l'opacité
            if (!stats) setLoading(true);
            else setIsRefreshing(true);
            
            try {
                const [resMonth, resAll] = await Promise.all([
                    adminService.getStats(selectedMonth, selectedYear),
                    adminService.getStats()
                ]);
                setStats(resMonth.data);
                setAllStats(resAll.data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
                setIsRefreshing(false);
            }
        };

        fetchStats();
    }, [selectedMonth, selectedYear]);

    // CSV Download Function
    const handleExportCSV = () => {
        if (!stats?.recent_orders) return;
        const headers = ["ID Commande", "Client", "Ville", "Date", "Montant (MAD)", "Statut"];
        const rows = stats.recent_orders.map((o: any) => [
            `#${o.order_number}`,
            `"${o.customer_name}"`,
            `"${o.customer_city}"`,
            new Date(o.created_at).toLocaleDateString('fr-FR'),
            o.total_amount,
            o.status
        ]);
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Export_Commandes_${selectedMonth}_${selectedYear}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Calculate Growth logic
    const calculateGrowth = () => {
        if (!allStats?.monthly_sales) return { value: 0, isPositive: true };
        const currentData = stats?.monthly_sales?.[0]?.total || 0;
        
        // Find previous month using the comprehensive list
        const allSales = allStats.monthly_sales;
        if (allSales.length >= 2) {
            // we compare with the 2nd to last element of global stats representing prior month usually
            const previousData = allSales[allSales.length - 2]?.total || 1; 
            const diff = ((currentData - previousData) / previousData) * 100;
            return { value: Math.abs(diff), isPositive: diff >= 0 };
        }
        return { value: 0, isPositive: true };
    };
    const growth = calculateGrowth();

    // Calculate Top Clients from recent orders
    const getTopClients = () => {
        if (!stats?.recent_orders) return [];
        const clients: any = {};
        stats.recent_orders.forEach((o: any) => {
            if (!clients[o.customer_name]) clients[o.customer_name] = { name: o.customer_name, city: o.customer_city, total: 0, orders: 0 };
            clients[o.customer_name].total += parseFloat(o.total_amount || 0);
            clients[o.customer_name].orders += 1;
        });
        return Object.values(clients).sort((a: any, b: any) => b.total - a.total).slice(0, 3);
    };

    // Close picker on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
                setPickerOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handlePickMonth = (month: number) => {
        setSelectedMonth(month);
        setSelectedYear(pickerYear);
        setPickerOpen(false);
    };

    // Top products for the SELECTED month only
    const legends = React.useMemo(() => {
        if (!stats?.monthly_sales?.[0]?.top_products) return [];
        return stats.monthly_sales[0].top_products.slice(0, 4);
    }, [stats]);

    const handleDownloadPDF = () => {
        window.print();
    };

    const monthNames = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];
    const monthShort = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

    if (loading) {
        return (
            <div className="space-y-12 animate-pulse pb-24">
                <div className="h-40 bg-white rounded-[3rem] border border-stone-100"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-40 bg-white rounded-[2rem] border border-stone-100"></div>
                    ))}
                </div>
                <div className="h-[600px] bg-white rounded-[4rem] border border-stone-100"></div>
            </div>
        );
    }

    const currentMonthData = stats?.monthly_sales?.[0];

    return (
        <div className={`space-y-12 pb-24 mx-auto print:space-y-6 print:pb-0 transition-opacity duration-300 ${isRefreshing ? 'opacity-50 pointer-events-none' : ''}`}>
            {/* Global Print Styles */}
            <style jsx global>{`
                @media print {
                    aside, header, nav, footer, .no-print, button, select, .cursor-pointer {
                        display: none !important;
                    }
                    body, html {
                        margin: 0 !important;
                        padding: 0 !important;
                        background: white !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    main {
                        padding: 0 !important;
                        margin: 0 !important;
                        width: 100% !important;
                        max-width: 100% !important;
                    }
                    .print-header {
                        display: block !important;
                    }
                    .mx-auto {
                        width: 100% !important;
                        max-width: 100% !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    .shadow-2xl, .shadow-xl, .shadow-sm {
                        shadow: none !important;
                        box-shadow: none !important;
                        border: 1px solid #e5e7eb !important;
                    }
                    /* Ensure images load */
                    img {
                        max-width: 100% !important;
                    }
                }
            `}</style>
            {/* Header with Glassmorphism Effect & Filters */}
            <div className="relative p-12 bg-white rounded-[3.5rem] border border-stone-100 shadow-2xl group">
                {/* Background effects with overflow hidden */}
                <div className="absolute inset-0 overflow-hidden rounded-[3.5rem] pointer-events-none">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:scale-125 transition-transform duration-1000" />
                </div>
                <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-10">
                    <div className="space-y-4">
                        <Link href="/admin" className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors text-[10px] font-black uppercase tracking-[0.3em] px-5 py-2.5 bg-stone-50 rounded-full no-print">
                            <ArrowLeft size={12} /> Dashboard
                        </Link>
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-stone-900 rounded-[1.75rem] flex items-center justify-center text-white shadow-2xl">
                                <History size={36} />
                            </div>
                            <div>
                                <h1 className="text-5xl font-playfair font-bold text-stone-900 tracking-tight leading-tight italic">Rapport Mensuel</h1>
                                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-stone-400 mt-2 italic flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    Analyse {monthNames[selectedMonth - 1]} {selectedYear}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Custom Month/Year Picker */}
                        <div className="relative no-print" ref={pickerRef}>
                            <button
                                onClick={() => { setPickerOpen(o => !o); setPickerYear(selectedYear); }}
                                className="flex items-center gap-3 px-6 py-3.5 bg-white border-2 border-stone-100 rounded-2xl hover:border-stone-900 transition-all group shadow-sm"
                            >
                                <Calendar size={16} className="text-stone-400 group-hover:text-stone-900 transition-colors" />
                                <span className="text-sm font-black uppercase tracking-widest text-stone-900">
                                    {monthNames[selectedMonth - 1]} {selectedYear}
                                </span>
                                <ChevronRight size={14} className={`text-stone-400 transition-transform duration-300 ${pickerOpen ? 'rotate-90' : ''}`} />
                            </button>

                            {/* Dropdown picker */}
                            {pickerOpen && (
                                <div className="absolute top-full mt-3 left-0 z-50 w-72 bg-white border border-stone-100 rounded-[2rem] shadow-2xl shadow-stone-200/80 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    {/* Year navigation */}
                                    <div className="flex items-center justify-between px-6 py-5 border-b border-stone-50">
                                        <button
                                            onClick={() => setPickerYear(y => y - 1)}
                                            className="w-9 h-9 rounded-xl bg-stone-50 hover:bg-stone-900 hover:text-white text-stone-600 flex items-center justify-center transition-all"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>
                                        <span className="text-xl font-playfair font-bold text-stone-900 italic">{pickerYear}</span>
                                        <button
                                            onClick={() => setPickerYear(y => y + 1)}
                                            className="w-9 h-9 rounded-xl bg-stone-50 hover:bg-stone-900 hover:text-white text-stone-600 flex items-center justify-center transition-all"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>

                                    {/* Month grid */}
                                    <div className="grid grid-cols-4 gap-2 p-4">
                                        {monthShort.map((m, i) => {
                                            const currentDate = new Date();
                                            const isSel = i + 1 === selectedMonth && pickerYear === selectedYear;
                                            const isCurrent = i + 1 === currentDate.getMonth() + 1 && pickerYear === currentDate.getFullYear();
                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => handlePickMonth(i + 1)}
                                                    className={`py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                                                        isSel
                                                            ? 'bg-stone-900 text-white shadow-lg'
                                                            : isCurrent
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                                            : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'
                                                    }`}
                                                >
                                                    {m}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button 
                            onClick={handleExportCSV}
                            className="flex items-center gap-2 px-6 py-4 bg-stone-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl hover:bg-stone-800 hover:scale-[1.03] active:scale-95 transition-all group lg:no-print"
                        >
                            <TableProperties size={18} className="group-hover:translate-y-0.5 transition-transform" /> 
                            Export CSV
                        </button>
                        <button 
                            onClick={handleDownloadPDF}
                            className="flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 hover:scale-[1.03] active:scale-95 transition-all group lg:no-print"
                        >
                            <Download size={18} className="group-hover:translate-y-0.5 transition-transform" /> 
                            Télécharger PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* Best Sellers of the MONTH */}
            <div className="space-y-8">
                <div className="flex items-center justify-between px-4">
                    <div className="flex items-center gap-4">
                        <TrendingUp className="text-primary" size={24} />
                        <h2 className="text-2xl font-playfair font-bold text-stone-900 italic">Best-Sellers de {monthNames[selectedMonth - 1]}</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {legends.length > 0 ? legends.map((p: any, i: number) => (
                        <div key={p.product_id} className="bg-white p-6 rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group cursor-pointer relative overflow-hidden">
                            <div className="flex items-center gap-5 relative z-10">
                                <div className="w-20 h-24 rounded-2xl bg-stone-50 overflow-hidden shadow-inner border border-stone-100 flex-shrink-0">
                                    {p.image ? (
                                        <img src={getImageUrl(p.image)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-stone-50"><ShoppingBag size={24} className="text-stone-200" /></div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black text-primary uppercase tracking-widest leading-none italic">#0{i+1} au Top</span>
                                    <h4 className="text-sm font-bold text-stone-900 line-clamp-2 leading-tight">{p.name}</h4>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <p className="text-[10px] font-black text-stone-900">{p.sold} <span className="text-stone-400 font-bold uppercase">Ventes</span></p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                                <FileText size={48} />
                            </div>
                        </div>
                    )) : (
                         <div className="col-span-full py-12 px-6 border-2 border-dashed border-stone-100 rounded-[2.5rem] flex flex-col items-center justify-center text-stone-300">
                            <History size={40} className="mb-4 opacity-50" />
                            <p className="text-xs font-black uppercase tracking-[0.3em]">Aucune donnée sur les ventes</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Categories of the MONTH */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 px-4">
                    <Layers className="text-primary" size={24} />
                    <h2 className="text-2xl font-playfair font-bold text-stone-900 italic">Meilleures Catégories</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentMonthData?.top_categories?.length > 0 ? currentMonthData.top_categories.map((c: any, i: number) => {
                        const maxRev = Math.max(...currentMonthData.top_categories.map((cat: any) => cat.revenue)) || 1;
                        const width = (c.revenue / maxRev) * 100;
                        return (
                            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-stone-50 rounded-bl-full -mr-16 -mt-16 group-hover:bg-primary/5 transition-colors duration-700" />
                                <div className="relative z-10 space-y-6">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest italic">Performance Rayon</span>
                                            <h4 className="text-xl font-bold text-stone-900 italic">{c.name}</h4>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                            <BarChart3 size={18} />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-baseline justify-between">
                                            <p className="text-2xl font-bold text-stone-900">{c.revenue?.toLocaleString()} <span className="text-[10px] font-black text-stone-400 uppercase">MAD</span></p>
                                            <p className="text-[10px] font-bold text-emerald-600">+{c.sold} Ventes</p>
                                        </div>
                                        <div className="h-2 w-full bg-stone-50 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-stone-900 rounded-full group-hover:bg-primary transition-all duration-1000 ease-out" 
                                                style={{ width: `${width}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="col-span-full py-12 px-6 border-2 border-dashed border-stone-100 rounded-[2.5rem] flex flex-col items-center justify-center text-stone-300 bg-stone-50/50">
                            <Layers size={40} className="mb-4 opacity-50" />
                            <p className="text-xs font-black uppercase tracking-[0.3em]">En attente de commandes livrées</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Monthly Report Card (Showing only the selected one) */}
            <div className="pt-8">
                {currentMonthData ? (
                    <div className="bg-white rounded-[4rem] border border-stone-100 shadow-2xl overflow-hidden group hover:border-primary/20 transition-all duration-700 flex flex-col">
                        <div className="p-12 space-y-10 flex-grow">
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-stone-50 pb-10 relative">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="px-4 py-1.5 bg-stone-900 rounded-full text-white text-[10px] font-black uppercase tracking-[0.2em] italic">
                                            Rapport détaillé • {selectedYear}
                                        </div>
                                    </div>
                                    <h3 className="text-6xl font-playfair font-bold text-stone-900 capitalize italic tracking-tight">{currentMonthData.name}</h3>
                                    <p className="text-[11px] font-black text-stone-400 uppercase tracking-[0.3em]">Performance du catalogue d'exception</p>
                                </div>
                                <div className="text-right flex flex-col items-end">
                                    <div className="text-xs font-black text-stone-300 uppercase tracking-widest mb-2 text-right">Volume Transactionnel</div>
                                    <div className="text-5xl font-bold text-stone-900 tracking-tighter">
                                        {currentMonthData.total?.toLocaleString()}
                                        <span className="text-sm text-stone-400 ml-2 font-bold uppercase tracking-widest italic">MAD</span>
                                    </div>
                                    {growth.value > 0 && (
                                        <div className={`mt-3 flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold ${growth.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                            {growth.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                            {growth.isPositive ? '+' : '-'}{growth.value.toFixed(1)}% vs mois précédent
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Section: Recharts Evolution & Top Clients */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-4">
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-lg font-bold text-stone-900 italic">Évolution sur 6 Mois</h4>
                                        <span className="text-[10px] font-black uppercase text-stone-400 tracking-widest bg-stone-50 px-3 py-1 rounded">Global</span>
                                    </div>
                                    <div className="h-[250px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={allStats?.monthly_sales || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a8a29e', fontWeight: 900 }} />
                                                <Tooltip 
                                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                                                    cursor={{ stroke: '#e7e5e4', strokeWidth: 2 }}
                                                />
                                                <Area type="monotone" dataKey="total" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between border-b border-stone-50 pb-4">
                                        <div className="flex items-center gap-3">
                                            <Users size={18} className="text-stone-900" />
                                            <h4 className="text-lg font-bold text-stone-900 italic">Top Clients</h4>
                                        </div>
                                    </div>
                                    <div className="space-y-4 pt-2">
                                        {getTopClients().map((client: any, i: number) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl hover:bg-stone-100 transition-colors">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold text-stone-900">{client.name}</p>
                                                    <p className="text-[10px] uppercase font-black text-stone-400">📍 {client.city} • {client.orders} cmds</p>
                                                </div>
                                                <p className="text-sm font-bold text-emerald-600">{client.total.toLocaleString()} MAD</p>
                                            </div>
                                        ))}
                                        {getTopClients().length === 0 && (
                                            <div className="p-8 text-center bg-stone-50 rounded-2xl border-2 border-dashed border-stone-100">
                                                <p className="text-xs font-black uppercase text-stone-400 italic tracking-widest">Données insuffisantes</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 space-y-8 border-t border-stone-50 mt-8">
                                <h4 className="text-xl font-bold text-stone-900 italic mb-6">Produits Phares du Mois</h4>
                                {currentMonthData.top_products && currentMonthData.top_products.length > 0 ? (
                                    currentMonthData.top_products.map((product: any, pIdx: number) => {
                                        const maxInMonth = Math.max(...currentMonthData.top_products.map((p: any) => p.sold)) || 1;
                                        const width = (product.sold / maxInMonth) * 100;
                                        
                                        return (
                                            <div key={pIdx} className="group/item flex flex-col sm:flex-row items-center gap-10 p-8 rounded-[3.5rem] hover:bg-stone-50/80 transition-all border border-transparent hover:border-stone-100 relative">
                                                <div className="relative w-36 h-48 flex-shrink-0 group-hover/item:scale-105 transition-transform duration-500">
                                                    <div className="absolute inset-0 bg-stone-100 rounded-[2.5rem] shadow-inner group-hover/item:rotate-12 transition-transform duration-700" />
                                                    <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl group-hover/item:-rotate-3 transition-transform duration-500">
                                                        {product.image ? (
                                                            <img src={getImageUrl(product.image)} className="w-full h-full object-cover" alt="" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-stone-50"><ShoppingBag size={28} className="text-stone-200" /></div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex-grow space-y-7 w-full">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="space-y-1">
                                                            <h4 className="text-2xl font-bold text-stone-900 group-hover/item:text-primary transition-colors line-clamp-1">{product.name}</h4>
                                                            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest italic">Identifiant Produit #{product.product_id}</p>
                                                        </div>
                                                        <div className="w-14 h-14 rounded-2xl bg-white border border-stone-100 flex items-center justify-center text-stone-900 shadow-sm opacity-0 group-hover/item:opacity-100 transition-opacity">
                                                            <ArrowUpRight size={24} />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                                <span className="text-xs font-black text-stone-900 uppercase tracking-tighter">{product.sold} Ventes Directes</span>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-stone-400 italic">Score Performance: {Math.round(width)}%</span>
                                                        </div>
                                                        <div className="h-4 w-full bg-stone-50 rounded-full overflow-hidden p-1 border border-stone-100/50">
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
                                        <h5 className="text-xl font-playfair font-bold text-stone-900 mb-2 italic">Aucune transaction ce mois-ci</h5>
                                        <p className="text-xs font-bold text-stone-300 uppercase tracking-[0.3em] font-mono">En attente de données...</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Premium Card Footer with Download */}
                        <div className="px-12 py-10 bg-stone-900 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-white uppercase tracking-widest">{monthNames[selectedMonth - 1]} {selectedYear}</p>
                                    <p className="text-[9px] font-medium text-stone-500 uppercase tracking-[0.2em] mt-0.5">Données Finalisées</p>
                                </div>
                            </div>
                            <button 
                                onClick={handleDownloadPDF}
                                className="flex items-center gap-3 px-8 py-4 bg-white text-stone-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-stone-100 transition-all shadow-2xl relative overflow-hidden group/export no-print"
                            >
                                <div className="absolute inset-x-0 bottom-0 h-1 bg-emerald-500 translate-y-full group-hover/export:translate-y-0 transition-transform" />
                                <Download size={14} className="group-hover/export:translate-y-0.5 transition-transform" /> 
                                Exporter en PDF
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white p-24 rounded-[4rem] border-2 border-dashed border-stone-100 text-center">
                        <History size={60} className="mx-auto text-stone-100 mb-8" />
                        <h3 className="text-2xl font-playfair font-bold text-stone-900 italic mb-2">Pas encore de données</h3>
                        <p className="text-xs font-black text-stone-400 uppercase tracking-[0.3em]">Veuillez sélectionner une autre période</p>
                    </div>
                )}
            </div>

            {/* Recent Orders Table Section */}
            <div className="pt-12 space-y-8">
                <div className="flex items-center justify-between px-4">
                    <div className="flex items-center gap-4">
                        <ShoppingBag className="w-7 h-7 text-stone-900" />
                        <h2 className="text-3xl font-playfair font-bold text-stone-900 tracking-tight leading-none italic">Dernières Transactions</h2>
                    </div>
                    <div className="hidden lg:flex items-center gap-4">
                        <div className="px-4 py-2 bg-stone-50 rounded-xl text-[10px] font-bold text-stone-400 uppercase tracking-widest">Temps Réel</div>
                    </div>
                </div>

                <div className="bg-white rounded-[3.5rem] border border-stone-200 shadow-2xl overflow-hidden ring-1 ring-black/5">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-stone-900 text-stone-400 text-[10px] font-black uppercase tracking-[0.25em]">
                                    <th className="px-10 py-7">Réf.</th>
                                    <th className="px-10 py-7">Client / Destination</th>
                                    <th className="px-10 py-7">Date</th>
                                    <th className="px-10 py-7">Montant</th>
                                    <th className="px-10 py-7">Statut</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {stats?.recent_orders?.map((order: any) => {
                                    const status = orderStatusMap[order.status as keyof typeof orderStatusMap] || { label: order.status, color: 'text-stone-400 bg-stone-50 border-stone-100' };
                                    return (
                                        <tr key={order.id} className="hover:bg-stone-50/50 transition-colors group cursor-pointer">
                                            <td className="px-10 py-8">
                                                <div className="font-playfair font-bold text-stone-900 text-xl tracking-tight">#{order.order_number}</div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="text-base font-bold text-stone-900">{order.customer_name}</div>
                                                <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest mt-1 italic">{order.customer_city}, Mar</div>
                                            </td>
                                            <td className="px-10 py-8 text-stone-400 font-bold text-sm">
                                                {new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="font-bold text-stone-900 text-lg">{order.total_amount?.toLocaleString()} <span className="text-[10px] font-black text-stone-400">MAD</span></div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 inline-flex items-center gap-2 ${status.color}`}>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                                    {status.label}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
