'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Hero from '@/components/layout/Hero';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import Image from 'next/image';
import { productService, contactService } from '@/services/api';

import { Truck, Wrench, Gem, Send, Loader2, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Contact Form State
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    async function loadData() {
      try {
        const data = await productService.getFeatured();
        setFeaturedProducts(data);
      } catch (error) {
        console.error("Failed to load featured products:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactLoading(true);
    try {
      // 1. Send to database (optional but recommended for tracking)
      await contactService.sendMessage(formData);
      
      // 2. Format WhatsApp Message
      const whatsappNumber = "212607790956"; // Clean number without +
      const text = `Bonjour TAW 10,\n\nNouveau message de contact :\n\n*Nom:* ${formData.name}\n*Email:* ${formData.email}\n*Sujet:* ${formData.subject}\n*Message:* ${formData.message}`;
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
      
      // 3. Success State
      setContactSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      
      // 4. Redirect to WhatsApp
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <>
      <Header transparent />

      <main>
        <Hero />
         {/* À Propos Section */}
        <section className="py-32 bg-white overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div className="relative group">
                <div className="absolute -inset-4 bg-primary/5 rounded-sm blur-2xl group-hover:bg-primary/10 transition-colors duration-1000" />
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm shadow-2xl">
                  <Image 
                    src="/images/hero-carpet.jpg" 
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                    alt="Artisanat TAW 10"
                  />
                  <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-stone-900/0 transition-colors duration-700" />
                </div>
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-stone-50 border border-stone-100 p-8 shadow-2xl hidden md:flex flex-col justify-center space-y-4">
                  <p className="text-primary font-serif italic text-2xl">L&apos;excellence du geste</p>
                  <p className="text-stone-400 text-[10px] uppercase tracking-widest font-black leading-tight">Chaque pièce est une œuvre unique, façonnée à la main.</p>
                </div>
              </div>
              
              <div className="space-y-12">
                <div className="space-y-6">
                  <h2 className="text-primary uppercase tracking-[0.3em] text-[10px] font-bold">Notre Maison</h2>
                  <p className="text-5xl md:text-6xl font-serif font-bold italic leading-tight">Plus qu&apos;un Tapis, <br />un Héritage.</p>
                </div>
                
                <div className="space-y-8 text-lg font-light text-stone-500 leading-relaxed">
                  <p>
                    Chez <span className="text-stone-900 font-serif italic font-bold">waootapis</span>, nous perpétuons l&apos;art ancestral du tissage berbère. 
                    En collaboration directe avec les tisseuses du Moyen Atlas, nous créons des pièces qui allient tradition millénaire et design contemporain.
                  </p>
                  <p>
                    Chaque nœud, chaque motif est le témoin d&apos;une histoire, d&apos;une émotion, d&apos;un savoir-faire qui se transmet de génération en génération.
                  </p>
                </div>

                <div className="pt-8">
                  <a href="/a-propos" className="btn-premium px-12 py-5 inline-block">
                    Découvrir notre histoire
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Featured Products Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div className="space-y-4">
                <h2 className="text-primary uppercase tracking-[0.2em] text-sm font-bold">Sélection Premium</h2>
                <h3 className="text-4xl md:text-5xl font-serif font-bold">Nos Pièces Maîtresses</h3>
              </div>
              <a href="/products" className="text-stone-800 font-bold border-b-2 border-stone-800 pb-2 hover:text-primary hover:border-primary transition-all min-h-[44px] flex items-center">
                Voir tout le catalogue
              </a>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-pulse">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="aspect-square bg-stone-100 rounded-sm" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredProducts.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>


       

        {/* Contact Section */}
        <section className="py-32 bg-stone-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div className="space-y-12">
                <div className="space-y-6">
                  <h2 className="text-primary uppercase tracking-[0.4em] text-[10px] font-bold">Conciergerie</h2>
                  <h3 className="text-5xl md:text-6xl font-serif font-bold italic leading-tight">Un projet d&apos;exception ?</h3>
                  <div className="h-1 w-20 bg-primary" />
                </div>
                
                <p className="text-stone-400 text-xl font-light leading-relaxed max-w-lg">
                  Nos conseillers sont à votre entière disposition pour vous accompagner dans la création de votre pièce sur mesure ou pour toute demande d&apos;information.
                </p>

                <div className="space-y-8 pt-6">
                  <div className="flex gap-6 items-center group">
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                      <Send size={18} className="text-primary group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-stone-500 font-black">Email</p>
                      <p className="text-lg font-serif italic">contact@waootapis.com</p>
                    </div>
                  </div>
                  <div className="flex gap-6 items-center group">
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                      <CheckCircle2 size={18} className="text-primary group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-stone-500 font-black">Téléphone</p>
                      <p className="text-lg font-serif italic">+212 5 24 30 80 38</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Container */}
              <div className="bg-white/5 backdrop-blur-sm p-8 md:p-12 rounded-sm border border-white/10 shadow-2xl">
                {contactSuccess ? (
                  <div className="text-center py-16 space-y-8 animate-in fade-in zoom-in duration-700">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto text-primary">
                      <CheckCircle2 size={40} strokeWidth={1.5} />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-3xl font-serif font-bold italic">Message Transmis</h3>
                      <p className="text-stone-400 font-light max-w-xs mx-auto">
                        Merci de votre confiance. Notre maison vous répondra avec le plus grand soin sous 24h.
                      </p>
                    </div>
                    <button 
                      onClick={() => setContactSuccess(false)}
                      className="text-[10px] uppercase tracking-widest font-black text-primary hover:text-white transition-colors"
                    >
                      Envoyer un autre message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-black text-stone-500">Nom</label>
                        <input 
                          required
                          type="text" 
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full bg-transparent border-b border-white/10 py-3 outline-none focus:border-primary transition-all font-serif italic text-lg" 
                          placeholder="Votre nom" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-black text-stone-500">E-mail</label>
                        <input 
                          required
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full bg-transparent border-b border-white/10 py-3 outline-none focus:border-primary transition-all font-serif italic text-lg" 
                          placeholder="votre@email.com" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-black text-stone-500">Sujet</label>
                      <input 
                        required
                        type="text" 
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border-b border-white/10 py-3 outline-none focus:border-primary transition-all font-serif italic text-lg" 
                        placeholder="Objet de votre demande" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-black text-stone-500">Message</label>
                      <textarea 
                        required
                        rows={4} 
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border-b border-white/10 py-3 outline-none focus:border-primary transition-all font-serif italic text-lg resize-none" 
                        placeholder="Votre message..."
                      ></textarea>
                    </div>
                    <button 
                      disabled={contactLoading}
                      type="submit"
                      className="w-full py-5 bg-primary text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white hover:text-stone-900 transition-all flex items-center justify-center gap-4 group disabled:opacity-50"
                    >
                      {contactLoading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <>
                          Transmettre
                          <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-24 bg-stone-100 border-y border-stone-200">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="space-y-4">
                <div className="flex justify-center text-primary">
                  <Truck size={48} strokeWidth={1} />
                </div>
                <h4 className="text-xl font-serif font-bold uppercase tracking-wider">Livraison Gratuite</h4>
                <p className="text-stone-500 text-sm font-light">Partout au Maroc pour toute commande supérieure à 500 MAD.</p>
              </div>
              <div className="space-y-4">
                <div className="flex justify-center text-primary">
                  <Wrench size={48} strokeWidth={1} />
                </div>
                <h4 className="text-xl font-serif font-bold uppercase tracking-wider">Sur Mesure</h4>
                <p className="text-stone-500 text-sm font-light">Personnalisez vos dimensions pour un tapis parfaitement adapté à votre espace.</p>
              </div>
              <div className="space-y-4">
                <div className="flex justify-center text-primary">
                  <Gem size={48} strokeWidth={1} />
                </div>
                <h4 className="text-xl font-serif font-bold uppercase tracking-wider">Qualité Supérieure</h4>
                <p className="text-stone-500 text-sm font-light">Des matériaux nobles et un savoir-faire artisanal garanti.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
