'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { orderService, getImageUrl } from '@/services/api';
import { ShoppingBag, CheckCircle2, ArrowRight, Loader2, MapPin, Phone, Mail, User, ShieldCheck, CreditCard, Truck, ChevronLeft } from 'lucide-react';
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
                    color: null
                }))
            };

            const response = await orderService.create(orderData);
            setOrderSuccess(response.data || response);
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
            <div className="min-h-screen bg-[#FDFCFB]">
                <Header />
                <main className="container mx-auto px-4 py-48 text-center">
                    <div className="max-w-3xl mx-auto bg-white p-12 md:p-24 shadow-[0_40px_120px_rgba(0,0,0,0.08)] rounded-[3rem] border border-stone-50 space-y-12 relative overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-100 via-emerald-400 to-emerald-100" />
                        
                        <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500 shadow-inner group">
                            <CheckCircle2 size={64} strokeWidth={1} className="group-hover:scale-110 transition-transform" />
                        </div>

                        <div className="space-y-6">
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500">Transaction Réussie</span>
                            <h1 className="text-4xl md:text-6xl font-playfair font-bold text-stone-900 italic tracking-tight">Merci de votre confiance</h1>
                            <p className="text-stone-500 font-medium max-w-lg mx-auto leading-relaxed text-sm md:text-base">
                                Votre commande <span className="text-stone-900 font-bold underline decoration-stone-200">#{orderSuccess?.order_number || orderSuccess}</span> est en cours de préparation artisanale. Un conseiller vous contactera dans quelques minutes.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-12 no-print">
                            <button 
                                onClick={() => window.print()}
                                className="flex items-center justify-center gap-3 bg-stone-100 text-stone-900 px-6 py-5 rounded-2xl font-bold hover:bg-stone-200 transition-all border border-stone-200"
                            >
                                <span className="text-[10px] uppercase tracking-widest">Télécharger Reçu</span>
                            </button>
                            <Link 
                                href={`/track-order?order=${orderSuccess?.order_number || (typeof orderSuccess === 'string' ? orderSuccess : '')}`} 
                                className="flex items-center justify-center gap-3 bg-stone-900 text-white px-6 py-5 rounded-2xl font-bold hover:bg-stone-800 transition-all shadow-xl shadow-stone-900/10 group"
                            >
                                <span className="text-[10px] uppercase tracking-widest">Suivre Commande</span>
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/products" className="flex items-center justify-center gap-3 bg-stone-50 text-stone-600 px-6 py-5 rounded-2xl font-bold hover:bg-stone-100 transition-all">
                                <span className="text-[10px] uppercase tracking-widest">Continuer Achats</span>
                            </Link>
                        </div>

                        {/* Hidden Print-only Template */}
                        <div className="hidden print:block text-left p-10 space-y-8 bg-white text-stone-900">
                             <div className="flex justify-between items-center border-b pb-8">
                                <h1 className="text-4xl font-playfair font-bold italic">WOW TAPIS</h1>
                                <div className="text-right space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest">Reçu de Commande Officiel</p>
                                    <p className="text-sm font-bold">#{orderSuccess?.order_number || (typeof orderSuccess === 'string' ? orderSuccess : 'En attente')}</p>
                                </div>
                             </div>
                             <div className="grid grid-cols-2 gap-12 text-sm">
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Détails Client</p>
                                    <p className="font-bold">{formData.customer_name}<br/>{formData.customer_phone}<br/>{formData.customer_email}</p>
                                </div>
                                <div className="space-y-4 text-right">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Adresse de Livraison</p>
                                    <p className="font-bold">{formData.customer_city}<br/>{formData.customer_address}</p>
                                </div>
                             </div>
                             <table className="w-full text-sm border-t border-b border-stone-100 mt-8">
                                <thead>
                                    <tr className="text-[10px] font-black uppercase tracking-widest text-stone-400 border-b border-stone-50">
                                        <th className="py-4 text-left">Article</th>
                                        <th className="py-4 text-center">Quantité</th>
                                        <th className="py-4 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(orderSuccess?.items || []).map((item: any, i: number) => (
                                        <tr key={i} className="border-b border-stone-50/50">
                                            <td className="py-4 flex items-center gap-4">
                                                <div className="w-10 h-14 bg-stone-50 rounded overflow-hidden">
                                                    {item.product?.primary_image?.image_path && (
                                                        <img src={getImageUrl(item.product.primary_image.image_path)} className="w-full h-full object-cover" />
                                                    )}
                                                </div>
                                                <span className="font-bold">{item.product_name || item.product?.name}</span>
                                            </td>
                                            <td className="py-4 text-center font-bold">{item.quantity}</td>
                                            <td className="py-4 text-right font-bold">{parseFloat(item.subtotal || (item.price * item.quantity)).toLocaleString()} MAD</td>
                                        </tr>
                                    ))}
                                </tbody>
                             </table>
                             <div className="flex justify-end pt-8">
                                <div className="text-right space-y-2 p-6 bg-stone-50 rounded-2xl">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Montant Total Payé (TTC)</p>
                                    <p className="text-4xl font-playfair font-black">{parseFloat(orderSuccess?.total_amount || 0).toLocaleString()} MAD</p>
                                    <p className="text-[9px] italic text-stone-1000 bg-stone-900 text-white px-2 py-1 inline-block mt-2 rounded">Paiement à la livraison</p>
                                </div>
                             </div>
                             <div className="pt-20 text-center border-t border-stone-50 text-[10px] text-stone-400 uppercase tracking-widest leading-loose">
                                WOW TAPIS - Maison d&apos;Artisanat de Luxe<br/>
                                Merci de votre confiance. Contact: contact@waootapis.com
                             </div>
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

            <main className="flex-grow container mx-auto px-4 pt-44 pb-32">
                <div className="max-w-7xl mx-auto">
                    {/* Stepper Header */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-8">
                        <div className="flex items-center gap-6">
                            <Link href="/cart" className="w-12 h-12 rounded-full border border-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-900 hover:border-stone-900 transition-all">
                                <ChevronLeft size={20} />
                            </Link>
                            <h1 className="text-5xl lg:text-7xl font-playfair font-bold text-stone-900 tracking-tighter italic">Acquisition</h1>
                        </div>
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-3 opacity-30">
                                <span className="text-[10px] font-black uppercase tracking-widest">Sélection</span>
                            </div>
                            <ArrowRight size={14} className="text-stone-200" />
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px] font-bold">2</div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-stone-900 border-b-2 border-stone-900 pb-1">Livraison</span>
                            </div>
                            <ArrowRight size={14} className="text-stone-200" />
                            <div className="flex items-center gap-3 opacity-30">
                                <span className="text-[10px] font-black uppercase tracking-widest">Paiement</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24 items-start">
                        {/* Form Section */}
                        <div className="lg:col-span-7 space-y-12">
                            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-12">
                                {/* Identification Card */}
                                <div className="bg-white p-10 md:p-14 rounded-[2.5rem] shadow-[0_20px_60px_rgb(0,0,0,0.03)] border border-stone-100/60 space-y-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center text-stone-900">
                                            <User size={18} strokeWidth={2} />
                                        </div>
                                        <h3 className="text-xs uppercase tracking-[0.4em] font-black text-stone-900">Coordonnées personnelles</h3>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-black ml-1">Nom Complet</label>
                                            <input
                                                required
                                                type="text"
                                                name="customer_name"
                                                value={formData.customer_name}
                                                onChange={handleInputChange}
                                                placeholder="Votre nom complet"
                                                className="w-full bg-stone-50/50 rounded-2xl border border-stone-100 p-5 focus:bg-white focus:ring-4 focus:ring-stone-50 focus:border-stone-900 outline-none transition-all font-medium text-stone-900"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-black ml-1">Adresse Email</label>
                                            <input
                                                required
                                                type="email"
                                                name="customer_email"
                                                value={formData.customer_email}
                                                onChange={handleInputChange}
                                                placeholder="exemple@email.com"
                                                className="w-full bg-stone-50/50 rounded-2xl border border-stone-100 p-5 focus:bg-white focus:ring-4 focus:ring-stone-50 focus:border-stone-900 outline-none transition-all font-medium text-stone-900"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-black ml-1">Téléphone Mobile</label>
                                        <div className="relative group">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2 pr-4 border-r border-stone-200">
                                                <Phone size={14} className="text-stone-400" />
                                                <span className="text-xs font-bold text-stone-500">+212</span>
                                            </div>
                                            <input
                                                required
                                                type="tel"
                                                name="customer_phone"
                                                value={formData.customer_phone}
                                                onChange={handleInputChange}
                                                placeholder="6 XX XX XX XX"
                                                className="w-full bg-stone-50/50 rounded-2xl border border-stone-100 p-5 pl-28 focus:bg-white focus:ring-4 focus:ring-stone-50 focus:border-stone-900 outline-none transition-all font-medium text-stone-900"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Delivery Card */}
                                <div className="bg-white p-10 md:p-14 rounded-[2.5rem] shadow-[0_20px_60px_rgb(0,0,0,0.03)] border border-stone-100/60 space-y-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center text-stone-900">
                                            <MapPin size={18} strokeWidth={2} />
                                        </div>
                                        <h3 className="text-xs uppercase tracking-[0.4em] font-black text-stone-900">Adresse de livraison</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="md:col-span-2 space-y-3">
                                            <label className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-black ml-1">Adresse Détaillée</label>
                                            <textarea
                                                required
                                                name="customer_address"
                                                value={formData.customer_address}
                                                onChange={handleInputChange}
                                                rows={3}
                                                placeholder="N°, Rue, Quartier, Secteur..."
                                                className="w-full bg-stone-50/50 rounded-2xl border border-stone-100 p-5 focus:bg-white focus:ring-4 focus:ring-stone-50 focus:border-stone-900 outline-none transition-all font-medium text-stone-900 resize-none"
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-3">
                                            <label className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-black ml-1">Ville de Destination</label>
                                            <div className="relative">
                                                <select
                                                    name="customer_city"
                                                    value={formData.customer_city}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-stone-50/50 rounded-2xl border border-stone-100 p-5 focus:bg-white focus:ring-4 focus:ring-stone-50 focus:border-stone-900 outline-none transition-all font-medium text-stone-900 appearance-none cursor-pointer"
                                                >
                                                    {['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Agadir', 'Fès', 'Meknès', 'Oujda', 'Tétouan', 'Salé', 'Mohammedia', 'Autre'].map(city => (
                                                        <option key={city} value={city}>{city}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                                    <ArrowRight size={14} className="rotate-90" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-stone-50/50 rounded-[2rem] border border-dashed border-stone-200 flex flex-col md:flex-row items-center justify-between gap-8 group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-stone-100 flex items-center justify-center text-emerald-500 scale-100 group-hover:scale-110 transition-transform">
                                            <CreditCard size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-stone-900">Paiement à la livraison</h4>
                                            <p className="text-[10px] text-stone-500 font-medium mt-1">Vous ne payez qu&apos;après réception du tapis.</p>
                                        </div>
                                    </div>
                                    <button
                                        disabled={loading}
                                        type="submit"
                                        className="relative bg-stone-900 text-white px-12 py-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed group/btn overflow-hidden transition-all w-full md:w-auto"
                                    >
                                        {loading ? (
                                            <Loader2 size={20} className="animate-spin mx-auto" />
                                        ) : (
                                            <span className="flex items-center justify-center gap-4">
                                                Valider la commande
                                                <ArrowRight size={16} />
                                            </span>
                                        )}
                                        <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity" />
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Summary Section */}
                        <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-44">
                            <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.06)] border border-stone-100/60 space-y-10">
                                <div className="flex items-center justify-between border-b border-stone-50 pb-8">
                                    <h3 className="text-2xl font-playfair font-bold text-stone-900 italic">Ma Sélection</h3>
                                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{totalItems} Pièces</span>
                                </div>
                                
                                <div className="space-y-8 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex gap-6 group items-center">
                                            <div className="relative w-20 h-28 shrink-0">
                                                <img 
                                                    src={getImageUrl(item.image)} 
                                                    alt={item.name} 
                                                    className="w-full h-full object-cover rounded-2xl shadow-lg border border-stone-50" 
                                                />
                                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-stone-900 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-xl">
                                                    {item.quantity}
                                                </div>
                                            </div>
                                            <div className="flex-1 space-y-1.5">
                                                <h4 className="text-base font-playfair font-bold text-stone-900 leading-tight">{item.name}</h4>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-stone-400 italic">Authentic Artisanal Rug</p>
                                                {item.custom_dimensions && (
                                                    <span className="inline-block text-[9px] font-black text-stone-500 bg-stone-50 px-2 py-1 rounded-lg border border-stone-100">
                                                        {item.custom_dimensions.longueur}x{item.custom_dimensions.largeur} CM
                                                    </span>
                                                )}
                                                <div className="text-sm font-bold text-stone-900 pt-1">
                                                    {(item.price * item.quantity).toLocaleString()} MAD
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-8 border-t border-stone-50 space-y-5">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                                        <span>Prix des Articles</span>
                                        <span className="text-stone-900">{totalPrice.toLocaleString()} MAD</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                                        <span>Expédition Express</span>
                                        <span className="text-emerald-600 italic">Offerte</span>
                                    </div>
                                    <div className="flex justify-between items-end pt-6 mt-6 border-t border-dashed border-stone-100">
                                        <span className="text-xs font-black uppercase tracking-[0.4em] text-stone-900">Total</span>
                                        <div className="text-right">
                                            <p className="text-5xl font-playfair font-black text-stone-900 leading-none">{totalPrice.toLocaleString()} <span className="text-xs font-serif">MAD</span></p>
                                            <p className="text-[9px] text-stone-400 font-bold uppercase tracking-tighter mt-4 italic opacity-60">Estimation Frais & Taxes Inclus</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm flex flex-col items-center text-center gap-3">
                                    <Truck size={20} className="text-stone-400" />
                                    <p className="text-[9px] font-black uppercase tracking-widest text-stone-900">Livraison 48h</p>
                                </div>
                                <div className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm flex flex-col items-center text-center gap-3">
                                    <ShieldCheck size={20} className="text-stone-400" />
                                    <p className="text-[9px] font-black uppercase tracking-widest text-stone-900">Origine Certifiée</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E5E7EB;
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
}
