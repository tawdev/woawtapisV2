'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { categoryService, getImageUrl } from '@/services/api';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Palette, Ruler, History } from 'lucide-react';

const thematicCollections = [
    {
        id: 'minimalisme',
        name: 'Minimalisme Berbère',
        desc: 'La pureté de la laine naturelle, sublimée par des motifs ancestraux d\'une sobriété absolue.',
        image: '/images/inspiration/beni_ouarain.png',
        filter: '?category=beni-ourain&colors=blanc,beige',
        icon: <Ruler size={16} />,
        accent: 'emerald'
    },
    {
        id: 'eclats',
        name: 'Éclats de Couleurs',
        desc: 'L\'expression artistique libre des tisseuses de l\'Atlas, où chaque couleur raconte une émotion.',
        image: '/images/inspiration/vintage_azilal.png',
        filter: '?category=azilal&colors=multicolore,rose,bleu',
        icon: <Palette size={16} />,
        accent: 'amber'
    },
    {
        id: 'heritage',
        name: 'Héritage Artisanal',
        desc: 'Des pièces rares chargées d\'histoire, témoins d\'un savoir-faire préservé depuis des siècles.',
        image: '/images/inspiration/kilim_gallery.png',
        filter: '?search=vintage',
        icon: <History size={16} />,
        accent: 'stone'
    }
];

export default function CollectionsPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadCategories() {
            try {
                const data = await categoryService.getAll();
                setCategories(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to load collections:", error);
            } finally {
                setLoading(false);
            }
        }
        loadCategories();
    }, []);

    return (
        <div className="min-h-screen bg-[#FDFCFB]">
            <Header transparent />

            {/* Hero Section */}
            <section className="bg-stone-900 py-44 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-stone-900/80 via-stone-900/60 to-[#FDFCFB] z-10" />
                <Image src="/images/hero-carpet.jpg" alt="Collections hero" fill priority className="object-cover opacity-50 scale-110" />
                <div className="container mx-auto px-4 relative z-20">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <span className="text-primary uppercase tracking-[0.6em] text-[10px] font-black mb-6 block">Inspiration & Design</span>
                        <h1 className="text-6xl md:text-8xl font-serif font-bold mb-8 italic tracking-tighter">Nos Univers</h1>
                        <p className="text-stone-300 text-xl font-light leading-relaxed italic max-w-xl">
                            Découvrez nos collections thématiques, pensées pour sublimer vos intérieurs et raconter une histoire unique.
                        </p>
                    </motion.div>
                </div>
            </section>

            <main className="container mx-auto px-4 -mt-32 relative z-30 pb-32">
                
                {/* Thematic Collections Section */}
                <div className="mb-44 space-y-16">
                    <div className="flex items-center gap-6">
                        <div className="h-px flex-1 bg-stone-200" />
                        <h2 className="text-[11px] uppercase font-black tracking-[0.5em] text-stone-400">Curations Éditoriales</h2>
                        <div className="h-px flex-1 bg-stone-200" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {thematicCollections.map((collection, idx) => (
                            <motion.div
                                key={collection.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Link href={`/products${collection.filter}`} className="group block relative h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl">
                                    <Image src={collection.image} alt={collection.name} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/20 to-transparent group-hover:via-stone-900/40 transition-all duration-500" />
                                    
                                    <div className="absolute bottom-0 left-0 right-0 p-10 space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                                                {collection.icon}
                                            </div>
                                            <span className="text-[9px] uppercase font-black tracking-[0.4em] text-primary">Collection</span>
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-serif font-bold text-white mb-4 italic group-hover:text-primary transition-colors">{collection.name}</h3>
                                            <p className="text-stone-300 text-sm font-light leading-relaxed italic opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                                                {collection.desc}
                                            </p>
                                        </div>
                                        <div className="pt-4 flex items-center justify-between">
                                             <div className="h-[1px] w-12 bg-white/30 group-hover:w-full transition-all duration-700" />
                                             <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center scale-0 group-hover:scale-100 transition-all duration-500 shadow-xl">
                                                <ArrowRight size={18} />
                                             </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* All Categories Section */}
                <div className="space-y-16">
                    <div className="flex items-center gap-6">
                        <div className="h-px flex-1 bg-stone-200" />
                        <h2 className="text-[11px] uppercase font-black tracking-[0.5em] text-stone-400">Exploration par Styles</h2>
                        <div className="h-px flex-1 bg-stone-200" />
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 animate-pulse">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-[3/4] bg-stone-200 rounded-3xl" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {categories.map((cat, idx) => (
                                <motion.div
                                    key={cat.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 + idx * 0.05 }}
                                >
                                    <Link href={`/products?category=${cat.slug || cat.id}`} className="group block space-y-6">
                                        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-stone-200 border border-stone-100 transition-all duration-700 group-hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] group-hover:-translate-y-2">
                                            <Image
                                                src={getImageUrl(cat.image)}
                                                alt={cat.name}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 25vw"
                                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                                onError={(e: any) => {
                                                    e.target.srcset = '';
                                                    e.target.src = '/images/placeholder.jpg';
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-stone-900/5 group-hover:bg-stone-900/20 transition-colors" />
                                            <div className="absolute top-6 left-6">
                                                <div className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-stone-900 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-500">
                                                    <Sparkles size={16} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-center space-y-1">
                                            <h3 className="text-sm font-serif font-black uppercase tracking-widest text-stone-900 group-hover:text-primary transition-colors">{cat.name.replace(/_/g, ' ')}</h3>
                                            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.2em]">Découvrir la pièce</p>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
