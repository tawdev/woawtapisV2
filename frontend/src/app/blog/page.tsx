'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { blogService } from '@/services/api';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Loader2 } from 'lucide-react';

export default function BlogPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await blogService.getAll();
                setPosts(data.data);
            } catch (error) {
                console.error("Failed to fetch blog posts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div className="min-h-screen bg-stone-50">
            <Header />

            {/* Hero Section */}
            <section className="bg-stone-900 py-32 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-stone-900/60 z-10" />
                <img 
                    src="/images/hero-carpet.jpg" 
                    className="absolute inset-0 w-full h-full object-cover opacity-30 scale-110 animate-slow-zoom" 
                    alt="Blog Hero"
                />
                <div className="container mx-auto px-4 relative z-20 text-center space-y-8">
                    <h2 className="text-primary uppercase tracking-[0.5em] text-[10px] font-bold animate-in fade-in slide-in-from-bottom-4 duration-700">Inspiration & Savoir-Faire</h2>
                    <h1 className="text-5xl md:text-8xl font-serif font-bold italic tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000">Notre Journal</h1>
                    <div className="h-1 w-24 bg-primary mx-auto animate-in fade-in zoom-in duration-1000 delay-300" />
                </div>
            </section>

            <main className="container mx-auto px-4 py-24">
                {loading ? (
                    <div className="flex justify-center items-center py-32">
                        <Loader2 className="animate-spin text-primary" size={48} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {posts.map((post: any) => (
                            <article key={post.id} className="group bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 border border-stone-100">
                                <Link href={`/blog/${post.slug}`}>
                                    <div className="aspect-[16/10] overflow-hidden relative">
                                        <img 
                                            src={post.image || '/images/hero-carpet.jpg'} 
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-stone-900/0 transition-all duration-700" />
                                    </div>
                                </Link>
                                <div className="p-8 space-y-6">
                                    <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest font-black text-stone-400">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={12} className="text-primary" />
                                            {new Date(post.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <User size={12} className="text-primary" />
                                            {post.author}
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-serif font-bold text-stone-900 italic group-hover:text-primary transition-colors">
                                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                                    </h2>
                                    <p className="text-stone-500 font-light leading-relaxed line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                    <div className="pt-4 border-t border-stone-50">
                                        <Link 
                                            href={`/blog/${post.slug}`}
                                            className="inline-flex items-center gap-4 text-[10px] uppercase tracking-widest font-black text-stone-900 group/link"
                                        >
                                            Lire l&apos;article
                                            <ArrowRight size={14} className="text-primary transition-transform duration-500 group-hover/link:translate-x-2" />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
