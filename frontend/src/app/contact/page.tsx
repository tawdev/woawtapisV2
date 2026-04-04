'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { MapPin, Phone, Mail, Send, Loader2, CheckCircle2, Plus, Minus, ArrowRight } from 'lucide-react';
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
            await contactService.sendMessage(formData);
            const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP ? process.env.NEXT_PUBLIC_WHATSAPP.replace('+', '') : "212607790956";
            const text = `Bonjour TAW 10,\n\nNouveau message de contact :\n\n*Nom:* ${formData.name}\n*Email:* ${formData.email}\n*Sujet:* ${formData.subject}\n*Message:* ${formData.message}`;
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
            setSuccess(true);
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            window.open(whatsappUrl, '_blank');
        } catch (error) {
            console.error("Failed to send message:", error);
            alert("Une erreur est survenue. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
    };

    return (
        <div className="min-h-screen bg-[#FDFCFB]">
            <Header transparent />

            {/* Hero Section */}
            <section className="bg-[#1C1917] py-44 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-stone-900/40 z-10" />
                <img 
                    src="/images/hero-carpet.jpg" 
                    className="absolute inset-0 w-full h-full object-cover opacity-20 scale-105 animate-slow-zoom" 
                    alt="Luxury Carpet Craftsmanship"
                />
                <div className="container mx-auto px-4 relative z-20 text-center space-y-10">
                    <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6">
                        <span className="text-primary uppercase tracking-[0.6em] text-[10px] font-black">L&apos;excellence à votre écoute</span>
                        <h1 className="text-6xl md:text-8xl font-serif font-bold italic tracking-tighter">Votre vision, notre passion</h1>
                        <div className="h-1.5 w-24 bg-primary mx-auto" />
                    </motion.div>
                </div>
            </section>

            <main className="container mx-auto px-4 py-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
                    
                    {/* Contact Info & Story */}
                    <div className="lg:col-span-12 xl:col-span-5 space-y-20">
                        <div className="space-y-12">
                            <h2 className="text-5xl md:text-6xl font-serif font-bold text-stone-900 italic leading-[1.1]">L&apos;art de vous accompagner</h2>
                            <p className="text-stone-500 text-xl leading-relaxed font-light max-w-xl">
                                Que vous soyez à la recherche d&apos;une pièce unique ou que vous souhaitiez réaliser un tapis sur mesure, 
                                notre maison d&apos;artisanat est à votre entière disposition.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-12">
                            <div className="flex gap-10 group">
                                <div className="w-16 h-16 bg-white border border-stone-100 flex items-center justify-center shadow-xl text-stone-900 shrink-0 transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:-translate-y-1 rounded-2xl">
                                    <MapPin size={24} strokeWidth={1.5} />
                                </div>
                                <div className="space-y-2 pt-2">
                                    <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-stone-400">Siège Social</h4>
                                    <p className="text-stone-900 font-serif font-bold text-lg italic">Quartier Industriel, Marrakech</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-10 group">
                                <div className="w-16 h-16 bg-white border border-stone-100 flex items-center justify-center shadow-xl text-stone-900 shrink-0 transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:-translate-y-1 rounded-2xl">
                                    <Phone size={24} strokeWidth={1.5} />
                                </div>
                                <div className="space-y-2 pt-2">
                                    <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-stone-400">Conciergerie</h4>
                                    <p className="text-stone-900 font-serif font-bold text-lg italic">+212 524 308 038</p>
                                </div>
                            </div>

                            <div className="flex gap-10 group">
                                <div className="w-16 h-16 bg-white border border-stone-100 flex items-center justify-center shadow-xl text-stone-900 shrink-0 transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:-translate-y-1 rounded-2xl">
                                    <Mail size={24} strokeWidth={1.5} />
                                </div>
                                <div className="space-y-2 pt-2">
                                    <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-stone-400">Relations Clients</h4>
                                    <p className="text-stone-900 font-serif font-bold text-lg italic">contact@waootapis.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 bg-[#1C1917] text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden group border border-white/5">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-bl-[100%] transition-all duration-1000 group-hover:scale-150 -translate-y-8 translate-x-8" />
                            <h4 className="text-xs uppercase tracking-[0.4em] font-black text-primary mb-8 ml-2">Horaires d&apos;Exception</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm font-light border-b border-white/10 pb-4">
                                    <span className="uppercase tracking-widest text-[10px] opacity-60">Lundi — Vendredi</span>
                                    <span className="font-serif italic text-primary text-lg">09:00 — 19:00</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-light py-2">
                                    <span className="uppercase tracking-widest text-[10px] opacity-60">Samedi</span>
                                    <span className="font-serif italic text-primary text-lg">10:00 — 17:00</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form Container & FAQ */}
                    <div className="lg:col-span-12 xl:col-span-7 space-y-12">
                        <div className="bg-white p-10 md:p-20 rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.04)] border border-stone-100 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-primary/20" />
                            
                            {success ? (
                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 space-y-10">
                                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary shadow-inner">
                                        <CheckCircle2 size={40} strokeWidth={1.5} />
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-4xl font-serif font-bold text-stone-900 italic">Message Transmis</h3>
                                        <p className="text-stone-500 font-light text-lg max-w-xs mx-auto">
                                            Merci de votre confiance. Notre maison vous répondra sous 24 heures.
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => setSuccess(false)}
                                        className="text-[10px] uppercase tracking-[0.4em] font-black text-primary hover:text-stone-900 transition-colors border-b-2 border-primary pb-1"
                                    >
                                        Envoyer une autre demande
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-12">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-stone-400 ml-4">Votre Identité</label>
                                            <input 
                                                required type="text" name="name" value={formData.name} onChange={handleInputChange}
                                                className="w-full bg-stone-50 border-2 border-stone-50 p-6 rounded-2xl focus:bg-white focus:border-stone-900 outline-none transition-all font-serif italic text-lg shadow-sm" 
                                                placeholder="Prénom & NOM" 
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-stone-400 ml-4">Coordonnées</label>
                                            <input 
                                                required type="email" name="email" value={formData.email} onChange={handleInputChange}
                                                className="w-full bg-stone-50 border-2 border-stone-50 p-6 rounded-2xl focus:bg-white focus:border-stone-900 outline-none transition-all font-serif italic text-lg shadow-sm" 
                                                placeholder="votre@email.com" 
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] uppercase tracking-[0.3em] font-black text-stone-400 ml-4">L&apos;objet de votre échange</label>
                                        <input 
                                            required type="text" name="subject" value={formData.subject} onChange={handleInputChange}
                                            className="w-full bg-stone-50 border-2 border-stone-50 p-6 rounded-2xl focus:bg-white focus:border-stone-900 outline-none transition-all font-serif italic text-lg shadow-sm" 
                                            placeholder="Comment pouvons-nous vous aider ?" 
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] uppercase tracking-[0.3em] font-black text-stone-400 ml-4">Votre Message</label>
                                        <textarea 
                                            required rows={6} name="message" value={formData.message} onChange={handleInputChange}
                                            className="w-full bg-stone-50 border-2 border-stone-50 p-8 rounded-3xl focus:bg-white focus:border-stone-900 outline-none transition-all font-serif italic text-xl shadow-sm resize-none" 
                                            placeholder="Détaillez votre projet..."
                                        />
                                    </div>

                                    <button 
                                        disabled={loading}
                                        type="submit"
                                        className="w-full bg-[#1C1917] text-white py-8 rounded-2xl font-black uppercase tracking-[0.5em] text-[10px] flex items-center justify-center gap-6 group hover:bg-stone-800 transition-all shadow-2xl relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-primary/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                                        <span className="relative z-10">
                                            {loading ? 'Traitement en cours...' : 'Transmettre à la Maison'}
                                        </span>
                                        {!loading && <ArrowRight size={18} className="relative z-10 group-hover:translate-x-2 transition-transform" />}
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* FAQ Section */}
                        <div className="bg-white p-10 md:p-16 rounded-[2.5rem] border border-stone-100 shadow-sm mt-12">
                            <h3 className="text-3xl font-serif font-bold text-stone-900 italic mb-10 text-center">Questions Fréquentes</h3>
                            <div className="space-y-6">
                                {faqs.map((faq, idx) => (
                                    <div key={idx} className="border-b border-stone-50 pb-6">
                                        <button 
                                            onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                                            className="flex justify-between items-center w-full text-left py-2 group"
                                        >
                                            <span className="font-bold text-stone-900 text-lg group-hover:text-primary transition-colors pr-8 leading-snug">{faq.q}</span>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${activeFaq === idx ? 'bg-primary text-white' : 'bg-stone-50 text-stone-400 group-hover:bg-stone-100'}`}>
                                                {activeFaq === idx ? <Minus size={16} /> : <Plus size={16} />}
                                            </div>
                                        </button>
                                        <AnimatePresence>
                                            {activeFaq === idx && (
                                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                                    <p className="pt-6 text-stone-500 font-light text-lg leading-relaxed italic">{faq.a}</p>
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
            <section className="h-[600px] w-full relative grayscale hover:grayscale-0 transition-all duration-1000 border-y border-stone-100">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108703.11187425119!2d-8.082711663008064!3d31.634602330833215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafee8d96179e51%3A0x5950b6534f87adb8!2sMarrakech!5e0!3m2!1sfr!2sma!4v1714488888888!5m2!1sfr!2sma" 
                    width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.05)]" />
            </section>

            <Footer />
        </div>
    );
}
