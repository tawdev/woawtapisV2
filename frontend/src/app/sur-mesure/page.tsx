'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Ruler, Palette, PenTool, Check, ArrowRight, MessageSquare, ShieldCheck, Truck, Sparkles, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { contactService } from '@/services/api';

const styles = [
  { id: 'beni', name: 'Beni Ouarain', price: 950, image: '/images/textures/beni.png', desc: 'Laine épaisse, motifs diamants' },
  { id: 'kilim', name: 'Kilim Classique', price: 650, image: '/images/textures/kilim.png', desc: 'Tissage plat, motifs berbères' },
  { id: 'vintage', name: 'Vintage Azilal', price: 1100, image: '/images/inspiration/vintage_azilal.png', desc: 'Artistique, couleurs vives' },
  { id: 'moderne', name: 'Contemporain', price: 1250, image: '/images/inspiration/dining_modern.png', desc: 'Minimaliste, tons unis' },
];

const colors = [
  { name: 'Crème', hex: '#FDFCFB' },
  { name: 'Ocre', hex: '#D2AC67' },
  { name: 'Brique', hex: '#A64B2A' },
  { name: 'Charbon', hex: '#2C2C2C' },
  { name: 'Bleu Nuit', hex: '#1E2B3C' },
  { name: 'Vert Forêt', hex: '#2D3A27' },
];

const steps = ['Style', 'Dimensions', 'Personnalisation', 'Finalisation'];

