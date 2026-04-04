'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { orderService, getImageUrl } from '@/services/api';
import { orderStatusMap } from '@/utils/status';
import { 
    Search, 
    Package, 
    Truck, 
    CheckCircle2, 
    Clock, 
    MapPin, 
    AlertCircle, 
    ArrowRight,
    Loader2,
    ShoppingBag,
    History
} from 'lucide-react';
import Link from 'next/link';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function TrackOrderContent() {
    const searchParams = useSearchParams();
    const queryOrder = searchParams.get('order');
    
    const [orderNumber, setOrderNumber] = useState(queryOrder || '');
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    React.useEffect(() => {
        if (queryOrder) {
            fetchOrder(queryOrder);
        }
    }, [queryOrder]);

    const fetchOrder = async (num: string) => {
        setLoading(true);
        setError('');
        setOrder(null);
        
        try {
            const data = await orderService.track(num.trim().toUpperCase());
            setOrder(data);
        } catch (err: any) {
            setError("Nous n'avons pas trouvé de commande avec ce numéro. Veuillez vérifier votre saisie ou contacter notre service client.");
            console.warn("Order tracking failed:", err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderNumber.trim()) return;
        fetchOrder(orderNumber);
    };

    const steps = [
        { key: 'pending', label: 'Commandé', icon: Clock, description: 'Nous avons reçu votre sélection' },
        { key: 'processing', label: 'Préparation', icon: Package, description: 'Votre tapis est préparé pour le voyage' },
        { key: 'shipped', label: 'Expédié', icon: Truck, description: 'En route vers votre demeure' },
        { key: 'delivered', label: 'Livré', icon: CheckCircle2, description: 'L\'excellence est arrivée' },
    ];

    const getCurrentStep = () => {
        if (!order) return -1;
        const index = steps.findIndex(s => s.key === order.status);
        if (order.status === 'cancelled') return -2;
        return index;
    };

    const currentStep = getCurrentStep();

    return (
        <main className="flex-grow container mx-auto px-4 pt-44 pb-24">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16 space-y-4 no-print">
                    <h1 className="text-5xl md:text-7xl font-playfair font-bold text-stone-900 tracking-tighter">Suivre mon Colis</h1>
                    <p className="text-stone-400 font-medium uppercase tracking-[0.3em] text-[10px]">Expérience Artisanale de Bout en Bout</p>
                </div>

                {/* Search Form */}
                <div className="bg-white p-2 rounded-[2.5rem] shadow-2xl shadow-stone-900/5 border border-stone-100 flex flex-col md:flex-row items-center gap-2 mb-12 no-print">
                    <div className="flex-1 w-full relative">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300">
                            <History size={20} />
                        </div>
                        <input 
                            type="text" 
                            value={orderNumber}
                            onChange={(e) => setOrderNumber(e.target.value)}
                            placeholder="Numéro de commande (ex: ORD-XXXXXXXXXX)"
                            className="w-full pl-14 pr-6 py-6 bg-transparent outline-none font-bold text-stone-900 text-lg placeholder:text-stone-300 placeholder:font-normal"
                        />
                    </div>
                    <button 
                        onClick={handleTrack}
                        disabled={loading || !orderNumber}
                        className="w-full md:w-auto px-10 py-6 bg-stone-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-stone-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                        Rechercher
                    </button>
                </div>

                {error && (
                    <div className="p-8 bg-red-50 rounded-[2rem] border border-red-100/50 flex flex-col items-center text-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500 no-print">
                        <AlertCircle className="text-red-500" size={32} />
                        <p className="text-red-700 font-bold text-sm leading-relaxed max-w-sm">{error}</p>
                    </div>
                )}

                {order && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {/* Status Timeline */}
                        <div className="bg-white p-10 md:p-16 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.04)] border border-stone-100/60 no-print">
                            <div className="flex flex-col md:flex-row justify-between gap-12 relative">
                                <div className="hidden md:block absolute top-[27px] left-[5%] right-[5%] h-0.5 bg-stone-100 z-0">
                                    <div 
                                        className="h-full bg-stone-900 transition-all duration-1000" 
                                        style={{ width: `${Math.max(0, currentStep) / (steps.length - 1) * 100}%` }}
                                    />
                                </div>

                                {steps.map((step, index) => {
                                    const isActive = index <= currentStep;
                                    const isCurrent = index === currentStep;
                                    return (
                                        <div key={step.key} className="relative z-10 flex md:flex-col items-center gap-6 md:gap-8 md:text-center group flex-1">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 border-2 ${
                                                isActive 
                                                ? 'bg-stone-900 border-stone-900 text-white shadow-xl shadow-stone-900/20' 
                                                : 'bg-white border-stone-100 text-stone-300'
                                            }`}>
                                                <step.icon size={24} className={isCurrent ? 'animate-pulse' : ''} />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className={`text-xs font-black uppercase tracking-widest ${isActive ? 'text-stone-900' : 'text-stone-300'}`}>
                                                    {step.label}
                                                </h3>
                                                <p className={`text-[10px] font-medium leading-relaxed max-w-[120px] ${isActive ? 'text-stone-500' : 'text-stone-300'}`}>
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Download Action */}
                        <div className="flex justify-end no-print">
                            <button 
                                onClick={() => window.print()}
                                className="flex items-center gap-3 bg-white text-stone-900 border border-stone-200 px-8 py-4 rounded-2xl font-bold hover:bg-stone-50 transition-all shadow-sm group"
                            >
                                <History size={16} className="text-stone-400 group-hover:text-stone-900 transition-colors" />
                                <span className="text-[10px] uppercase tracking-widest italic">Imprimer mon Reçu Officiel</span>
                            </button>
                        </div>

                        {/* Order Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 no-print">
                            <div className="bg-white p-10 rounded-[2.5rem] border border-stone-100/60 shadow-sm space-y-8">
                                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-stone-900 border-b border-stone-50 pb-6 italic">Informations Commande</h4>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Numéro</span>
                                        <span className="text-lg font-playfair font-bold text-stone-900">#{order.order_number}</span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Date d&apos;achat</span>
                                        <span className="text-sm font-bold text-stone-900">{new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px) font-black uppercase tracking-widest text-stone-400">Destinataire</span>
                                        <span className="text-sm font-bold text-stone-900">{order.customer_name}</span>
                                    </div>
                                    <div className="flex justify-between items-start pt-4 border-t border-stone-50">
                                        <MapPin size={16} className="text-stone-300 mt-1" />
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-stone-900">{order.customer_city}</p>
                                            <p className="text-xs text-stone-500 mt-1 max-w-[200px] break-words">{order.customer_address}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-10 rounded-[2.5rem] border border-stone-100/60 shadow-sm space-y-8 flex flex-col">
                                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-stone-900 border-b border-stone-50 pb-6 italic">Articles & Total</h4>
                                <div className="space-y-6 flex-grow overflow-y-auto max-h-[160px] pr-2 custom-scrollbar">
                                    {order.items?.map((item: any, idx: number) => (
                                        <div key={idx} className="flex gap-4 items-center">
                                            <div className="w-12 h-16 bg-stone-50 rounded-lg overflow-hidden shrink-0">
                                                {item.product?.primary_image || item.product?.images?.length ? (
                                                    <img 
                                                        src={getImageUrl(item.product?.primary_image?.image_path || item.product?.images?.[0]?.image_path)} 
                                                        className="w-full h-full object-cover" 
                                                        alt="" 
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-stone-200"><ShoppingBag size={14} /></div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-stone-900 truncate">{item.product_name}</p>
                                                <p className="text-[10px] text-stone-400 font-medium">Quantité: {item.quantity}</p>
                                            </div>
                                            <div className="text-xs font-bold text-stone-900">
                                                {parseFloat(item.subtotal).toLocaleString()} MAD
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-6 border-t border-stone-100 flex justify-between items-end">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-900">Total payé</span>
                                    <span className="text-3xl font-playfair font-black text-stone-900">{parseFloat(order.total_amount).toLocaleString()} <span className="text-xs">MAD</span></span>
                                </div>
                            </div>
                        </div>

                        {/* Hidden Print-only Template */}
                        <div className="hidden print:block text-left p-12 space-y-10 bg-white text-stone-900 border-2 border-stone-100 rounded-[2rem] shadow-2xl">
                            <div className="flex justify-between items-center border-b border-stone-100 pb-8">
                                <h1 className="text-4xl font-playfair font-bold italic tracking-tighter">WOW TAPIS</h1>
                                <div className="text-right space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Reçu Officiel de Commande</p>
                                    <p className="text-xl font-bold">#{order.order_number}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-16">
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 border-b border-stone-50 pb-2">Client</p>
                                    <p className="text-sm font-bold">{order.customer_name}<br/>{order.customer_phone}<br/>{order.customer_email}</p>
                                </div>
                                <div className="space-y-4 text-right">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 border-b border-stone-50 pb-2">Destination</p>
                                    <p className="text-sm font-bold">{order.customer_city}<br/>{order.customer_address}</p>
                                </div>
                            </div>
                            <table className="w-full text-sm border-t border-b border-stone-100 mt-10">
                                <thead>
                                    <tr className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                                        <th className="py-6 text-left">Désignation</th>
                                        <th className="py-6 text-center">Quantité</th>
                                        <th className="py-6 text-right">Montant</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items?.map((item: any, i: number) => (
                                        <tr key={i} className="border-t border-stone-50/50">
                                            <td className="py-6 font-bold">{item.product_name}</td>
                                            <td className="py-6 text-center">{item.quantity}</td>
                                            <td className="py-6 text-right font-bold">{parseFloat(item.subtotal).toLocaleString()} MAD</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="flex justify-end pt-10">
                                <div className="text-right space-y-3 p-8 bg-stone-50 rounded-2xl border border-stone-100">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Total Net Payé (TTC)</p>
                                    <p className="text-5xl font-playfair font-black">{parseFloat(order.total_amount).toLocaleString()} MAD</p>
                                    <p className="text-[9px] italic text-stone-400 uppercase tracking-widest font-black">Mode: Paiement à la Livraison</p>
                                </div>
                            </div>
                            <div className="pt-24 text-center border-t border-stone-50 text-[10px] text-stone-400 uppercase tracking-widest font-medium">
                                Société Wow Tapis S.A.R.L - Maison d&apos;artisanat de Luxe<br/>
                                contact@waootapis.com - Marrakeh, Maroc
                            </div>
                        </div>
                    </div>
                )}

                {/* Bottom CTA */}
                <div className="mt-20 p-10 rounded-[3rem] bg-stone-950 text-white text-center space-y-8 relative overflow-hidden group no-print">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="space-y-3 relative z-10">
                        <h3 className="text-xl font-playfair font-bold italic tracking-tight">Besoin d&apos;assistance ?</h3>
                        <p className="text-xs text-stone-400 font-medium tracking-widest uppercase opacity-60">Notre équipe est à votre disposition 7j/7</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10 px-4">
                        <Link href="/contact" className="px-8 py-4 bg-white text-stone-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                            Nous Contacter
                        </Link>
                        <a href="https://wa.me/212600000000" className="px-8 py-4 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600/30 transition-all">
                            Parler sur WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function TrackOrderPage() {
    return (
        <div className="min-h-screen bg-[#FDFCFB] flex flex-col">
            <Header />
            <Suspense fallback={
                <div className="flex-grow flex items-center justify-center pt-44">
                    <Loader2 className="animate-spin text-stone-200" size={48} />
                </div>
            }>
                <TrackOrderContent />
            </Suspense>
            <Footer />
            
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #F3F4F6;
                    border-radius: 10px;
                }
                @media print {
                    .no-print, header, footer, nav, button {
                        display: none !important;
                    }
                    .print-only, .print-block {
                        display: block !important;
                    }
                    body {
                        background: white !important;
                    }
                }
            `}</style>
        </div>
    );
}
