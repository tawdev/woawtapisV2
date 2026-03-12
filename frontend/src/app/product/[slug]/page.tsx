'use client';

import { useEffect, useState, use } from 'react';

const COLOR_MAP: Record<string, string> = {
    'Beige': '#F5F5DC',
    'Blanc': '#FFFFFF',
    'Bleu': '#3B82F6',
    'Vert': '#10B981',
    'Gris': '#6B7280',
    'Jaune': '#FBBF24',
    'Marron': '#78350F',
    'Noir': '#171717',
    'Orange': '#F97316',
    'Rose': '#EC4899',
    'Rouge': '#EF4444',
    'Violet': '#8B5CF6',
    'Turquoise': '#14B8A6',
};
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { productService, getImageUrl } from '@/services/api';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, ChevronRight, ChevronLeft, Heart, Share2, Ruler, ShieldCheck, Truck, Star, X } from 'lucide-react';
import Link from 'next/link';
import SurMesureModal from '@/components/product/SurMesureModal';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const { addToCart } = useCart();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                const data = await productService.getBySlug(slug);
                setProduct(data);
                
                // Read favorites from localStorage
                if (data && data.id) {
                    const savedFavorites = JSON.parse(localStorage.getItem('waootapis_favorites') || '[]');
                    setIsFavorite(savedFavorites.includes(data.id));
                }
            } catch (error) {
                console.error("Failed to load product:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [slug]);

    const handleAddToCart = () => {
        if (product?.type?.name === 'sur_mesure') {
            setIsModalOpen(true);
        } else {
            addToCart(product);
        }
    };

    const handleFavorite = () => {
        if (!product) return;

        const newStatus = !isFavorite;
        setIsFavorite(newStatus);
        
        const savedFavorites = JSON.parse(localStorage.getItem('waootapis_favorites') || '[]');
        if (newStatus) {
            if (!savedFavorites.includes(product.id)) {
                savedFavorites.push(product.id);
            }
        } else {
            const index = savedFavorites.indexOf(product.id);
            if (index > -1) {
                savedFavorites.splice(index, 1);
            }
        }
        localStorage.setItem('waootapis_favorites', JSON.stringify(savedFavorites));
        
        // Dispatch an event so other components (e.g. Header) can update if needed
        window.dispatchEvent(new Event('favoritesUpdated'));
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: product.short_description || `Découvrez ce magnifique tapis : ${product.name}`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback: Copy to clipboard
            try {
                await navigator.clipboard.writeText(window.location.href);
                alert('Lien copié dans le presse-papier !');
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    };





    if (loading) return (
        <div className="min-h-screen bg-stone-50">
            <Header />
            <div className="container mx-auto py-40 animate-pulse space-y-8">
                <div className="h-96 bg-stone-200 w-full rounded-sm" />
                <div className="h-12 bg-stone-200 w-1/2 rounded-sm" />
            </div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen bg-stone-50">
            <Header />
            <div className="container mx-auto py-40 text-center">
                <h1 className="text-3xl font-serif font-bold text-stone-900 mb-6 italic">Trésor non localisé</h1>
                <Link href="/products" className="btn-premium">Retour au Catalogue</Link>
            </div>
        </div>
    );

    const images = product.images?.length > 0 ? product.images : [{ image_path: 'images/placeholder.jpg' }];

    return (
        <div className="min-h-screen bg-stone-50">
            <Header />

            {/* Breadcrumbs */}
            <nav className="container mx-auto px-4 py-12 pt-32">
                <ol className="flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-black text-stone-400">
                    <li><Link href="/" className="hover:text-primary transition-colors">Accueil</Link></li>
                    <li><ChevronRight size={12} className="text-stone-300" /></li>
                    <li><Link href="/products" className="hover:text-primary transition-colors">Collections</Link></li>
                    <li><ChevronRight size={12} className="text-stone-300" /></li>
                    <li className="text-stone-900">{product.name}</li>
                </ol>
            </nav>

            <main className="container mx-auto px-4 pb-40">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">

                    {/* Gallery: 7 Columns */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="aspect-[4/5] bg-white overflow-hidden relative group peer">
                            <img
                                src={getImageUrl(images[activeImage].image_path)}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />

                            <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-all duration-500">
                                <button onClick={() => setActiveImage(prev => prev > 0 ? prev - 1 : images.length - 1)} className="p-4 bg-white/90 backdrop-blur-xl border border-stone-100 hover:bg-primary hover:text-white transition-all duration-500 rounded-full shadow-2xl">
                                    <ChevronLeft size={24} />
                                </button>
                                <button onClick={() => setActiveImage(prev => (prev + 1) % images.length)} className="p-4 bg-white/90 backdrop-blur-xl border border-stone-100 hover:bg-primary hover:text-white transition-all duration-500 rounded-full shadow-2xl">
                                    <ChevronRight size={24} />
                                </button>
                            </div>

                            {/* Luxury Badge */}
                            <div className="absolute top-8 left-8 p-4 luxury-glass text-white text-[9px] uppercase tracking-[0.3em] font-black">
                                Pièce Unique
                            </div>
                        </div>

                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-6">
                                {images.map((img: any, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`aspect-square overflow-hidden border transition-all duration-700 ${activeImage === idx ? 'border-primary opacity-100 scale-95' : 'border-transparent opacity-50 grayscale hover:grayscale-0 hover:opacity-100'}`}
                                    >
                                        <img src={getImageUrl(img.image_path)} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info: 5 Columns */}
                    <div className="lg:col-span-5 space-y-12 lg:sticky lg:top-40">
                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <div className="space-y-2">
                                    <div className="flex gap-1 text-primary">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} fill="currentColor" />)}
                                    </div>
                                    <p className="text-[10px] uppercase tracking-[0.4em] font-black text-primary">
                                        {product.category?.name || 'Exception Artisanale'}
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <button 
                                        onClick={handleFavorite}
                                        className={`p-3 bg-white border border-stone-100 rounded-full transition-all duration-500 shadow-sm ${isFavorite ? 'text-primary border-primary bg-primary/5' : 'hover:text-primary'}`}
                                    >
                                        <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
                                    </button>
                                    <button 
                                        onClick={handleShare}
                                        className="p-3 bg-white border border-stone-100 rounded-full hover:text-primary transition-all duration-500 shadow-sm"
                                    >
                                        <Share2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <h1 className="text-5xl md:text-6xl font-serif font-bold text-stone-900 leading-[0.9] italic">
                                {product.name}
                            </h1>

                            <div className="flex items-baseline gap-6 border-b border-stone-100 pb-8">
                                <span className="text-4xl font-serif font-bold text-stone-900 tracking-tighter">
                                    {product.sale_price || product.price} MAD {product.type?.name === 'sur_mesure' ? '/ m²' : ''}
                                </span>
                                {product.sale_price && (
                                    <span className="text-xl text-stone-300 line-through font-serif italic">
                                        {product.price} MAD
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-8">
                            <p className="text-stone-500 leading-relaxed font-light text-sm">
                                {product.description || "Une œuvre d'art tissée à la main, alliant des siècles de tradition berbère à une esthétique contemporaine raffinée. Chaque pièce est unique, porteuse de l'âme de son créateur."}
                            </p>

                            {/* Color Swatches */}
                            {product.color && product.color.length > 0 && (
                                <div>
                                    <p className="text-[9px] uppercase tracking-widest text-stone-400 font-bold mb-3">Couleurs disponibles</p>
                                    <div className="flex flex-wrap gap-3">
                                        {product.color.map((colorItem: any, idx: number) => {
                                            const colorName = typeof colorItem === 'string' ? colorItem : (colorItem?.name || '');
                                            if (!colorName) return null;
                                            
                                            return (
                                                <div key={`${colorName}-${idx}`} className="flex items-center gap-2 group">
                                                    <span
                                                        className="w-6 h-6 rounded-full border-2 border-stone-200 shadow-sm transition-transform duration-300 group-hover:scale-110"
                                                        style={{ backgroundColor: COLOR_MAP[colorName] || '#ccc' }}
                                                        title={colorName}
                                                    />
                                                    <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">{colorName}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 bg-white border border-stone-100 space-y-2 shadow-sm">
                                    <Ruler size={16} className="text-primary" />
                                    <p className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Dimensions</p>
                                    <p className="text-sm font-serif font-bold text-stone-900">
                                        {product.type?.name === 'sur_mesure' ? (
                                            <>Max: {product.max_longueur}x{product.max_largeur} cm</>
                                        ) : (
                                            <>{product.size} cm</>
                                        )}
                                    </p>
                                </div>
                                <div className="p-6 bg-white border border-stone-100 space-y-2 shadow-sm">
                                    <div className="w-4 h-4 rounded-full border border-stone-200" style={{ backgroundColor: '#d6ccc2' }} />
                                    <p className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Matière</p>
                                    <p className="text-sm font-serif font-bold text-stone-900">{product.material || 'Laine Vierge'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-6 pt-4">
                            <button
                                onClick={handleAddToCart}
                                className="btn-premium w-full py-6 text-xs flex items-center justify-center gap-4 group"
                            >
                                <ShoppingBag size={18} className="transition-transform duration-500 group-hover:-translate-y-1" />
                                Faire Acquisition
                            </button>
                            {product.type?.name === 'sur_mesure' && (
                                <button 
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full bg-transparent border border-stone-200 text-stone-900 text-[10px] uppercase tracking-[0.3em] font-black py-6 hover:bg-stone-50 transition-all duration-500"
                                >
                                    Demander un Devis Sur Mesure
                                </button>
                            )}
                        </div>

                        {/* Premium Guarantees */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-stone-100">
                            <div className="flex items-start gap-5">
                                <div className="p-4 bg-stone-100 rounded-px"><Truck size={20} className="text-stone-900" /></div>
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-900 mb-1">Livraison Sécurisée</h4>
                                    <p className="text-[10px] text-stone-400 uppercase tracking-tighter">Sous 4 à 7 jours ouvrés.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-5">
                                <div className="p-4 bg-stone-100 rounded-px"><ShieldCheck size={20} className="text-stone-900" /></div>
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-900 mb-1">Certificat Authentique</h4>
                                    <p className="text-[10px] text-stone-400 uppercase tracking-tighter">Inclus avec chaque pièce.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            <SurMesureModal 
                product={product}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={addToCart}
            />
        </div>
    );
}