export default function SurMesurePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    style: styles[0],
    width: 200,
    length: 300,
    color: colors[0],
    notes: '',
    name: '',
    email: '',
    phone: '',
  });

  const [priceEstimate, setPriceEstimate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [honeypot, setHoneypot] = useState('');

  useEffect(() => {
    const area = (formData.width * formData.length) / 10000;
    setPriceEstimate(Math.round(area * formData.style.price));
  }, [formData.style, formData.width, formData.length]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Email Regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // Phone Regex (Maroc + International basic)
    const phoneRegex = /^(?:\+212|0)([5-7])\d{8}$|^(\+?\d{1,4}[- ]?)?\(?\d{1,4}?\)?[- ]?\d{1,4}[- ]?\d{1,4}$/;

    if (!formData.name.trim() || formData.name.length < 3) {
      newErrors.name = "Nom invalide (min. 3 caractères)";
    }
    
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Adresse e-mail non valide";
    }

    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = "Numéro de téléphone invalide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Antispam Honeypot
    if (honeypot) {
        console.warn("Spam detected");
        return;
    }

    if (!validateForm()) return;

    setLoading(true);
    try {
        const leadData = {
            subject: `PROJET SUR MESURE: ${formData.style.name}`,
            message: `Demande de tapis sur mesure.\nStyle: ${formData.style.name}\nDimensions: ${formData.width}x${formData.length} CM\nTeinte: ${formData.color.name}\nTotal estimé: ${priceEstimate} MAD\nNotes: ${formData.notes.substring(0, 1000)}`,
            name: formData.name.trim(),
            email: formData.email.trim().toLowerCase(),
            phone: formData.phone.trim()
        };

        await contactService.sendMessage(leadData);
        setIsSuccess(true);

        const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP || "212607790956";
        const msg = `Bonjour WOW TAPIS,\n\nJe souhaite initialiser un projet de tapis sur mesure (Inspiration: ${formData.style.name}).\n\n- Dimensions: ${formData.width}x${formData.length} cm\n- Couleur: ${formData.color.name}\n- Prix estimé: ${priceEstimate} MAD\n- Nom: ${formData.name}\n\nMerci de me recontacter pour finaliser.`;
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');

    } catch (err) {
        console.error("Submission error:", err);
        setErrors({ submit: "Une erreur est survenue lors de l'envoi. Veuillez réessayer." });
    } finally {
        setLoading(false);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1, 
        y: 0, 
        transition: { 
            duration: 0.8
        } 
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 overflow-x-hidden">
      <Header />

      <main className="pt-44 pb-24">
        <div className="container mx-auto px-4">
          
          <section className="text-center mb-24">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6">
              <span className="text-[10px] uppercase font-black tracking-[0.6em] text-primary block text-center">Atelier sur mesure</span>
              <h1 className="text-6xl md:text-8xl font-serif font-bold italic tracking-tighter text-center">Votre vision, notre artisanat</h1>
              <div className="h-1 w-24 bg-primary mx-auto" />
              <p className="max-w-2xl mx-auto text-stone-500 font-light text-xl leading-relaxed text-center">
                Créez une pièce unique qui raconte votre histoire. Sélectionnez chaque détail, des fibres de laine aux motifs ancestraux.
              </p>
            </motion.div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            <div className="lg:col-span-3 space-y-12 lg:sticky lg:top-44">
              <div className="space-y-8">
                {steps.map((step, i) => (
                  <div key={step} className={`flex items-center gap-6 transition-all duration-500 ${i <= currentStep ? 'opacity-100' : 'opacity-30 grayscale'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border ${i === currentStep ? 'bg-stone-900 text-white border-stone-900 scale-125 shadow-xl' : i < currentStep ? 'bg-primary text-white border-primary' : 'border-stone-200'}`}>
                      {i < currentStep ? <Check size={16} /> : i + 1}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-black tracking-widest text-[#1C1917]">
                        {step}
                        </span>
                        {i === currentStep && <span className="text-[8px] text-primary font-bold uppercase tracking-widest">En cours</span>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#1C1917] text-white p-8 rounded-[2.5rem] space-y-8 shadow-2xl relative overflow-hidden border border-white/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100%] -translate-y-4 translate-x-4" />
                <div className="relative z-10 space-y-6">
                  <h3 className="text-xl font-serif italic text-primary">Récapitulatif</h3>
                  <div className="space-y-5">
                    <div className="flex justify-between items-center group">
                      <span className="text-[9px] uppercase tracking-[0.3em] text-stone-500 font-bold">Style</span>
                      <span className="text-sm font-serif italic text-stone-200">{formData.style.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] uppercase tracking-[0.3em] text-stone-500 font-bold">Format</span>
                      <span className="text-sm font-bold text-white tracking-widest">{formData.width}x{formData.length} <span className="text-[8px] opacity-40">CM</span></span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] uppercase tracking-[0.3em] text-stone-500 font-bold">Teinte</span>
                      <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full ring-4 ring-white/5" style={{ background: formData.color.hex }} />
                          <span className="text-[10px] font-bold text-stone-300">{formData.color.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-8 border-t border-white/10 flex justify-between items-baseline">
                    <span className="text-[9px] uppercase font-black tracking-[0.4em] text-stone-400">Total estimé</span>
                    <div className="text-right">
                        <span className="text-4xl font-playfair font-black text-primary">{priceEstimate.toLocaleString()}</span>
                        <span className="text-[10px] font-bold ml-2 opacity-40">MAD</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-9 bg-white rounded-[3.5rem] p-8 md:p-16 border border-stone-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.04)] min-h-[600px] relative">
              <AnimatePresence mode="wait">
                {currentStep === 0 && (
                  <motion.div key="step-0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                    <div className="space-y-4">
                      <h2 className="text-4xl font-serif font-bold italic">Choisissez votre univers</h2>
                      <p className="text-stone-500 font-light">Le style définit la texture, l'épaisseur et l'âme de votre tapis.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {styles.map((style) => (
                        <button key={style.id} onClick={() => setFormData({ ...formData, style })} className={`group relative text-left rounded-3xl overflow-hidden border-2 transition-all duration-700 ${formData.style.id === style.id ? 'border-primary ring-8 ring-primary/5' : 'border-stone-50 hover:border-stone-200'}`}>
                          <div className="aspect-[16/9] overflow-hidden">
                            <img src={style.image} alt={style.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                          </div>
                          <div className="p-6">
                            <h3 className="text-xl font-bold font-serif italic mb-1">{style.name}</h3>
                            <p className="text-stone-400 text-[10px] font-light uppercase tracking-widest">{style.desc}</p>
                            <div className="mt-6 flex items-center justify-between">
                                <span className="text-[9px] px-4 py-2 bg-stone-50 rounded-full font-black uppercase tracking-widest text-[#1C1917]">Dès {style.price} MAD/m²</span>
                                {formData.style.id === style.id && <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white"><Check size={16} /></div>}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {currentStep === 1 && (
                  <motion.div key="step-1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-16">
                    <div className="space-y-4">
                      <h2 className="text-4xl font-serif font-bold italic">Précisez les mesures</h2>
                      <p className="text-stone-500 font-light">Nous créons des tapis de toutes tailles, du chemin de couloir au salon majestueux.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <label className="text-[10px] uppercase font-black tracking-widest text-stone-400 block px-2">Largeur (en cm)</label>
                        <div className="relative group">
                          <input type="number" value={formData.width} onChange={(e) => setFormData({...formData, width: parseInt(e.target.value) || 0})} className="w-full bg-stone-50 border-2 border-stone-100 p-8 rounded-3xl text-4xl font-serif font-bold focus:bg-white focus:border-stone-900 outline-none transition-all" />
                          <span className="absolute right-8 top-1/2 -translate-y-1/2 text-stone-300 font-bold">CM</span>
                        </div>
                        <input type="range" min="50" max="500" step="10" value={formData.width} onChange={(e) => setFormData({...formData, width: parseInt(e.target.value)})} className="w-full h-1 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-stone-900" />
                      </div>
                      <div className="space-y-6">
                        <label className="text-[10px] uppercase font-black tracking-widest text-stone-400 block px-2">Longueur (en cm)</label>
                        <div className="relative group">
                          <input type="number" value={formData.length} onChange={(e) => setFormData({...formData, length: parseInt(e.target.value) || 0})} className="w-full bg-stone-50 border-2 border-stone-100 p-8 rounded-3xl text-4xl font-serif font-bold focus:bg-white focus:border-stone-900 outline-none transition-all" />
                          <span className="absolute right-8 top-1/2 -translate-y-1/2 text-stone-300 font-bold">CM</span>
                        </div>
                        <input type="range" min="50" max="800" step="10" value={formData.length} onChange={(e) => setFormData({...formData, length: parseInt(e.target.value)})} className="w-full h-1 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-stone-900" />
                      </div>
                    </div>
                    <div className="p-10 bg-stone-50 rounded-[2.5rem] border border-stone-100 flex items-start gap-8 shadow-sm">
                      <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary shrink-0"><Ruler size={24} /></div>
                      <p className="text-sm font-medium text-stone-500 leading-relaxed italic">"Pour un salon, prévoyez un dépassement de 20 à 30 cm de chaque côté de votre canapé pour un rendu harmonieux."</p>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div key="step-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-16">
                    <div className="space-y-4">
                      <h2 className="text-4xl font-serif font-bold italic">Palette Chromatique</h2>
                      <p className="text-stone-500 font-light">La couleur de base définit l'atmosphère de votre pièce.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {colors.map((color) => (
                        <button key={color.name} onClick={() => setFormData({ ...formData, color })} className={`flex flex-col items-center p-10 rounded-[2.5rem] border-2 transition-all duration-700 ${formData.color.name === color.name ? 'border-primary bg-primary/5 shadow-2xl' : 'border-stone-50 hover:border-stone-100'}`}>
                          <div className="w-24 h-24 rounded-full shadow-2xl mb-8 relative overflow-hidden border-4 border-white" style={{ background: color.hex }}><div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-white/10" /></div>
                          <span className="text-[10px] uppercase font-black tracking-[0.3em] text-[#1C1917]">{color.name}</span>
                          {formData.color.name === color.name && <Check size={18} className="text-primary mt-4" />}
                        </button>
                      ))}
                    </div>
                    <div className="space-y-6">
                      <label className="text-[10px] uppercase font-black tracking-widest text-stone-400 block px-2">Observations Particulières</label>
                      <textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} placeholder="Précisez un motif particulier, une exigence de texture ou une demande spécifique..." className="w-full bg-stone-50 border-2 border-stone-100 p-10 rounded-[2.5rem] text-sm font-light min-h-[180px] focus:bg-white focus:border-stone-900 outline-none transition-all placeholder:text-stone-300" />
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div key="step-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12 max-w-2xl mx-auto">
                    {isSuccess ? (
                        <div className="text-center py-20 space-y-10 animate-in fade-in zoom-in duration-700">
                             <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto text-primary shadow-2xl">
                                <Check size={48} strokeWidth={1.5} />
                             </div>
                             <div className="space-y-6">
                                <h2 className="text-4xl font-serif font-bold italic">Projet Initialisé</h2>
                                <p className="text-stone-500 font-light leading-relaxed max-w-md mx-auto">Votre demande a été transmise à notre atelier. Un conseiller expert en décoration vous recontactera sous 24h.</p>
                             </div>
                             <button onClick={() => window.location.href = '/'} className="px-12 py-5 bg-[#1C1917] text-white text-[10px] uppercase font-black tracking-widest rounded-full hover:bg-stone-800 transition-all">Retour à l'accueil</button>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-6 text-center">
                            <h2 className="text-4xl md:text-5xl font-serif font-bold italic tracking-tight">Validation de la demande</h2>
                            <p className="text-stone-500 font-light leading-relaxed">Un conseiller en design d&apos;intérieur prendra contact avec vous sous 24h pour affiner votre projet.</p>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-6 relative">
                            <div className="absolute -inset-4 bg-stone-50/50 rounded-[3rem] -z-10" />
                            
                            {/* Honeypot field - Keep it invisible */}
                            <div className="hidden" aria-hidden="true">
                                <input type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <input 
                                        type="text" 
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        placeholder="Prénom & NOM" 
                                        className={`w-full bg-white border ${errors.name ? 'border-red-500 ring-2 ring-red-500/10' : 'border-stone-100'} p-6 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-primary/5 focus:border-stone-900 outline-none transition-all`} 
                                    />
                                    {errors.name && <p className="text-[10px] text-red-500 font-bold ml-2 italic tracking-tight">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <input 
                                        type="email" 
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        placeholder="Adresse E-mail" 
                                        className={`w-full bg-white border ${errors.email ? 'border-red-500 ring-2 ring-red-500/10' : 'border-stone-100'} p-6 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-primary/5 focus:border-stone-900 outline-none transition-all`} 
                                    />
                                    {errors.email && <p className="text-[10px] text-red-500 font-bold ml-2 italic tracking-tight">{errors.email}</p>}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <input 
                                    type="tel" 
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    placeholder="Numéro de téléphone (Ex : 0612345678)" 
                                    className={`w-full bg-white border ${errors.phone ? 'border-red-500 ring-2 ring-red-500/10' : 'border-stone-100'} p-6 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-primary/5 focus:border-stone-900 outline-none transition-all`} 
                                />
                                {errors.phone && <p className="text-[10px] text-red-500 font-bold ml-2 italic tracking-tight">{errors.phone}</p>}
                            </div>

                            {errors.submit && <p className="p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] uppercase font-black tracking-widest text-center rounded-xl">{errors.submit}</p>}
                            <button 
                                disabled={loading}
                                className="w-full bg-[#1C1917] text-white p-7 rounded-[1.5rem] font-black uppercase tracking-[0.4em] text-[10px] flex items-center justify-between hover:bg-stone-800 hover:-translate-y-1 transition-all shadow-2xl group cursor-pointer mt-8 relative overflow-hidden"
                            >
                                <span className="ml-6 tracking-[0.5em] relative z-10">{loading ? 'Transmission en cours...' : 'Initialiser le Projet'}</span>
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-primary transition-all relative z-10">
                                    {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                                </div>
                                <div className="absolute inset-0 bg-primary/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                            </button>
                            </form>
                            <div className="flex flex-wrap justify-center gap-10 pt-10 opacity-40 grayscale text-stone-400">
                                <div className="flex items-center gap-3"><ShieldCheck size={16} /><span className="text-[9px] uppercase font-black tracking-widest font-sans">Satisfaction Garantie</span></div>
                                <div className="flex items-center gap-3"><Truck size={16} /><span className="text-[9px] uppercase font-black tracking-widest font-sans">Livraison Privée</span></div>
                                <div className="flex items-center gap-3"><Sparkles size={16} /><span className="text-[9px] uppercase font-black tracking-widest font-sans">Artisanat Certifié</span></div>
                            </div>
                        </>
                    )}
                  </motion.div>
                )}

              </AnimatePresence>

              <div className="mt-20 pt-12 border-t border-stone-50 flex justify-between items-center">
                <button onClick={handlePrev} disabled={currentStep === 0} className="flex items-center gap-4 text-stone-400 hover:text-stone-900 transition-all disabled:opacity-0 disabled:pointer-events-none">
                  <div className="w-12 h-12 rounded-full border border-stone-100 flex items-center justify-center"><ChevronLeft size={20} /></div>
                  <span className="text-[10px] uppercase font-black tracking-widest">Étape précédente</span>
                </button>
                {currentStep < steps.length - 1 && (
                  <button onClick={handleNext} className="flex items-center gap-4 text-stone-900 group">
                    <span className="text-[10px] uppercase font-black tracking-widest">Étape suivante</span>
                    <div className="w-12 h-12 rounded-full bg-stone-900 text-white flex items-center justify-center group-hover:bg-primary transition-all duration-500"><ChevronRight size={20} /></div>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      <section className="bg-stone-50 py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-12">
            <div className="w-16 h-16 bg-white border border-stone-100 rounded-full flex items-center justify-center mx-auto shadow-sm"><MessageSquare size={24} className="text-primary" /></div>
            <div className="space-y-6">
                <h3 className="text-4xl font-serif font-bold italic tracking-tight text-center">Besoin de conseils d&apos;experts ?</h3>
                <p className="text-stone-500 font-light leading-relaxed text-center">Vous avez un échantillon de tissu ou une photo d&apos;inspiration ? Nos experts vous aident à recréer le tapis parfait en accord avec votre décoration actuelle.</p>
            </div>
            <div className="pt-6 text-center">
                <a href="https://wa.me/212524308038" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-6 border-b-2 border-stone-900 pb-2 font-black uppercase text-xs tracking-[0.4em] hover:text-primary hover:border-primary transition-all group">
                    Discuter via WhatsApp
                    <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
