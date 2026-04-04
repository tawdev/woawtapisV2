'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Eye, Share2, Ruler } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getImageUrl } from '@/services/api';
import SurMesureModal from './SurMesureModal';

const COLOR_MAP: Record<string, string> = {
    'Beige': '#F5F5DC', 'Blanc': '#E8E8E8', 'Bleu': '#3B82F6',
    'Vert': '#10B981', 'Gris': '#9CA3AF', 'Jaune': '#FBBF24',
    'Marron': '#78350F', 'Noir': '#171717', 'Orange': '#F97316',
    'Rose': '#EC4899', 'Rouge': '#EF4444', 'Violet': '#8B5CF6',
    'Turquoise': '#14B8A6',
};

interface ProductCardProps {
    product: {
        id: number;
        name: string;
        slug: string;
        price: string | number;
        sale_price?: string | number;
        size?: string;
        category?: { name: string };
        images?: { image_path: string }[];
        type?: { name: string };
        color?: string[] | any[];
        max_longueur?: number;
        max_largeur?: number;
    };
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const primaryImage = getImageUrl(product.images?.[0]?.image_path);
    const hasSale = !!product.sale_price;

    const handleShare = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const url = `${window.location.origin}/product/${product.slug}`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: product.name,
                    url: url,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(url);
                alert('Lien copié dans le presse-papier !');
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    };

    return (
        <div className="group relative bg-white rounded-[2rem] border border-stone-100 overflow-hidden transition-all duration-700 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] hover:-translate-y-1 h-full flex flex-col">
            {/* Image Container with Luxury Overlay */}
            <Link href={`/product/${product.slug}`} className="block aspect-[4/5] overflow-hidden bg-stone-100 relative">
                <img
                    src={primaryImage}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/placeholder.jpg';
                    }}
                />

                {/* Brand Overlay on Hover */}
                <div className="absolute inset-0 bg-stone-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="absolute inset-x-0 top-0 p-6 flex justify-between items-start z-20">
                    {hasSale ? (
                        <span className="bg-primary text-white text-[8px] uppercase tracking-[0.3em] font-black px-4 py-2 rounded-full shadow-2xl backdrop-blur-md">
                            Selection Noire
                        </span>
                    ) : <div />}

                    {product.type?.name === 'sur_mesure' && (
                        <span className="bg-white/90 backdrop-blur-md text-stone-900 text-[8px] uppercase tracking-[0.3em] font-black px-4 py-2 rounded-full shadow-2xl border border-white/20">
                            Sur Mesure
                        </span>
                    )}
                </div>

                {/* Action Buttons Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-8 group-hover:translate-y-0 z-20">
                    <div className="flex items-center gap-2 p-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl">
                        <div 
                            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-stone-900 hover:bg-primary hover:text-white transition-all shadow-xl cursor-pointer"
                            title="Voir les détails"
                        >
                            <Eye size={18} strokeWidth={1.5} />
                        </div>
                        
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (product.type?.name === 'sur_mesure') {
                                    setIsModalOpen(true);
                                } else {
                                    addToCart(product);
                                }
                            }}
                            className="h-12 px-8 bg-stone-900 text-white text-[9px] uppercase tracking-[0.25em] font-black hover:bg-primary transition-all flex items-center gap-3 shadow-xl rounded-full focus:outline-none"
                        >
                            <ShoppingCart size={14} />
                            <span>{product.type?.name === 'sur_mesure' ? 'Personnaliser' : 'Ajouter'}</span>
                        </button>
                        
                        <button
                            onClick={handleShare}
                            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-stone-900 hover:bg-primary hover:text-white transition-all shadow-xl focus:outline-none"
                            title="Partager"
                        >
                            <Share2 size={18} strokeWidth={1.5} />
                        </button>
                    </div>
                </div>
            </Link>

            <SurMesureModal 
                product={product}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={addToCart}
            />

            {/* Premium Info */}
            <div className="p-8 space-y-6 bg-white relative z-10 flex-1 flex flex-col justify-between">
                <div className="space-y-3 text-center">
                    <p className="text-[9px] uppercase tracking-[0.4em] text-primary font-black opacity-80">
                        {product.category?.name || 'Artisanat Marocain'}
                    </p>
                    <Link href={`/product/${product.slug}`} className="block">
                        <h3 className="text-xl font-serif font-bold text-stone-900 hover:text-primary transition-colors duration-500 italic leading-tight">
                            {product.name}
                        </h3>
                    </Link>
                    
                    <div className="flex items-center justify-center gap-3">
                        {product.size && (
                            <span className="inline-flex items-center gap-2 text-[9px] uppercase tracking-widest font-black text-stone-400 bg-stone-50 border border-stone-100/50 px-3 py-1.5 rounded-full">
                                <Ruler size={10} />
                                {product.size.replace(/x/i, ' × ')} cm
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex flex-col items-center gap-4 pt-6 border-t border-stone-50">
                    <div className="flex items-center justify-center gap-4">
                        {hasSale ? (
                            <>
                                <span className="text-2xl font-playfair font-black text-primary">
                                    {product.sale_price} <span className="text-[10px] ml-1">MAD</span>
                                </span>
                                <span className="text-sm text-stone-300 line-through tracking-tighter font-medium">{product.price} MAD</span>
                            </>
                        ) : (
                            <span className="text-2xl font-playfair font-black text-stone-900">
                                {product.price} <span className="text-[10px] ml-1">MAD</span>
                                {product.type?.name === 'sur_mesure' && <span className="text-[10px] text-stone-400 font-light ml-2 italic">/ m²</span>}
                            </span>
                        )}
                    </div>

                    {/* Color Swatches */}
                    {product.color && product.color.length > 0 && (
                        <div className="flex items-center justify-center gap-1.5">
                            {product.color.slice(0, 5).map((c: any, i: number) => {
                                const colorName = typeof c === 'string' ? c : (c?.name || '');
                                const hex = COLOR_MAP[colorName];
                                if (!hex || !colorName) return null;
                                return (
                                    <div
                                        key={i}
                                        title={colorName}
                                        className="w-2.5 h-2.5 rounded-full ring-2 ring-transparent ring-offset-2 transition-all hover:ring-primary cursor-help"
                                        style={{ backgroundColor: hex }}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
