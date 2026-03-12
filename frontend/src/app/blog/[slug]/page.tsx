'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { blogService } from '@/services/api';
import { Calendar, User, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function BlogPostDetail() {
    const params = useParams();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            if (!params.slug) return;
            try {
                const data = await blogService.getBySlug(params.slug as string);
                setPost(data);
            } catch (error) {
                console.error("Failed to fetch blog post:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [params.slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-stone-50">
                <Header />
                <div className="flex justify-center items-center py-64">
                    <Loader2 className="animate-spin text-primary" size={48} />
                </div>
                <Footer />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-stone-50">
                <Header />
                <div className="container mx-auto px-4 py-64 text-center">
                    <h1 className="text-4xl font-serif font-bold italic mb-8">Article introuvable</h1>
                    <Link href="/blog" className="btn-premium px-12 py-5 inline-block">
                        Retour au journal
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50">
            <Header />

            {/* Hero Section */}
            <section className="bg-stone-900 py-48 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-stone-900/60 z-10" />
                <img 
                    src={post.image || '/images/hero-carpet.jpg'}
                    className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105" 
                    alt={post.title}
                />
                <div className="container mx-auto px-4 relative z-20 space-y-8 max-w-4xl">
                    <Link 
                        href="/blog" 
                        className="inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-black text-primary hover:text-white transition-colors group"
                    >
                        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-2" />
                        Retour au journal
                    </Link>
                    <div className="space-y-6">
                        <div className="flex items-center gap-8 text-[11px] uppercase tracking-[0.3em] font-bold text-white/60">
                            <div className="flex items-center gap-3">
                                <Calendar size={14} className="text-primary" />
                                {new Date(post.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                            <div className="flex items-center gap-3">
                                <User size={14} className="text-primary" />
                                {post.author}
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-serif font-bold italic leading-tight tracking-tight shadow-text">
                            {post.title}
                        </h1>
                    </div>
                </div>
            </section>

            <article className="container mx-auto px-4 py-32 max-w-4xl">
                <div className="bg-white p-12 md:p-24 rounded-sm shadow-2xl shadow-stone-900/5 -mt-32 relative z-30 border border-stone-100">
                    <div className="prose prose-stone prose-lg max-w-none">
                        <p className="text-2xl font-serif italic text-stone-500 leading-relaxed mb-12 border-l-4 border-primary pl-8">
                            {post.excerpt}
                        </p>
                        <div className="text-stone-700 font-light leading-loose space-y-8 whitespace-pre-wrap">
                            {post.content}
                        </div>
                    </div>

                    <div className="mt-24 pt-12 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-12">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-primary font-serif font-bold text-2xl">
                                {post.author.charAt(0)}
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-black text-stone-400 mb-1">Écrit par</p>
                                <p className="text-xl font-serif font-bold italic text-stone-900">{post.author}</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            {['Facebook', 'Pinterest', 'WhatsApp'].map(social => (
                                <button key={social} className="px-6 py-3 border border-stone-100 text-[10px] uppercase tracking-widest font-black text-stone-400 hover:text-primary hover:border-primary transition-all">
                                    {social}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </article>

            <Footer />
        </div>
    );
}
