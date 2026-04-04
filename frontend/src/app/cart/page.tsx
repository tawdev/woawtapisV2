'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { getImageUrl } from '@/services/api';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Ruler, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-[#FDFCFB]">
                <Header />
                <main className="container mx-auto px-4 py-32 md:py-48 text-center">
                    <div className="max-w-xl mx-auto space-y-10">
                        <div className="relative inline-block">
                            <div className="w-32 h-32 bg-stone-50 rounded-full flex items-center justify-center mx-auto text-stone-300 border border-stone-100 shadow-inner">
                                <ShoppingBag size={48} strokeWidth={1} />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white border border-stone-100 rounded-full flex items-center justify-center text-stone-400 shadow-sm">
                                <Plus size={20} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-stone-900 tracking-tight italic">Votre collection est vide</h1>
                            <p className="text-stone-500 font-medium max-w-sm mx-auto leading-relaxed">
                                Explorez nos pièces uniques et commencez à créer l'ambiance de vos rêves.
                            </p>
                        </div>
                        <div className="pt-6">
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-4 bg-stone-900 text-white px-12 py-5 rounded-full font-bold hover:bg-stone-800 transition-all duration-500 shadow-2xl shadow-stone-900/20 group"
                            >
                                <span className="text-xs uppercase tracking-[0.3em]">Découvrir l&apos;Excellence</span>
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFCFB] flex flex-col">
            <Header />

            <main className="flex-grow container mx-auto px-4 pt-40 pb-24">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div className="space-y-2">
                            <h1 className="text-5xl lg:text-7xl font-playfair font-bold text-stone-900 tracking-tighter">Mon Panier</h1>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] uppercase font-black tracking-[0.4em] text-stone-400 italic">Pièces Sélectionnées • {totalItems} Articles</span>
                            </div>
                        </div>
                        <Link href="/products" className="group flex items-center gap-4 text-stone-400 hover:text-stone-900 transition-all duration-700">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Poursuivre la Galerie</span>
                            <div className="w-10 h-10 rounded-full border border-stone-100 flex items-center justify-center group-hover:border-stone-900 group-hover:bg-stone-900 group-hover:text-white transition-all">
                                <ArrowRight size={14} />
                            </div>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20 items-start">
                        {/* Items List */}
                        <div className="lg:col-span-8 space-y-10">
                            <div className="space-y-6">
                                {cart.map((item) => (
                                    <div 
                                        key={item.id} 
                                        className="relative group bg-white p-6 md:p-8 rounded-[2rem] border border-stone-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col sm:flex-row gap-8 items-center"
                                    >
                                        {/* Image wrapper with glass effect */}
                                        <div className="relative w-40 h-52 shrink-0 rounded-2xl overflow-hidden shadow-2xl shadow-stone-900/10 border border-stone-50">
                                            <img 
                                                src={getImageUrl(item.image)} 
                                                alt={item.name} 
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                                            />
                                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                        </div>

                                        {/* Info & controls */}
                                        <div className="flex-1 flex flex-col justify-between w-full h-full py-2">
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="space-y-2">
                                                    <Link href={`/product/${item.slug}`} className="block">
                                                        <h2 className="text-2xl font-playfair font-bold text-stone-900 hover:text-stone-600 transition-colors tracking-tight">
                                                            {item.name}
                                                        </h2>
                                                    </Link>
                                                    <div className="flex flex-wrap gap-2 items-center">
                                                        {item.custom_dimensions ? (
                                                            <div className="flex items-center gap-2 text-[9px] text-stone-500 font-black bg-stone-50 px-3 py-1.5 rounded-full border border-stone-100 uppercase tracking-widest">
                                                                <Ruler size={10} className="text-stone-400" />
                                                                <span>{item.custom_dimensions.longueur} x {item.custom_dimensions.largeur} CM</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2 text-[9px] text-stone-500 font-black bg-stone-50 px-3 py-1.5 rounded-full border border-stone-100 uppercase tracking-widest">
                                                                <span>Dimensions Standard</span>
                                                            </div>
                                                        )}
                                                        <span className="text-[9px] text-stone-400 font-black uppercase tracking-widest px-3 py-1.5 border border-stone-50 rounded-full italic">Authentic craft</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="w-10 h-10 rounded-full flex items-center justify-center text-stone-200 hover:text-red-500 hover:bg-red-50 transition-all duration-300 border border-transparent hover:border-red-100"
                                                    title="Retirer"
                                                >
                                                    <Trash2 size={16} strokeWidth={1.5} />
                                                </button>
                                            </div>

                                            <div className="flex flex-wrap justify-between items-end gap-6 mt-8">
                                                {/* Sophisticated quantity controller */}
                                                <div className="flex items-center bg-stone-50/50 rounded-xl p-1 border border-stone-50">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg text-stone-400 hover:text-stone-900 transition-all shadow-sm shadow-transparent hover:shadow-stone-200/50 disabled:opacity-30"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="w-12 text-center text-sm font-bold text-stone-900">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg text-stone-400 hover:text-stone-900 transition-all shadow-sm shadow-transparent hover:shadow-stone-200/50"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-stone-400 line-through opacity-50 mb-1 hidden sm:block">
                                                        {(item.price * item.quantity * 1.2).toLocaleString()} MAD
                                                    </p>
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-2xl font-playfair font-black text-stone-900">
                                                            {(item.price * item.quantity).toLocaleString()} <span className="text-xs">MAD</span>
                                                        </span>
                                                        <span className="text-[10px] text-stone-400 font-bold uppercase tracking-tighter mt-1 italic">TVA incluse</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Trust badges */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-stone-100">
                                <div className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-stone-50 shadow-sm">
                                    <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-900 shrink-0">
                                        <Truck size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-stone-900 mb-1">Livraison Gratuite</p>
                                        <p className="text-[9px] text-stone-400 font-medium">Partout au Maroc</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-stone-50 shadow-sm">
                                    <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-900 shrink-0">
                                        <ShieldCheck size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-stone-900 mb-1">Paiement Sécurisé</p>
                                        <p className="text-[9px] text-stone-400 font-medium">À la livraison</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-stone-50 shadow-sm">
                                    <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-900 shrink-0">
                                        <RotateCcw size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-stone-900 mb-1">Satisfaction</p>
                                        <p className="text-[9px] text-stone-400 font-medium">Contrôle à l&apos;arrivée</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Summary Card - The Floating Checkout Case */}
                        <div className="lg:col-span-4 lg:sticky lg:top-40">
                            <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_40px_100px_rgb(0,0,0,0.06)] border border-stone-100/60 relative overflow-hidden group">
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-24 h-24 bg-stone-50 rounded-bl-full -translate-y-2 translate-x-2 transition-transform duration-1000 group-hover:scale-110" />
                                
                                <h3 className="relative z-10 text-2xl font-playfair font-bold text-stone-900 mb-10 pb-6 border-b border-stone-50">Résumé</h3>

                                <div className="space-y-6 relative z-10">
                                    <div className="flex justify-between items-center group/line">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 group-hover/line:text-stone-900 transition-colors">Sous-total</span>
                                        <span className="text-lg font-bold text-stone-900">{totalPrice.toLocaleString()} MAD</span>
                                    </div>
                                    <div className="flex justify-between items-center group/line">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 group-hover/line:text-stone-900 transition-colors">Livraison</span>
                                        <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase italic">Offerte</span>
                                    </div>
                                    <div className="flex justify-between items-center group/line border-t border-dashed border-stone-100 pt-6 mt-6">
                                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-stone-900 group-hover/line:translate-x-1 transition-transform">Total Final</span>
                                        <div className="text-right">
                                            <p className="text-4xl font-playfair font-black text-stone-900 leading-none">{totalPrice.toLocaleString()} <span className="text-[10px] font-serif">MAD</span></p>
                                            <p className="text-[9px] text-stone-400 font-bold uppercase tracking-tighter mt-3 italic opacity-60">Estimation Frais Inclus</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-12 relative z-10">
                                    <Link
                                        href="/checkout"
                                        className="relative w-full bg-stone-900 text-white p-7 rounded-[1.2rem] hover:bg-stone-800 transition-all duration-500 flex items-center justify-between shadow-[0_20px_50px_-20px_rgba(0,0,0,0.4)] group/btn overflow-hidden"
                                    >
                                        <span className="text-[11px] font-black uppercase tracking-[0.5em] ml-2">Commander</span>
                                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover/btn:scale-110 group-hover/btn:bg-white/20 transition-all">
                                            <ArrowRight size={18} />
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-in-out" />
                                    </Link>
                                    
                                    <div className="mt-8 flex flex-col items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-stone-900">Paiement Cash à Livraison</span>
                                        </div>
                                        <p className="text-[9px] text-stone-400 text-center leading-relaxed font-medium px-4 max-w-[220px]">
                                            Expédition sous 24/48h. Emballage certifié Tapis Artisanat™ inclus.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
