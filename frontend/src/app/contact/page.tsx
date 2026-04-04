'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { MapPin, Phone, Mail, Send, Loader2, CheckCircle2, Plus, Minus } from 'lucide-react';
import { contactService } from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const faqs = [
        { q: "Quels sont vos délais de livraison ?", a: "Nous livrons partout au Maroc en 48/72h. Pour l'international, comptez entre 5 et 10 jours ouvrés selon la destination." },
        { q: "Faites-vous des tapis sur-mesure ?", a: "Absolument. Nos artisans peuvent tisser le tapis de vos rêves selon vos motifs, dimensions et couleurs. Le délai moyen est de 4 à 8 semaines." },
        { q: "Acceptez-vous les retours ?", a: "Oui, vous disposez d'un délai de 14 jours après réception pour retourner ou échanger votre tapis s'il ne convient pas parfaitement à votre intérieur." }
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Send to database
            await contactService.sendMessage(formData);

            // 2. Format WhatsApp Message
            const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP ? process.env.NEXT_PUBLIC_WHATSAPP.replace('+', '') : "212607790956";
            const text = `Bonjour TAW 10,\n\nNouveau message de contact :\n\n*Nom:* ${formData.name}\n*Email:* ${formData.email}\n*Sujet:* ${formData.subject}\n*Message:* ${formData.message}`;
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

            // 3. Success State
            setSuccess(true);
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });

            // 4. Redirect to WhatsApp
            window.open(whatsappUrl, '_blank');
        } catch (error) {
            console.error("Failed to send message:", error);
            alert("Une erreur est survenue. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50">
            <Header />

            {/* Hero Section */}
            <section className="bg-stone-900 py-32 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-stone-900/60 z-10" />
                <img 
                    src="/images/hero-carpet.jpg" 
                    className="absolute inset-0 w-full h-full object-cover opacity-30 scale-110 animate-slow-zoom" 
                    alt="Luxury Carpet Craftsmanship"
                />
                <div className="container mx-auto px-4 relative z-20 text-center space-y-8">
                    <h2 className="text-primary uppercase tracking-[0.5em] text-[10px] font-bold animate-in fade-in slide-in-from-bottom-4 duration-700">Artisanat & Excellence</h2>
                    <h1 className="text-5xl md:text-8xl font-serif font-bold italic tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000">Contactez-nous</h1>
                    <div className="h-1 w-24 bg-primary mx-auto animate-in fade-in zoom-in duration-1000 delay-300" />
                </div>
            </section>

            <main className="container mx-auto px-4 py-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
                    {/* Contact Info & Story */}
                    <div className="space-y-20">
                        <div className="space-y-10">
                            <div className="inline-block px-4 py-2 bg-stone-100 rounded-px border-l-2 border-primary">
                                <span className="text-[10px] uppercase tracking-widest font-black text-stone-900">Une écoute sur mesure</span>
                            </div>
                            <h2 className="text-5xl font-serif font-bold text-stone-900 italic leading-tight">L&apos;art de vous accompagner</h2>
                            <p className="text-stone-500 text-lg leading-relaxed font-light max-w-xl">
                                Que vous soyez à la recherche d&apos;une pièce unique ou que vous souhaitiez réaliser un tapis sur mesure, 
                                notre équipe d&apos;experts est à votre entière disposition pour donner vie à vos projets les plus prestigieux.
                            </p>
                        </div>

                        <div className="space-y-10">
                            <div className="flex gap-10 group">
                                <div className="w-20 h-20 bg-white border border-stone-100 flex items-center justify-center shadow-2xl shadow-stone-200/50 text-stone-900 shrink-0 transition-all duration-700 group-hover:bg-primary group-hover:text-white group-hover:-translate-y-2">
                                    <MapPin size={28} strokeWidth={1} />
                                </div>
                                <div className="space-y-2 pt-2">
                                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-stone-400">Siège de Création</h4>
                                    <p className="text-stone-900 font-serif font-bold text-lg italic">Quartier Industriel, Marrakech, Maroc</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-10 group">
                                <div className="w-20 h-20 bg-white border border-stone-100 flex items-center justify-center shadow-2xl shadow-stone-200/50 text-stone-900 shrink-0 transition-all duration-700 group-hover:bg-primary group-hover:text-white group-hover:-translate-y-2">
                                    <Phone size={28} strokeWidth={1} />
                                </div>
                                <div className="space-y-2 pt-2">
                                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-stone-400">Conciergerie Téléphonique</h4>
                                    <p className="text-stone-900 font-serif font-bold text-lg italic">++212 524308038
</p>
                                </div>
                            </div>

                            <div className="flex gap-10 group">
                                <div className="w-20 h-20 bg-white border border-stone-100 flex items-center justify-center shadow-2xl shadow-stone-200/50 text-stone-900 shrink-0 transition-all duration-700 group-hover:bg-primary group-hover:text-white group-hover:-translate-y-2">
                                    <Mail size={28} strokeWidth={1} />
                                </div>
                                <div className="space-y-2 pt-2">
                                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-stone-400">Courriel de Prestige</h4>
                                    <p className="text-stone-900 font-serif font-bold text-lg italic">contact@waootapis.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-10">
                            <div className="p-8 bg-stone-900 text-white space-y-4 rounded-sm shadow-2xl shadow-stone-900/20 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-700 group-hover:scale-150" />
                                <h4 className="text-xs uppercase tracking-[0.3em] font-bold text-primary">Horaires d&apos;Exception</h4>
                                <div className="flex justify-between items-center text-sm font-light">
                                    <span>Lundi — Vendredi</span>
                                    <span className="font-serif italic text-primary">09:00 — 19:00</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-light">
                                    <span>Samedi</span>
                                    <span className="font-serif italic text-primary">10:00 — 17:00</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form Container & FAQ */}
                    <div className="space-y-12 relative w-full">
                        <div className="absolute -inset-4 bg-primary/5 rounded-sm blur-2xl -z-10" />
                        <div className="bg-white p-10 md:p-16 rounded-sm shadow-2xl shadow-stone-900/5 border border-stone-100 relative">
                            {success ? (
                                <div className="text-center py-20 space-y-8 animate-in fade-in zoom-in duration-700">
                                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 shadow-inner">
                                        <CheckCircle2 size={40} strokeWidth={1.5} />
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-3xl font-serif font-bold text-stone-900 italic">Message Reçu</h3>
                                        <p className="text-stone-500 font-light max-w-xs mx-auto">
                                            Merci de nous avoir contactés. Un conseiller de notre maison vous répondra sous 24 heures.
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => setSuccess(false)}
                                        className="text-[10px] uppercase tracking-widest font-black text-primary hover:text-stone-900 transition-colors"
                                    >
                                        Envoyer un autre message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-10">
                                    <div className="space-y-12">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-3">
                                                <label className="text-[10px] uppercase tracking-widest font-black text-stone-400">Nom & Prénom</label>
                                                <input 
                                                    required
                                                    type="text" 
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-stone-50/50 border-b border-stone-100 p-4 focus:border-stone-900 outline-none transition-all font-serif italic text-lg text-stone-900" 
                                                    placeholder="Votre nom" 
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] uppercase tracking-widest font-black text-stone-400">E-mail</label>
                                                <input 
                                                    required
                                                    type="email" 
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-stone-50/50 border-b border-stone-100 p-4 focus:border-stone-900 outline-none transition-all font-serif italic text-lg text-stone-900" 
                                                    placeholder="votre@email.com" 
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-3">
                                                <label className="text-[10px] uppercase tracking-widest font-black text-stone-400">Téléphone (Optionnel)</label>
                                                <input 
                                                    type="tel" 
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-stone-50/50 border-b border-stone-100 p-4 focus:border-stone-900 outline-none transition-all font-serif italic text-lg text-stone-900" 
                                                    placeholder="+212 6..." 
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] uppercase tracking-widest font-black text-stone-400">Sujet</label>
                                                <input 
                                                    required
                                                    type="text" 
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-stone-50/50 border-b border-stone-100 p-4 focus:border-stone-900 outline-none transition-all font-serif italic text-lg text-stone-900" 
                                                    placeholder="L'objet de votre demande" 
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] uppercase tracking-widest font-black text-stone-400">Votre Message</label>
                                            <textarea 
                                                required
                                                rows={5} 
                                                name="message"
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                className="w-full bg-stone-50/50 border-b border-stone-100 p-4 focus:border-stone-900 outline-none transition-all font-serif italic text-lg text-stone-900" 
                                                placeholder="Partagez votre vision avec nous..."
                                            ></textarea>
                                        </div>
                                    </div>

                                    <button 
                                        disabled={loading}
                                        type="submit"
                                        className="btn-premium w-full py-6 flex items-center justify-center gap-4 group disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : (
                                            <>
                                                Transmettre ma demande
                                                <Send size={16} className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* FAQ Section */}
                        <div className="bg-white p-10 md:p-12 rounded-sm shadow-xl shadow-stone-900/5 border border-stone-100 mt-12">
                            <h3 className="text-2xl font-serif font-bold text-stone-900 italic mb-8">Questions Fréquentes</h3>
                            <div className="space-y-4">
                                {faqs.map((faq, idx) => (
                                    <div key={idx} className="border-b border-stone-100 pb-4">
                                        <button 
                                            onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                                            className="flex justify-between items-center w-full text-left py-2 group"
                                        >
                                            <span className="font-bold text-stone-900 group-hover:text-primary transition-colors">{faq.q}</span>
                                            {activeFaq === idx ? (
                                                <Minus size={18} className="text-primary shrink-0" />
                                            ) : (
                                                <Plus size={18} className="text-stone-400 shrink-0 group-hover:text-primary" />
                                            )}
                                        </button>
                                        <AnimatePresence>
                                            {activeFaq === idx && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <p className="pt-4 text-stone-500 font-light text-sm leading-relaxed">{faq.a}</p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Google Maps Section */}
            <section className="h-[500px] w-full relative grayscale hover:grayscale-0 transition-all duration-1000">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108703.11187425119!2d-8.082711663008064!3d31.634602330833215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafee8d96179e51%3A0x5950b6534f87adb8!2sMarrakech!5e0!3m2!1sfr!2sma!4v1714488888888!5m2!1sfr!2sma" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.1)]" />
            </section>

            <Footer />
        </div>
    );
}
