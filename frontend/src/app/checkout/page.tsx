'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { orderService, getImageUrl } from '@/services/api';
import { ShoppingBag, CheckCircle2, ArrowRight, Loader2, MapPin, Phone, Mail, User, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
    const { cart, totalPrice, totalItems, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState<any>(null);
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_address: '',
        customer_city: 'Casablanca',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderData = {
                ...formData,
                items: cart.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: item.price,
                    custom_dimensions: item.custom_dimensions,
                    color: null // Could be extended if we add color selection
                }))
            };

            const response = await orderService.create(orderData);
            setOrderSuccess(response);
            clearCart();
            window.scrollTo(0, 0);
        } catch (error) {
            console.error("Failed to place order:", error);
            alert("Une erreur est survenue lors de la commande. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="min-h-screen bg-stone-50">
                <Header />
                <main className="container mx-auto px-4 py-40 text-center">
                    <div className="max-w-2xl mx-auto bg-white p-12 sm:p-20 shadow-2xl rounded-sm border border-stone-100 space-y-10 animate-in fade-in zoom-in duration-700">
                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 shadow-inner">
                            <CheckCircle2 size={48} strokeWidth={1.5} />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-primary uppercase tracking-[0.3em] text-[10px] font-bold">Acquisition Confirmée</h2>
                            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 italic">Merci pour votre confiance</h1>
                            <div className="h-1 w-20 bg-primary mx-auto" />
                            <p className="text-stone-500 font-light mt-6 leading-relaxed">
                                Votre commande <span className="font-bold text-stone-900 border-b border-stone-200">#{orderSuccess.order_number}</span> a été enregistrée avec succès. 
                                Un conseiller vous contactera sous peu pour confirmer les détails de la livraison.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                            <Link href="/products" className="btn-premium px-12 py-5">
                                Découvrir d&apos;autres pièces
                            </Link>
                            <Link href="/" className="text-stone-400 hover:text-stone-900 transition-colors uppercase tracking-widest text-[10px] font-black flex items-center justify-center gap-3">
                                Retour à l&apos;accueil
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-stone-50">
                <Header />
                <main className="container mx-auto px-4 py-40 text-center">
                    <div className="max-w-md mx-auto space-y-10">
                        <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-300">
                            <ShoppingBag size={40} />
                        </div>
                        <h1 className="text-3xl font-serif font-bold text-stone-900 italic">Votre sélection est vide</h1>
                        <Link href="/products" className="btn-premium inline-block px-12 py-5">
                            Voir le catalogue
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

            <main className="flex-grow container mx-auto px-4 pt-32 pb-24">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-4">
                        <h1 className="text-5xl font-serif font-bold text-stone-900 italic">Finaliser l&apos;Acquisition</h1>
                        <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-black text-stone-400">
                            <span className="text-primary border-b border-primary pb-1">Identification</span>
                            <ArrowRight size={12} />
                            <span>Confirmation</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
                        {/* Form Section */}
                        <div className="lg:col-span-7 space-y-12">
                            <form id="checkout-form" onSubmit={handleSubmit} className="bg-white p-10 sm:p-14 shadow-2xl shadow-stone-900/5 border border-stone-100 rounded-sm space-y-12">
                                <div className="space-y-10">
                                    <div className="flex items-center gap-4 pb-4 border-b border-stone-50">
                                        <div className="p-3 bg-stone-900 text-primary rounded-px shadow-xl">
                                            <User size={18} />
                                        </div>
                                        <h3 className="text-xs uppercase tracking-[0.3em] font-black text-stone-900">Informations Personnelles</h3>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                        <div className="space-y-3">
                                            <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block">Nom Complet</label>
                                            <div className="relative group">
                                                <input
                                                    required
                                                    type="text"
                                                    name="customer_name"
                                                    value={formData.customer_name}
                                                    onChange={handleInputChange}
                                                    placeholder="Jean Dupont"
                                                    className="w-full bg-stone-50 border-b border-stone-200 p-4 focus:border-stone-900 outline-none transition-all font-serif italic text-lg"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block">Email d&apos;exception</label>
                                            <input
                                                required
                                                type="email"
                                                name="customer_email"
                                                value={formData.customer_email}
                                                onChange={handleInputChange}
                                                placeholder="jean@exemple.com"
                                                className="w-full bg-stone-50 border-b border-stone-200 p-4 focus:border-stone-900 outline-none transition-all font-serif italic text-lg"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block">Numéro de Téléphone</label>
                                        <div className="flex gap-4">
                                            <div className="bg-stone-100 p-4 font-serif text-lg italic text-stone-500 border-b border-stone-200 shrink-0">+212</div>
                                            <input
                                                required
                                                type="tel"
                                                name="customer_phone"
                                                value={formData.customer_phone}
                                                onChange={handleInputChange}
                                                placeholder="6 12 34 56 78"
                                                className="w-full bg-stone-50 border-b border-stone-200 p-4 focus:border-stone-900 outline-none transition-all font-serif italic text-lg"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-10 pt-4">
                                    <div className="flex items-center gap-4 pb-4 border-b border-stone-50">
                                        <div className="p-3 bg-stone-900 text-primary rounded-px shadow-xl">
                                            <MapPin size={18} />
                                        </div>
                                        <h3 className="text-xs uppercase tracking-[0.3em] font-black text-stone-900">Adresse de Livraison</h3>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                        <div className="sm:col-span-2 space-y-3">
                                            <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block">Adresse de Résidence</label>
                                            <textarea
                                                required
                                                name="customer_address"
                                                value={formData.customer_address}
                                                onChange={handleInputChange}
                                                rows={2}
                                                placeholder="N°42, Rue du Palais..."
                                                className="w-full bg-stone-50 border-b border-stone-200 p-4 focus:border-stone-900 outline-none transition-all font-serif italic text-lg"
                                            />
                                        </div>
                                        <div className="sm:col-span-2 space-y-3">
                                            <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block">Ville</label>
                                            <select
                                                name="customer_city"
                                                value={formData.customer_city}
                                                onChange={handleInputChange}
                                                className="w-full bg-stone-50 border-b border-stone-200 p-4 focus:border-stone-900 outline-none transition-all font-serif italic text-lg appearance-none cursor-pointer"
                                            >
                                                {['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Agadir', 'Fès', 'Meknès', 'Oujda', 'Autre'].map(city => (
                                                    <option key={city} value={city}>{city}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-10 flex flex-col sm:flex-row gap-8 items-center justify-between border-t border-stone-100">
                                    <div className="flex items-center gap-4 text-stone-400">
                                        <ShieldCheck size={20} className="text-primary" />
                                        <p className="text-[9px] uppercase tracking-widest font-black leading-tight">
                                            Paiement Sécurisé <br />à la livraison
                                        </p>
                                    </div>
                                    <button
                                        disabled={loading}
                                        type="submit"
                                        className="btn-premium w-full sm:w-auto px-16 py-6 text-xs flex items-center justify-center gap-4 group disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" />
                                                Traitement en cours...
                                            </>
                                        ) : (
                                            <>
                                                Confirmer ma Commande
                                                <ArrowRight size={16} className="transition-transform duration-500 group-hover:translate-x-2" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Summary Section */}
                        <div className="lg:col-span-5 space-y-10 lg:sticky lg:top-40">
                            <div className="bg-white p-10 shadow-2xl shadow-stone-900/5 border border-stone-100 rounded-sm space-y-8">
                                <h3 className="text-xl font-serif font-bold text-stone-900 italic pb-6 border-b border-stone-50">Votre Collection ({totalItems})</h3>
                                
                                <div className="max-h-[400px] overflow-y-auto pr-4 space-y-6 scrollbar-thin scrollbar-thumb-stone-100 scrollbar-track-transparent">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex gap-6 group">
                                            <div className="w-20 h-28 bg-stone-50 rounded-sm overflow-hidden shrink-0 shadow-sm transition-transform duration-500 group-hover:scale-95">
                                                <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <h4 className="text-sm font-serif font-bold text-stone-900">{item.name}</h4>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-tighter">Qté: {item.quantity}</span>
                                                    <span className="text-sm font-serif font-bold text-stone-900 italic">{(item.price * item.quantity).toLocaleString()} MAD</span>
                                                </div>
                                                {item.custom_dimensions && (
                                                    <p className="text-[9px] text-primary font-black uppercase tracking-widest bg-primary/5 px-2 py-1 rounded-px inline-block mt-2">
                                                        {item.custom_dimensions.longueur}x{item.custom_dimensions.largeur} cm
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4 pt-10 border-t border-stone-100">
                                    <div className="flex justify-between items-center text-xs uppercase tracking-widest text-stone-400 font-bold">
                                        <span>Sous-total</span>
                                        <span className="text-stone-900">{totalPrice.toLocaleString()} MAD</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs uppercase tracking-widest text-stone-400 font-bold">
                                        <span>Livraison</span>
                                        <span className="text-green-600 font-black text-[10px]">GRATUITE</span>
                                    </div>
                                    <div className="flex justify-between items-end pt-6">
                                        <span className="text-xs uppercase tracking-[0.3em] text-stone-900 font-black">Total Final</span>
                                        <div className="text-right">
                                            <p className="text-4xl font-serif font-bold text-primary tracking-tighter leading-none">{totalPrice.toLocaleString()} MAD</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-8 luxury-glass rounded-sm border border-stone-200/50 space-y-4">
                                <div className="flex items-center gap-4 text-stone-900">
                                    <ShieldCheck size={20} className="text-primary" />
                                    <h4 className="text-[10px] font-black uppercase tracking-widest">Garantie d&apos;Authenticité</h4>
                                </div>
                                <p className="text-[10px] text-stone-500 uppercase tracking-tighter leading-relaxed">
                                    Chaque tapis est livré avec son certificat d&apos;origine, garantissant un tissage artisanal marocain pur et respectueux des traditions séculaires.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
