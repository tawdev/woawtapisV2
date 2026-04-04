'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import { productService, categoryService } from '@/services/api';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
    ChevronLeft, 
    ChevronRight, 
    Search, 
    SlidersHorizontal, 
    LayoutGrid, 
    List,
    ChevronRight as ChevronRightIcon,
    ArrowRight,
    X,
    Filter,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Skeleton component for loading state
const ProductsPageSkeleton = () => (
    <div className="animate-pulse space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-4">
                    <div className="aspect-[3/4] bg-stone-200 rounded-2xl" />
                    <div className="h-4 bg-stone-200 rounded w-2/3" />
                    <div className="h-4 bg-stone-200 rounded w-1/2" />
                </div>
            ))}
        </div>
    </div>
);

function ProductsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const type = searchParams.get('type');
    const catParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    const colorsParam = searchParams.get('colors') || '';
    const selectedColors = colorsParam ? colorsParam.split(',').filter(Boolean) : [];
    const longueurParam = searchParams.get('max_longueur') || '';
    const largeurParam = searchParams.get('max_largeur') || '';
    const subCatParam = searchParams.get('sub_category') || '';
    const isCouloirParam = searchParams.get('is_couloir') === 'true';
    const isLitParam = searchParams.get('is_tapis_de_lit') === 'true';

    const [localLongueur, setLocalLongueur] = useState(longueurParam);
    const [localLargeur, setLocalLargeur] = useState(largeurParam);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        total: 0,
        current_page: 1,
        last_page: 1,
    });

    const currentPage = parseInt(searchParams.get('page') || '1');

    // Finding active category name to check for "Moderne"
    const activeCategory = categories.find(c => String(c.id) === catParam || c.slug === catParam);
    const isModerneActive = activeCategory?.name?.toLowerCase().includes('moderne');

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = 300;
            current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [categoriesData] = await Promise.all([
                    categoryService.getAll(),
                ]);
                setCategories(categoriesData);
            } catch (error) {
                console.error("Error loading categories:", error);
            }
        };
        loadInitialData();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params: any = {
                    page: currentPage,
                    per_page: 12,
                    category: catParam || undefined,
                    type: type || undefined,
                    search: searchParam || undefined,
                    colors: colorsParam || undefined,
                    max_longueur: longueurParam || undefined,
                    max_largeur: largeurParam || undefined,
                    is_couloir: isCouloirParam || undefined,
                    is_tapis_de_lit: isLitParam || undefined,
                    sub_category: subCatParam || undefined,
                };
                const response = await productService.getAll(params);
                setProducts(response.data);
                setPagination({
                    total: response.total,
                    current_page: response.current_page,
                    last_page: response.last_page,
                });
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage, catParam, type, searchParam, colorsParam, longueurParam, largeurParam, isCouloirParam, isLitParam, subCatParam]);

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        router.push(`/products?${params.toString()}`);
        window.scrollTo({ top: 400, behavior: 'smooth' });
    };

    const handleDimensionApply = (dimType: 'longueur' | 'largeur', value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(`max_${dimType}`, value);
        } else {
            params.delete(`max_${dimType}`);
        }
        params.set('page', '1');
        router.push(`/products?${params.toString()}`);
    };

    const toggleColor = (color: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const currentColors = new Set(selectedColors);
        const lowerColor = color.toLowerCase();
        
        if (currentColors.has(lowerColor)) {
            currentColors.delete(lowerColor);
        } else {
            currentColors.add(lowerColor);
        }
        
        if (currentColors.size > 0) {
            params.set('colors', Array.from(currentColors).join(','));
        } else {
            params.delete('colors');
        }
        params.set('page', '1');
        router.push(`/products?${params.toString()}`);
    };

    const colorOptions = [
        { name: 'Rouge', hex: '#be185d' },
        { name: 'Bleu', hex: '#1e3a8a' },
        { name: 'Vert', hex: '#166534' },
        { name: 'Noir', hex: '#1c1917' },
        { name: 'Blanc', hex: '#ffffff' },
        { name: 'Beige', hex: '#eaddcf' },
        { name: 'Rose', hex: '#fda4af' },
        { name: 'Multicolore', gradient: 'conic-gradient(red, yellow, green, blue, magenta, red)' }
    ];

    // Helper for pagination numbers
    const getPageNumbers = () => {
        const totalPages = pagination.last_page;
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== '...') {
                pages.push('...');
            }
        }
        return pages;
    };

    return (
        <div className="min-h-screen bg-stone-50">
            <Header transparent />

            {/* Page Header */}
            <section className="bg-stone-900 py-32 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-stone-900/50 z-10" />
                <img src="/images/hero-carpet.jpg" className="absolute inset-0 w-full h-full object-cover opacity-30 scale-110 animate-slow-zoom" />
                <div className="container mx-auto px-4 relative z-20 text-center">
                    <h2 className="text-primary uppercase tracking-[0.5em] text-[10px] font-bold mb-6">
                        {searchParam ? 'Résultats de Recherche' : "Catalogue d'Exception"}
                    </h2>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8 italic">
                        {searchParam ? `"${searchParam}"` : type === 'sur_mesure' ? 'Tapis sur Mesure' : 'Notre Collection'}
                    </h1>
                    <div className="h-1 w-24 bg-primary mx-auto" />
                </div>
            </section>

            {/* Sticky Horizontal Categories Filter */}
            <div className="sticky top-[72px] z-40 bg-white border-b border-stone-100 shadow-sm overflow-hidden">
                <div className="container mx-auto px-4 relative group">
                    <button 
                        onClick={() => scroll('left')}
                        className="absolute left-6 top-1/2 -translate-y-1/2 z-50 w-10 h-10 bg-white border border-stone-100 rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-stone-900 hover:text-white"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    
                    <button 
                        onClick={() => scroll('right')}
                        className="absolute right-6 top-1/2 -translate-y-1/2 z-50 w-10 h-10 bg-white border border-stone-100 rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-stone-900 hover:text-white"
                    >
                        <ChevronRight size={16} />
                    </button>

                    <div ref={scrollContainerRef} className="flex items-center gap-3 overflow-x-auto no-scrollbar py-6 scroll-smooth px-2">
                        <Link 
                            href="/products" 
                            className={`whitespace-nowrap px-8 py-3 text-[10px] uppercase tracking-[0.25em] font-black transition-all duration-500 rounded-full border ${
                                !catParam ? 'bg-stone-900 text-white border-stone-900 shadow-xl scale-105' : 'bg-stone-50 text-stone-400 border-transparent hover:border-stone-900 hover:text-stone-900 hover:bg-white'
                            }`}
                        >
                            Tous les Tapis
                        </Link>
                        {categories.map((cat: any) => (
                            <Link
                                key={cat.id}
                                href={`/products?category=${cat.slug || cat.id}${type ? `&type=${type}` : ''}`}
                                className={`whitespace-nowrap px-8 py-3 text-[10px] uppercase tracking-[0.25em] font-black transition-all duration-500 rounded-full border ${
                                    (catParam === String(cat.id) || catParam === cat.slug) ? 'bg-stone-900 text-white border-stone-900 shadow-xl scale-105' : 'bg-stone-50 text-stone-400 border-transparent hover:border-stone-900 hover:text-stone-900 hover:bg-white'
                                }`}
                            >
                                {cat.name.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-24">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Sidebar / Filters */}
                    <aside className="w-full lg:w-72 shrink-0">
                        <div className="lg:sticky lg:top-[160px] space-y-8 lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto lg:pr-2 no-scrollbar">
                            
                            {/* Format & Usage */}
                            <div className="space-y-4">
                                <h3 className="text-[11px] uppercase tracking-[0.4em] font-black text-stone-900 mb-4 flex items-center gap-2">
                                    <span className="h-px w-4 bg-primary" /> Format & Usage
                                </h3>
                                <div className="grid grid-cols-1 gap-2">
                                    <button
                                        onClick={() => {
                                            const params = new URLSearchParams(searchParams.toString());
                                            if (isCouloirParam) params.delete('is_couloir');
                                            else params.set('is_couloir', 'true');
                                            router.push(`/products?${params.toString()}`);
                                        }}
                                        className={`group relative flex items-center justify-between px-6 py-5 border transition-all duration-500 ${
                                            isCouloirParam 
                                            ? 'bg-stone-900 border-stone-900 text-white shadow-2xl scale-[1.02] z-10' 
                                            : 'bg-white border-stone-100 text-stone-600 hover:border-primary hover:shadow-lg'
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg transition-colors ${isCouloirParam ? 'bg-white/10' : 'bg-stone-50 group-hover:bg-primary/10'}`}>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={isCouloirParam ? 'text-primary' : 'text-stone-400 group-hover:text-primary'}><path d="M2 9h20M2 15h20M2 9v6M22 9v6M7 9v6M12 9v6M17 9v6"/></svg>
                                            </div>
                                            <div className="text-left">
                                                <span className="block text-[11px] font-black uppercase tracking-widest">Couloir</span>
                                                <span className={`text-[9px] uppercase tracking-tighter ${isCouloirParam ? 'text-stone-400' : 'text-stone-300'}`}>Tapis de passage</span>
                                            </div>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => {
                                            const params = new URLSearchParams(searchParams.toString());
                                            if (isLitParam) params.delete('is_tapis_de_lit');
                                            else params.set('is_tapis_de_lit', 'true');
                                            router.push(`/products?${params.toString()}`);
                                        }}
                                        className={`group relative flex items-center justify-between px-6 py-5 border transition-all duration-500 ${
                                            isLitParam 
                                            ? 'bg-stone-900 border-stone-900 text-white shadow-2xl scale-[1.02] z-10' 
                                            : 'bg-white border-stone-100 text-stone-600 hover:border-primary hover:shadow-lg'
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg transition-colors ${isLitParam ? 'bg-white/10' : 'bg-stone-50 group-hover:bg-primary/10'}`}>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={isLitParam ? 'text-primary' : 'text-stone-400 group-hover:text-primary'}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>
                                            </div>
                                            <div className="text-left">
                                                <span className="block text-[11px] font-black uppercase tracking-widest">Descente de Lit</span>
                                                <span className={`text-[9px] uppercase tracking-tighter ${isLitParam ? 'text-stone-400' : 'text-stone-300'}`}>Formats de chambre</span>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Collections Modernes */}
                            {isModerneActive && (
                                <div className="p-8 bg-stone-900 text-white shadow-2xl relative overflow-hidden group rounded-2xl">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-colors duration-500" />
                                    <h3 className="text-[11px] uppercase tracking-[0.4em] font-black text-primary mb-6 relative z-10 flex items-center gap-2">
                                        <span className="h-px w-4 bg-primary" /> Collections Modernes
                                    </h3>
                                    <div className="space-y-2 relative z-10">
                                        {[
                                            { id: 'home_elegance', name: 'Home Elegance', desc: 'Prestige & Confort' },
                                            { id: 'kids_tapis', name: 'Kids Tapis', desc: 'Univers Enfants' },
                                            { id: 'tapis_moquette', name: 'Tapis Moquette', desc: 'Style Contemporain' }
                                        ].map(sub => (
                                            <button
                                                key={sub.id}
                                                onClick={() => {
                                                    const params = new URLSearchParams(searchParams.toString());
                                                    if (subCatParam === sub.id) params.delete('sub_category');
                                                    else params.set('sub_category', sub.id);
                                                    router.push(`/products?${params.toString()}`);
                                                }}
                                                className={`w-full text-left px-5 py-4 transition-all duration-300 border ${
                                                    subCatParam === sub.id 
                                                        ? 'bg-primary text-white border-primary shadow-lg' 
                                                        : 'bg-white/5 border-white/10 text-stone-300 hover:border-primary hover:text-white'
                                                }`}
                                            >
                                                <span className="block text-[10px] uppercase font-black tracking-widest">{sub.name}</span>
                                                <span className={`text-[8px] uppercase tracking-widest mt-1 block ${subCatParam === sub.id ? 'text-white/70' : 'text-stone-500'}`}>{sub.desc}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Couleurs */}
                            <div className="p-8 bg-white border border-stone-100 shadow-sm rounded-2xl">
                                <div className="flex justify-between items-center mb-6 pb-4 border-b border-stone-100">
                                    <h3 className="text-xs uppercase tracking-[0.3em] font-black text-stone-900">
                                        Nuances
                                    </h3>
                                    {selectedColors.length > 0 && (
                                        <button 
                                            onClick={() => {
                                                const params = new URLSearchParams(searchParams.toString());
                                                params.delete('colors');
                                                params.set('page', '1');
                                                router.push(`/products?${params.toString()}`);
                                            }}
                                            className="text-[9px] uppercase tracking-widest text-stone-400 hover:text-stone-900 font-bold"
                                        >
                                            Effacer
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-4 gap-3">
                                    {colorOptions.map((color) => {
                                        const isSelected = selectedColors.includes(color.name.toLowerCase());
                                        return (
                                            <button
                                                key={color.name}
                                                onClick={() => toggleColor(color.name)}
                                                title={color.name}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center transform transition-all duration-300 ${isSelected ? 'scale-110 ring-2 ring-stone-900 ring-offset-2' : 'hover:scale-110 hover:shadow-md'} ${color.name === 'Blanc' ? 'border border-stone-200' : ''}`}
                                                style={{ 
                                                    background: color.gradient || color.hex,
                                                    boxShadow: isSelected ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'inset 0 2px 4px rgba(0,0,0,0.06)'
                                                }}
                                            >
                                                {isSelected && (
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color.name === 'Blanc' || color.name === 'Beige' ? '#000' : '#fff'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Dimensions */}
                            <div className="p-8 bg-white border border-stone-100 shadow-sm rounded-2xl">
                                <h3 className="text-xs uppercase tracking-[0.3em] font-black text-stone-900 mb-6 pb-4 border-b border-stone-100">
                                    Dimensions (cm)
                                </h3>
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest font-black text-stone-500 block">Longueur max</label>
                                        <input
                                            type="number"
                                            value={localLongueur}
                                            onChange={(e) => setLocalLongueur(e.target.value)}
                                            onBlur={() => handleDimensionApply('longueur', localLongueur)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleDimensionApply('longueur', localLongueur)}
                                            className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:ring-2 focus:ring-stone-900 transition-all font-bold text-sm"
                                            placeholder="ex: 300"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest font-black text-stone-500 block">Largeur max</label>
                                        <input
                                            type="number"
                                            value={localLargeur}
                                            onChange={(e) => setLocalLargeur(e.target.value)}
                                            onBlur={() => handleDimensionApply('largeur', localLargeur)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleDimensionApply('largeur', localLargeur)}
                                            className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:ring-2 focus:ring-stone-900 transition-all font-bold text-sm"
                                            placeholder="ex: 200"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1 relative min-h-[400px]">
                        {/* Top progress bar for loading */}
                        <div className="absolute top-0 left-0 right-0 h-0.5 overflow-hidden z-30">
                            <motion.div 
                                initial={{ x: "-100%" }}
                                animate={{ x: loading ? "0%" : "100%" }}
                                transition={{ 
                                    duration: loading ? 2 : 0.5, 
                                    ease: loading ? "linear" : "easeOut",
                                    repeat: loading ? Infinity : 0
                                }}
                                className="h-full bg-primary"
                            />
                        </div>

                        {/* Loading Overlay */}
                        {loading && products.length > 0 && (
                            <div className="absolute inset-0 z-20 bg-stone-50/30 backdrop-blur-[2px] flex items-center justify-center rounded-3xl transition-opacity duration-300">
                                <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-xl flex items-center gap-4 border border-white">
                                    <Loader2 className="w-5 h-5 text-stone-900 animate-spin" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-900">Mise à jour...</span>
                                </div>
                            </div>
                        )}
                        
                        {(loading && products.length === 0) ? (
                            <ProductsPageSkeleton />
                        ) : (
                            <div className={`transition-all duration-500 pb-12 ${loading ? 'opacity-40 scale-[0.98]' : 'opacity-100 scale-100'}`}>
                                <div className="flex items-center justify-between mb-12">
                                    <p className="text-stone-400 text-sm font-medium italic">
                                        <span className="text-stone-900 font-bold not-italic">{pagination.total}</span> produits d'exception trouvés
                                    </p>
                                </div>

                                {products.length === 0 ? (
                                    <div className="text-center py-32 bg-white rounded-3xl border border-stone-100 shadow-sm">
                                        <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Filter className="w-8 h-8 text-stone-200" />
                                        </div>
                                        <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">Aucun résultat</h3>
                                        <p className="text-stone-500 max-w-xs mx-auto">Essayez de modifier vos filtres pour trouver le tapis idéal.</p>
                                        <button 
                                            onClick={() => router.push('/products')}
                                            className="mt-8 text-xs uppercase tracking-widest font-black text-stone-900 border-b-2 border-primary pb-1"
                                        >
                                            Voir toute la collection
                                        </button>
                                    </div>
                                ) : (
                                    <AnimatePresence mode="wait">
                                        <motion.div 
                                            key={JSON.stringify(products.map(p => p.id))}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16"
                                        >
                                            {products.map((product, idx) => (
                                                <motion.div
                                                    key={product.id}
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ duration: 0.4, delay: idx * 0.03 }}
                                                >
                                                    <ProductCard product={product} />
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    </AnimatePresence>
                                )}

                                {/* Pagination */}
                                {pagination.last_page > 1 && (
                                    <div className="mt-24 flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center transition-all hover:bg-stone-900 hover:text-white disabled:opacity-30"
                                        >
                                            <ChevronLeft size={18} />
                                        </button>

                                        {getPageNumbers().map((page, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => typeof page === 'number' && handlePageChange(page)}
                                                disabled={page === '...'}
                                                className={`w-12 h-12 rounded-full text-xs font-black transition-all ${
                                                    page === currentPage
                                                        ? 'bg-stone-900 text-white shadow-xl scale-110'
                                                        : page === '...' ? 'cursor-default' : 'hover:bg-stone-100 text-stone-600'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === pagination.last_page}
                                            className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center transition-all hover:bg-stone-900 hover:text-white disabled:opacity-30"
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-stone-50 flex items-center justify-center"><ProductsPageSkeleton /></div>}>
            <ProductsContent />
        </Suspense>
    );
}
