'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { getImageUrl } from '@/services/api';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Ruler } from 'lucide-react';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-stone-50">
                <Header />
                <main className="container mx-auto px-4 py-32 text-center">
                    <div className="max-w-md mx-auto space-y-8">
                        <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-primary shadow-inner">
                            <ShoppingBag size={40} strokeWidth={1.5} />
                        </div>
                        <div className="space-y-3">
                            <h1 className="text-3xl font-serif font-bold text-stone-800 uppercase tracking-tight">Votre panier est vide</h1>
                            <p className="text-stone-500 font-medium">
                                Il semble que vous n&apos;ayez pas encore ajouté de tapis à votre sélection.
                            </p>
                        </div>
                        <Link
                            href="/products"
                            className="inline-block bg-stone-900 text-white px-10 py-4 rounded-sm font-bold hover:bg-primary transition-all duration-500 shadow-xl shadow-stone-900/10 uppercase tracking-widest text-xs"
                        >
                            Découvrir nos tapis
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col">
            <Header />

            <main className="flex-grow container mx-auto px-4 pt-32 pb-16">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-12">
                        <h1 className="text-4xl lg:text-5xl font-serif font-bold text-stone-900 tracking-tight">Votre Sélection</h1>
                        <Link href="/products" className="hidden sm:flex items-center gap-3 text-stone-400 hover:text-primary transition-all duration-500 text-[10px] font-black uppercase tracking-[0.3em] group">
                            <div className="w-8 h-px bg-stone-200 group-hover:w-12 group-hover:bg-primary transition-all duration-500" />
                            Continuer mes achats
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
                        {/* Items List */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white rounded-sm border border-stone-100 shadow-sm overflow-hidden">
                                <div className="divide-y divide-stone-100">
                                    {cart.map((item) => (
                                        <div key={item.id} className="p-8 flex flex-col sm:flex-row gap-8 items-center sm:items-stretch group">
                                            {/* Image */}
                                            <div className="w-32 h-44 bg-stone-100 rounded-sm overflow-hidden shrink-0 shadow-md">
                                                <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 flex flex-col justify-between w-full">
                                                <div className="flex justify-between items-start gap-4">
                                                    <div className="space-y-1">
                                                        <Link href={`/product/${item.slug}`} className="text-xl font-serif font-bold text-stone-900 hover:text-primary transition-all duration-300">
                                                            {item.name}
                                                        </Link>
                                                        {item.custom_dimensions && (
                                                            <div className="flex items-center gap-2 text-[10px] text-stone-400 font-bold bg-stone-50 px-2 py-1 rounded-sm w-fit">
                                                                <Ruler size={10} />
                                                                <span>{item.custom_dimensions.longueur} x {item.custom_dimensions.largeur} cm</span>
                                                            </div>
                                                        )}
                                                        <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-black">
                                                            Authentique Tapis Marocain
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-stone-300 hover:text-red-600 transition-all duration-300 p-1 rounded-full hover:bg-red-50"
                                                        title="Supprimer"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>

                                                <div className="flex justify-between items-end mt-6">
                                                    {/* Quantity Selector */}
                                                    <div className="flex items-center border border-stone-100 rounded-sm bg-stone-50 overflow-hidden shadow-sm">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="p-2.5 hover:bg-stone-200 text-stone-500 transition-colors"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="w-12 text-center text-sm font-bold text-stone-900">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="p-2.5 hover:bg-stone-200 text-stone-500 transition-colors"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>

                                                    <div className="text-right">
                                                        <p className="text-xl font-serif font-bold text-stone-900 leading-none mb-1">{(item.price * item.quantity).toLocaleString()} MAD</p>
                                                        <p className="text-[10px] text-stone-400 font-medium italic">
                                                            {item.custom_dimensions ? 'Confection sur mesure' : `${item.price.toLocaleString()} MAD le tapis`}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex sm:hidden">
                                <Link href="/products" className="w-full text-center bg-white border border-stone-100 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 hover:text-stone-900 hover:border-stone-900 transition-all duration-500">
                                    Continuer mes achats
                                </Link>
                            </div>
                        </div>

                        {/* Summary Card */}
                        <div className="bg-white p-10 rounded-sm shadow-2xl shadow-stone-900/5 border border-stone-100 space-y-8 lg:sticky lg:top-32 transition-all duration-700 hover:shadow-stone-900/10">
                            <h3 className="text-xl font-serif font-bold text-stone-900 pb-6 border-b border-stone-50 tracking-tight">Récapitulatif de collection</h3>

                            <div className="space-y-5 text-xs font-medium uppercase tracking-wider">
                                <div className="flex justify-between">
                                    <span className="text-stone-400">Articles ({totalItems})</span>
                                    <span className="text-stone-900 font-bold">{totalPrice.toLocaleString()} MAD</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-stone-400">Livraison Express</span>
                                    <span className="text-green-600 font-black text-[9px] bg-green-50 px-3 py-1 ring-1 ring-green-100 uppercase">Gratuite</span>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-stone-50">
                                <div className="flex justify-between items-end mb-10">
                                    <span className="text-lg font-serif font-bold text-stone-900 uppercase tracking-widest text-[11px]">Total final</span>
                                    <div className="text-right">
                                        <p className="text-4xl font-serif font-bold text-primary tracking-tighter leading-none mb-2">{totalPrice.toLocaleString()} MAD</p>
                                        <p className="text-[9px] text-stone-400 font-medium italic opacity-60">TVA, emballage et assurance inclus</p>
                                    </div>
                                </div>

                                <Link
                                    href="/checkout"
                                    className="w-full bg-stone-900 text-white font-black py-6 rounded-sm hover:bg-primary transition-all duration-1000 flex items-center justify-center gap-4 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] group overflow-hidden relative"
                                >
                                    <span className="relative z-10 text-[11px] uppercase tracking-[0.4em]">Finaliser la sélection</span>
                                    <ArrowRight size={16} className="relative z-10 group-hover:translate-x-2 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-1000 ease-in-out" />
                                </Link>
                            </div>


                            <p className="text-[9px] text-stone-400 text-center leading-relaxed font-medium uppercase tracking-tighter px-4">
                                Livraison sécurisée à domicile. Paiement intégral à la réception de votre commande.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
