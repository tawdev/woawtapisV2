'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import { productService, categoryService } from '@/services/api';
import { useRouter } from 'next/navigation';
import { Filter, ChevronRight } from 'lucide-react';

const COLORS = [
    { name: 'Beige', hex: '#F5F5DC' },
    { name: 'Blanc', hex: '#E8E8E8' },
    { name: 'Bleu', hex: '#3B82F6' },
    { name: 'Vert', hex: '#10B981' },
    { name: 'Gris', hex: '#9CA3AF' },
    { name: 'Jaune', hex: '#FBBF24' },
    { name: 'Marron', hex: '#78350F' },
    { name: 'Noir', hex: '#171717' },
    { name: 'Orange', hex: '#F97316' },
    { name: 'Rose', hex: '#EC4899' },
    { name: 'Rouge', hex: '#EF4444' },
    { name: 'Violet', hex: '#8B5CF6' },
    { name: 'Turquoise', hex: '#14B8A6' },
];

function ProductsContent() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [hasMore, setHasMore] = useState(false);

    const router = useRouter();
    const type = searchParams.get('type');
    const catParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    const colorsParam = searchParams.get('colors') || '';
    const selectedColors = colorsParam ? colorsParam.split(',').filter(Boolean) : [];

    const toggleColor = (colorName: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const next = selectedColors.includes(colorName)
            ? selectedColors.filter(c => c !== colorName)
            : [...selectedColors, colorName];
        if (next.length === 0) {
            params.delete('colors');
        } else {
            params.set('colors', next.join(','));
        }
        params.delete('page');
        router.push(`/products?${params.toString()}`);
    };

    useEffect(() => {
        async function loadInitialData() {
            setLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams(searchParams.toString());
                params.set('page', '1');
                
                const [productsData, categoriesData] = await Promise.all([
                    productService.getAll(params.toString()),
                    categoryService.getAll(),
                ]);

                const productList = productsData.data || (Array.isArray(productsData) ? productsData : []);
                setProducts(productList);
                setCategories(Array.isArray(categoriesData) ? categoriesData : []);
                
                setTotalItems(productsData.total || productList.length);
                setHasMore(productsData.last_page ? 1 < productsData.last_page : false);
                setPage(1);
            } catch (err: any) {
                console.error("Failed to load products:", err);
                setError("Impossible de charger les produits. Veuillez réessayer plus tard.");
            } finally {
                setLoading(false);
            }
        }
        loadInitialData();
    }, [searchParams]);

    const handleLoadMore = async () => {
        setLoadingMore(true);
        try {
            const nextPage = page + 1;
            const params = new URLSearchParams(searchParams.toString());
            params.set('page', nextPage.toString());
            
            const productsData = await productService.getAll(params.toString());
            const productList = productsData.data || (Array.isArray(productsData) ? productsData : []);
            
            setProducts(prev => [...prev, ...productList]);
            setPage(nextPage);
            setHasMore(productsData.last_page ? nextPage < productsData.last_page : false);
        } catch (err) {
            console.error("Failed to load more products:", err);
        } finally {
            setLoadingMore(false);
        }
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

            <main className="container mx-auto px-4 py-24">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Sidebar / Filters - sticky */}
                    <aside className="w-full lg:w-64 shrink-0">
                        <div className="lg:sticky lg:top-28 space-y-6">
                            {/* Categories Card */}
                            <div className="p-6 bg-white border border-stone-100 shadow-sm">
                                <h3 className="text-xs uppercase tracking-[0.3em] font-black text-stone-900 mb-6 pb-4 border-b border-stone-100 flex items-center gap-2">
                                    <Filter size={14} className="text-primary" /> Catégories
                                </h3>
                                <ul className="space-y-4">
                                    <li>
                                        <Link href="/products" className={`text-xs uppercase tracking-widest hover:text-primary transition-all duration-300 flex justify-between items-center group ${!catParam ? 'text-primary font-black' : 'text-stone-500 font-bold'}`}>
                                            <span>Tous les Tapis</span>
                                            <ChevronRight size={12} className={`transition-transform duration-300 group-hover:translate-x-1 ${!catParam ? 'opacity-100' : 'opacity-0'}`} />
                                        </Link>
                                    </li>
                                    {categories.map((cat: any) => (
                                        <li key={cat.id}>
                                            <Link
                                                href={`/products?category=${cat.id}`}
                                                className={`text-xs uppercase tracking-widest hover:text-primary transition-all duration-300 flex justify-between items-center group ${catParam === String(cat.id) ? 'text-primary font-black' : 'text-stone-500 font-bold'}`}
                                            >
                                                <span>{cat.name}</span>
                                                <ChevronRight size={12} className={`transition-transform duration-300 group-hover:translate-x-1 ${catParam === String(cat.id) ? 'opacity-100' : 'opacity-0'}`} />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Color Filter */}
                            <div className="p-6 bg-white border border-stone-100 shadow-sm">
                                <h3 className="text-xs uppercase tracking-[0.3em] font-black text-stone-900 mb-6 pb-4 border-b border-stone-100">
                                    Couleurs
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {selectedColors.length > 0 && (
                                        <button
                                            onClick={() => {
                                                const params = new URLSearchParams(searchParams.toString());
                                                params.delete('colors');
                                                router.push(`/products?${params.toString()}`);
                                            }}
                                            className="text-[10px] uppercase tracking-widest font-bold text-primary hover:underline block w-full text-left mb-2"
                                        >
                                            × Effacer ({selectedColors.length})
                                        </button>
                                    )}
                                    {COLORS.map((color) => {
                                        const isSelected = selectedColors.includes(color.name);
                                        return (
                                            <button
                                                key={color.name}
                                                title={color.name}
                                                onClick={() => toggleColor(color.name)}
                                                className={`w-7 h-7 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
                                                    isSelected
                                                        ? 'border-primary scale-110 ring-2 ring-primary/30'
                                                        : 'border-stone-200'
                                                }`}
                                                style={{ backgroundColor: color.hex }}
                                            />
                                        );
                                    })}
                                </div>
                                {selectedColors.length > 0 && (
                                    <p className="text-[10px] text-stone-400 mt-3 font-bold uppercase tracking-widest">
                                        Filtre: {selectedColors.join(', ')}
                                    </p>
                                )}
                            </div>
                            <div className="p-6 bg-stone-900 text-white shadow-xl">
                                <h3 className="text-xs uppercase tracking-[0.3em] font-black text-primary mb-4">Personnalisation</h3>
                                <p className="text-xs text-stone-400 leading-relaxed mb-4 font-light">Besoin d&apos;une dimension particulière ou d&apos;un motif unique ?</p>
                                <Link href="/products?type=sur_mesure" className="block text-center border border-white/20 py-3 text-[10px] uppercase tracking-widest font-black hover:bg-white hover:text-stone-900 transition-all duration-500">
                                    Créer mon Tapis
                                </Link>
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-12 pb-6 border-b border-stone-100">
                            <p className="text-[10px] uppercase tracking-widest font-black text-stone-400">
                                <span className="text-stone-900">{totalItems}</span> Trésors Identifiés
                            </p>
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] uppercase tracking-widest font-black text-stone-400">Trier par:</span>
                                <select className="bg-transparent border-none text-[10px] uppercase tracking-widest font-black text-stone-900 focus:ring-0 outline-none cursor-pointer">
                                    <option>Séléction Exclusive</option>
                                    <option>Prix Croissant</option>
                                    <option>Prix Décroissant</option>
                                </select>
                            </div>
                        </div>

                        {error ? (
                            <div className="text-center py-32 bg-white border border-stone-100 luxury-glass">
                                <p className="text-stone-900 font-serif text-xl italic mb-6">{error}</p>
                                <button onClick={() => window.location.reload()} className="btn-premium">Réessayer la recherche</button>
                            </div>
                        ) : loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="aspect-[4/5] bg-white animate-pulse" />
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <div className="space-y-16">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {products.map((product: any) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {hasMore && (
                                    <div className="text-center pt-8 border-t border-stone-100">
                                        <button
                                            onClick={handleLoadMore}
                                            disabled={loadingMore}
                                            className="btn-premium disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loadingMore ? 'Chargement...' : 'Découvrir Plus de Pièces'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-40 bg-white border border-stone-100">
                                <div className="w-16 h-[1px] bg-stone-200 mx-auto mb-10" />
                                <h3 className="text-3xl font-serif font-bold text-stone-900 mb-4 block italic">Aucune pièce trouvée</h3>
                                <p className="text-stone-400 text-sm font-light tracking-wide uppercase mb-10">Affinez vos critères pour découvrir l&apos;exception.</p>
                                <Link href="/products" className="btn-premium">
                                    Réinitialiser les filtres
                                </Link>
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
        <Suspense fallback={<div>Chargement...</div>}>
            <ProductsContent />
        </Suspense>
    );
}
