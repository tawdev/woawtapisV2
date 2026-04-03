'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Hero from '@/components/layout/Hero';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import Image from 'next/image';
import { productService, contactService } from '@/services/api';

import { useRouter } from 'next/navigation';
import { Truck, Wrench, Gem, Send, Loader2, CheckCircle2, ChevronRight, X } from 'lucide-react';

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

  const router = useRouter();
  const [selectedCollection, setSelectedCollection] = useState<{
    id: string;
    title: string;
    options: { label: string; desc: string; catId: string; type: string }[]
  } | null>(null);

  const collections = [
    {
      id: "marocain",
      title: "Marocain",
      desc: "Art ancestral berbère tissé à la main dans les montagnes du Moyen Atlas. Chaque pièce raconte l'histoire d'une tradition vivante.",
      img: "/images/collection_marocain.png",
      options: [
        { label: "En Stock", desc: "Des pièces prêtes à être expédiées, directement issues des ateliers berbères.", catId: "5", type: "stock" },
        { label: "Sur Mesure", desc: "Créez votre tapis marocain aux dimensions et couleurs de votre choix.", catId: "8", type: "mesure" },
        { label: "Vintage", desc: "Pièces d'exception aux patines du temps, rares et recherchées par les connaisseurs.", catId: "19", type: "vintage" }
      ]
    },
    {
      id: "moderne",
      title: "Moderne",
      desc: "Design contemporain épuré fusionnant savoir-faire artisanal et esthétique actuelle. Pour les intérieurs qui osent.",
      img: "/images/collection_moderne.png",
      options: [
        { label: "En Stock", desc: "Des créations contemporaines prêtes à transformer votre espace immédiatement.", catId: "1", type: "stock" },
        { label: "Sur Mesure", desc: "Personnalisez chaque détail — taille, couleur, motif — pour une pièce unique.", catId: "11", type: "mesure" }
      ]
    },
    {
      id: "iran",
      title: "Iran",
      desc: "La quintessence de l'art persan. Médaillons floraux, jeux de couleurs profondes et finesse d'un tissage millénaire.",
      img: "/images/collection_iran.png",
      options: [
        { label: "En Stock", desc: "Authentiques tapis persans disponibles immédiatement pour livraison.", catId: "2", type: "stock" },
        { label: "Vintage", desc: "Tapis anciens persans d'époque, chargés d'histoire et de rareté absolue.", catId: "18", type: "vintage" }
      ]
    },
    {
      id: "turc",
      title: "Turc",
      desc: "L'héritage ottoman revisité. Motifs de tulipes et arabesques tissés avec des laines nobles aux teintes profondes.",
      img: "/images/collection_turc.png",
      options: [
        { label: "En Stock", desc: "Authentiques tapis turcs disponibles pour une livraison rapide.", catId: "4", type: "stock" },
        { label: "Vintage", desc: "Pièces ottomanes anciennes d'une rareté et d'une authenticité incomparables.", catId: "17", type: "vintage" }
      ]
    }
  ];

  const handleCollectionClick = (col: typeof collections[0]) => {
    setSelectedCollection({ 
      id: col.id, 
      title: col.title, 
      options: col.options 
    });
  };

  const handleSubChoiceClick = (catId: string) => {
    router.push(`/products?category=${catId}`);
    setSelectedCollection(null);
  };


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

        {/* Collections Section */}
        <section className="py-24 bg-stone-50 border-t border-stone-200">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-primary uppercase tracking-[0.2em] text-sm font-bold">Nos Univers</h2>
              <h3 className="text-4xl md:text-5xl font-serif font-bold italic">Nos Collections</h3>
              <div className="h-1 w-16 bg-primary mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {collections.map((col) => (
                <div 
                  key={col.id} 
                  onClick={() => handleCollectionClick(col)}
                  className="group cursor-pointer relative overflow-hidden rounded-sm bg-white shadow-sm border border-stone-100 hover:shadow-xl transition-all duration-500 flex flex-col h-full"
                >
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-stone-900/10 z-10 group-hover:bg-transparent transition-colors duration-500" />
                    <Image 
                      src={col.img} 
                      alt={col.title}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col items-center text-center">
                    <h4 className="text-2xl font-serif font-bold italic text-stone-900 mb-3">{col.title}</h4>
                    <p className="text-sm font-light text-stone-500 mb-6 flex-1">{col.desc}</p>
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-primary group-hover:text-stone-900 transition-colors">
                      Explorer la ligne
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sub-choice Modal */}
        {selectedCollection && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setSelectedCollection(null)} />
            <div className="relative bg-white w-full max-w-4xl min-h-[500px] flex flex-col rounded-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
              <button 
                onClick={() => setSelectedCollection(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-stone-900 hover:text-primary transition-colors border border-stone-200 hover:border-primary shadow-sm"
              >
                <X size={20} />
              </button>
              
              <div className="text-center py-8 bg-stone-50 border-b border-stone-100">
                <h3 className="text-sm tracking-widest uppercase font-bold text-primary mb-2">Gamme {selectedCollection.title}</h3>
                <h2 className="text-3xl font-serif font-bold italic text-stone-900">Que préférez-vous ?</h2>
              </div>
              
              <div className={`flex-1 grid grid-cols-1 ${selectedCollection.options.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} p-8 gap-8`}>
                {selectedCollection.options.map((opt) => (
                  <div 
                    key={opt.catId}
                    onClick={() => handleSubChoiceClick(opt.catId)}
                    className="group relative h-80 md:h-full min-h-[320px] rounded-sm overflow-hidden cursor-pointer shadow-lg border border-stone-100 hover:shadow-2xl transition-shadow"
                  >
                    <Image 
                      src="/images/hero-carpet.jpg" 
                      alt={opt.label} 
                      fill 
                      className={`object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 ${opt.type === 'mesure' ? 'blur-[2px]' : opt.type === 'vintage' ? 'sepia-[.4]' : ''}`} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                      <h3 className="text-3xl font-serif font-bold italic text-white mb-2">{opt.label}</h3>
                      <p className="text-sm font-light text-white/80 mb-6">{opt.desc}</p>
                      <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-black text-primary bg-white px-6 py-3 w-fit rounded-sm group-hover:bg-primary group-hover:text-white transition-colors">
                        {opt.type === 'mesure' ? 'Créer le mien' : 'Découvrir'} <ChevronRight size={14} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

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
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-stone-100 rounded-sm" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredProducts.slice(0, 4).map((product: any) => (
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
