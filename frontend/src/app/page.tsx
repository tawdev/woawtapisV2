'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Hero from '@/components/layout/Hero';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import Image from 'next/image';
import { productService, contactService } from '@/services/api';
import { useRouter } from 'next/navigation';
import { Truck, Wrench, Gem, Send, Loader2, CheckCircle2, ChevronRight, X, Star, ArrowRight, Ruler, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success'>('idle');

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

  const [selectedCollection, setSelectedCollection] = useState<{
    id: string;
    title: string;
    options: { label: string; desc: string; catId: string; type: string }[]
  } | null>(null);

  const collections = [
    {
      id: "marocain",
      title: "Marocain",
      desc: "Art ancestral berbère tissé à la main dans les montagnes du Moyen Atlas.",
      img: "/images/collection_marocain.png",
      options: [
        { label: "En Stock", desc: "Pièces prêtes à être expédiées immédiatement.", catId: "marocain-on-stock", type: "stock" },
        { label: "Sur Mesure", desc: "Personnalisez votre tapis berbère unique.", catId: "marocain-sur-mesure", type: "mesure" },
        { label: "Vintage", desc: "Pièces d'exception aux patines du temps.", catId: "marocain-vintage", type: "vintage" }
      ]
    },
    {
      id: "moderne",
      title: "Moderne",
      desc: "Design contemporain épuré fusionnant savoir-faire artisanal et esthétique actuelle.",
      img: "/images/collection_moderne.png",
      options: [
        { label: "En Stock", desc: "Créations contemporaines prêtes pour votre espace.", catId: "moderne-on-stock", type: "stock" },
        { label: "Sur Mesure", desc: "Personnalisez chaque détail : taille, couleur, motif.", catId: "moderne-sur-mesure", type: "mesure" }
      ]
    },
    {
      id: "iran",
      title: "Iran",
      desc: "La quintessence de l'art persan. Médaillons floraux et tissage millénaire.",
      img: "/images/collection_iran.png",
      options: [
        { label: "En Stock", desc: "Authentiques tapis persans disponibles immédiatement.", catId: "l-iran-on-stock", type: "stock" },
        { label: "Vintage", desc: "Tapis anciens persans d'époque, chargés d'histoire.", catId: "liran-vintage", type: "vintage" }
      ]
    },
    {
      id: "turc",
      title: "Turc",
      desc: "L'héritage ottoman revisité. Motifs de tulipes et arabesques en laine noble.",
      img: "/images/collection_turc.png",
      options: [
        { label: "En Stock", desc: "Authentiques tapis turcs disponibles pour une livraison rapide.", catId: "turc-on-stock", type: "stock" },
        { label: "Vintage", desc: "Pièces ottomanes anciennes d'une rareté incomparable.", catId: "turc-vintage", type: "vintage" }
      ]
    }
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterStatus('loading');
    setTimeout(() => {
      setNewsletterStatus('success');
      setNewsletterEmail('');
      setTimeout(() => setNewsletterStatus('idle'), 4000);
    }, 1200);
  };

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
    if (selectedCollection) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedCollection]);

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
      await contactService.sendMessage(formData);
      const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP || "212607790956";
      const text = `Bonjour TAW 10,\n\nNouveau message de contact :\n\n*Nom:* ${formData.name}\n*Email:* ${formData.email}\n*Sujet:* ${formData.subject}\n*Message:* ${formData.message}`;
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
      setContactSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setContactLoading(false);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } }
  };

  return (
    <>
      <Header transparent />

      <main className="bg-white">
        <Hero />
        
        {/* À Propos Section - Luxury Editorial Style */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
          className="py-44 overflow-hidden relative"
        >
          <div className="absolute top-0 left-0 w-1/3 h-full bg-stone-50/50 -z-10" />
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
              <div className="lg:col-span-6 relative">
                <div className="absolute -inset-10 bg-primary/5 rounded-[4rem] blur-[80px]" />
                <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] group">
                  <Image 
                    src="/images/hero-carpet.jpg" 
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-[2s] group-hover:scale-110" 
                    alt="Artisanat TAW 10"
                  />
                  <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors duration-1000" />
                </div>
                <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-white border border-stone-100 p-12 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] rounded-[3rem] hidden xl:flex flex-col justify-center space-y-6">
                  <span className="text-primary font-playfair italic text-3xl leading-tight">L&apos;excellence du geste ancestral</span>
                  <div className="h-1 w-12 bg-primary" />
                  <p className="text-stone-400 text-[10px] uppercase tracking-[0.4em] font-black leading-relaxed">Chaque pièce est une œuvre unique, façonnée nœud par nœud.</p>
                </div>
              </div>
              
              <div className="lg:col-span-6 space-y-16 lg:pl-12">
                <div className="space-y-8">
                  <h2 className="text-primary uppercase tracking-[0.6em] text-[10px] font-black">Héritage & Passion</h2>
                  <h3 className="text-6xl md:text-8xl font-playfair font-black italic tracking-tighter leading-[0.9]">Maison d&apos;art <br />d&apos;Exception</h3>
                </div>
                
                <div className="space-y-10 text-xl font-light text-stone-500 leading-relaxed max-w-xl">
                  <p>
                    Chez <span className="text-stone-900 font-playfair italic font-black">waootapis</span>, nous perpétuons l&apos;art millénaire du tissage berbère. Nous sélectionnons les laines les plus nobles pour créer des pièces qui respirent l&apos;authenticité.
                  </p>
                  <p>
                    Chaque tapis est le fruit d&apos;une collaboration intime avec nos tisseuses partenaires du Moyen Atlas, alliant ainsi tradition et esthétique contemporaine.
                  </p>
                </div>

                <div className="pt-8">
                  <a href="/a-propos" className="group flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full border border-stone-200 flex items-center justify-center group-hover:bg-stone-900 group-hover:border-stone-900 group-hover:text-white transition-all duration-500">
                        <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.5em] font-black text-stone-900 group-hover:text-primary transition-colors">Découvrir notre histoire</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Collections Section - Luxury Cards */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
          className="py-44 bg-[#FDFCFB] border-y border-stone-100"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-32 space-y-6">
              <h2 className="text-primary uppercase tracking-[0.6em] text-[10px] font-black">Parcourir Nos Univers</h2>
              <h3 className="text-5xl md:text-7xl font-playfair font-black italic tracking-tighter">Collections Signature</h3>
              <div className="h-1.5 w-24 bg-primary mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {collections.map((col) => (
                <div 
                  key={col.id} 
                  onClick={() => handleCollectionClick(col)}
                  className="group cursor-pointer relative h-[600px] overflow-hidden rounded-[3rem] shadow-xl hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] transition-all duration-1000"
                >
                  <Image 
                    src={col.img} 
                    alt={col.title}
                    fill
                    className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  
                  <div className="absolute inset-0 p-12 flex flex-col justify-end text-white space-y-6">
                    <h4 className="text-4xl font-playfair font-black italic leading-none">{col.title}</h4>
                    <p className="text-sm font-light opacity-80 leading-relaxed transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">{col.desc}</p>
                    <div className="pt-6">
                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-700">
                             <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Featured Products Section - Refined Grid */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
          className="py-44 bg-white"
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
              <div className="space-y-8">
                <h2 className="text-primary uppercase tracking-[0.6em] text-[10px] font-black">Prestige & Rarete</h2>
                <h3 className="text-5xl md:text-7xl font-playfair font-black italic tracking-tighter">Notre Sélection Royale</h3>
              </div>
              <a href="/products" className="group flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] font-black border-b-2 border-stone-900 pb-2 hover:text-primary hover:border-primary transition-all">
                Explorer Tout le Catalogue
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-[4/5] bg-stone-100 rounded-[2rem] animate-pulse" />
                ))}
              </div>
            ) : featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {featuredProducts.slice(0, 4).map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-32 text-center border-2 border-dashed border-stone-100 rounded-[3rem] bg-stone-50/50">
                 <p className="text-stone-400 font-playfair italic text-2xl">La sélection est en cours de renouvellement.</p>
              </div>
            )}
          </div>
        </motion.section>

        {/* Instagram/UGC Section - Modern Interactive Grid */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
          className="pb-44 bg-white"
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
              <div className="space-y-8">
                <h2 className="text-primary uppercase tracking-[0.6em] text-[10px] font-black">Inspiration Collective</h2>
                <h3 className="text-5xl md:text-7xl font-playfair font-black italic tracking-tighter text-stone-900">Dans vos Intérieurs</h3>
              </div>
              <a href="https://instagram.com/waootapis" target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-[0.4em] font-black text-stone-400 hover:text-primary transition-colors">
                @waootapis <span className="opacity-30">#waoohome</span>
              </a>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { src: "/images/inspiration/beni_ouarain.png", likes: "1.8k" },
                { src: "/images/inspiration/vintage_azilal.png", likes: "1.2k" },
                { src: "/images/inspiration/kilim_gallery.png", likes: "2.4k" },
                { src: "/images/inspiration/dining_modern.png", likes: "942" }
              ].map((img, i) => (
                <div key={i} className="group relative aspect-square bg-stone-100 overflow-hidden rounded-[2.5rem] shadow-sm">
                  <img src={img.src} alt={`Instagram ${i}`} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" />
                  <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col items-center justify-center backdrop-blur-sm">
                    <div className="w-12 h-12 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-white mb-4">
                         <Star size={20} fill="currentColor" />
                    </div>
                    <span className="text-white text-[10px] uppercase font-black tracking-widest">{img.likes} Mentions</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Benefits Section - Minimalist & Pure */}
        <section className="py-32 bg-stone-900 text-white border-b border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5" />
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-24 text-center">
                    <div className="space-y-8 group">
                        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-primary group-hover:bg-primary group-hover:text-white transition-all duration-700 group-hover:-translate-y-2">
                             <Truck size={32} strokeWidth={1} />
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-xl font-playfair font-black italic uppercase tracking-wider">Services Logistiques</h4>
                            <p className="text-stone-400 text-sm font-light italic leading-relaxed">Livraison offerte au Maroc & Expédition express assurée vers 40 destinations internationales.</p>
                        </div>
                    </div>
                    <div className="space-y-8 group">
                        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-primary group-hover:bg-primary group-hover:text-white transition-all duration-700 group-hover:-translate-y-2">
                             <Wrench size={32} strokeWidth={1} />
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-xl font-playfair font-black italic uppercase tracking-wider">Conception Privée</h4>
                            <p className="text-stone-400 text-sm font-light italic leading-relaxed">Un service exclusif de personnalisation pour adapter nos tissages à la singularité de votre demeure.</p>
                        </div>
                    </div>
                    <div className="space-y-8 group">
                        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-primary group-hover:bg-primary group-hover:text-white transition-all duration-700 group-hover:-translate-y-2">
                             <Gem size={32} strokeWidth={1} />
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-xl font-playfair font-black italic uppercase tracking-wider">Matières Nobles</h4>
                            <p className="text-stone-400 text-sm font-light italic leading-relaxed">Chaque pièce est certifiée par notre maison, garantissant l&apos;usage de pure laine et de teintures naturelles.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Sub-choice Modal - High End Transition */}
        <AnimatePresence>
            {selectedCollection && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            >
                <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-xl" onClick={() => setSelectedCollection(null)} />
                <motion.div 
                    initial={{ y: 50, scale: 0.95, opacity: 0 }} 
                    animate={{ y: 0, scale: 1, opacity: 1 }} 
                    exit={{ y: 50, scale: 0.95, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="relative bg-white w-full max-w-6xl rounded-[4rem] shadow-[0_100px_200px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col md:flex-row min-h-[600px]"
                >
                    <button 
                        onClick={() => setSelectedCollection(null)}
                        className="absolute top-8 right-8 z-50 w-14 h-14 bg-white/50 backdrop-blur-md hover:bg-white rounded-full flex items-center justify-center text-stone-900 transition-all border border-stone-100"
                    >
                        <X size={24} />
                    </button>
                    
                    <div className="md:w-1/3 bg-stone-50 p-16 flex flex-col justify-center space-y-10 border-r border-stone-100">
                        <div className="space-y-4">
                            <h3 className="text-[10px] tracking-[0.6em] uppercase font-black text-primary">Gamme {selectedCollection.title}</h3>
                            <h2 className="text-5xl font-playfair font-black italic text-stone-900 tracking-tighter leading-none">VOTRE PRÉFÉRENCE ?</h2>
                        </div>
                        <p className="text-stone-400 font-light italic text-lg leading-relaxed">Sélectionnez la ligne qui correspond le mieux à l&apos;atmosphère de votre intérieur.</p>
                        <div className="h-1 w-12 bg-primary" />
                    </div>
                    
                    <div className={`flex-1 grid grid-cols-1 ${selectedCollection.options.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} p-12 gap-8`}>
                        {selectedCollection.options.map((opt) => (
                        <div 
                            key={opt.catId}
                            onClick={() => handleSubChoiceClick(opt.catId)}
                            className="group relative h-full min-h-[400px] rounded-[3rem] overflow-hidden cursor-pointer shadow-2xl transition-all duration-700 hover:-translate-y-2"
                        >
                            <Image 
                            src="/images/hero-carpet.jpg" 
                            alt={opt.label} 
                            fill 
                            className={`object-cover opacity-90 group-hover:scale-110 transition-transform duration-[1.5s] ${opt.type === 'mesure' ? 'grayscale-[0.5]' : opt.type === 'vintage' ? 'sepia-[0.3]' : ''}`} 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/20 to-transparent opacity-80" />
                            <div className="absolute inset-0 p-10 flex flex-col justify-end">
                                <h3 className="text-3xl font-playfair font-black italic text-white mb-4 leading-none">{opt.label}</h3>
                                <p className="text-sm font-light text-white/80 mb-8 max-w-xs">{opt.desc}</p>
                                <div className="inline-flex items-center gap-4 text-[9px] uppercase tracking-[0.4em] font-black text-primary bg-white px-8 py-5 w-fit rounded-full group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-2xl">
                                    {opt.type === 'mesure' ? 'Personnaliser' : 'Explorer'}
                                    <ChevronRight size={16} />
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
            )}
        </AnimatePresence>
      </main>

      <Footer />
    </>
  );
}
