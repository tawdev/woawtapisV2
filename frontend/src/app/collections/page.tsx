'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { categoryService, getImageUrl } from '@/services/api';

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
        <div className="min-h-screen bg-stone-50">
            <Header transparent />

            <section className="bg-stone-900 py-32 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-stone-900/50 z-10" />
                <img src="/images/hero-carpet.jpg" className="absolute inset-0 w-full h-full object-cover opacity-30 scale-110 animate-slow-zoom" />
                <div className="container mx-auto px-4 relative z-20 text-center">
                    <h2 className="text-primary uppercase tracking-[0.5em] text-[10px] font-bold mb-6">Inspiration & Matières</h2>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8 italic">Nos Collections</h1>
                    <div className="h-1 w-24 bg-primary mx-auto mb-8" />
                    <p className="text-stone-300 max-w-xl mx-auto font-light leading-relaxed">
                        Découvrez nos univers thématiques, des classiques intemporels aux créations contemporaines les plus audacieuses.
                    </p>
                </div>
            </section>

            <main className="container mx-auto px-4 py-20">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 animate-pulse">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="aspect-[3/4] bg-stone-200 rounded-sm" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {categories.map((cat) => (
                            <Link key={cat.id} href={`/products?category=${cat.id}`} className="group block">
                                <div className="relative aspect-[3/4] overflow-hidden rounded-sm mb-6 bg-stone-200">
                                    <img
                                        src={getImageUrl(cat.image)}
                                        alt={cat.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-stone-900/20 group-hover:bg-stone-900/40 transition-colors duration-500" />
                                    <div className="absolute bottom-10 left-10 right-10 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <h3 className="text-2xl font-serif font-bold mb-2">{cat.name}</h3>
                                        <div className="h-1 w-12 bg-primary transition-all duration-500 group-hover:w-full" />
                                    </div>
                                </div>
                                <p className="text-stone-500 font-medium text-center line-clamp-2 px-4">
                                    {cat.description || 'Découvrez notre sélection exclusive.'}
                                </p>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
