'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Eye, Share2 } from 'lucide-react';
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
        <div className="group relative bg-white border border-stone-100 overflow-hidden transition-all duration-1000 hover:shadow-2xl hover:shadow-stone-200/50">
            {/* Image Container with Luxury Overlay */}
            <Link href={`/product/${product.slug}`} className="block aspect-[4/5] overflow-hidden bg-stone-100 relative">
                <Image
                    src={primaryImage}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.srcset = '';
                        target.src = '/images/placeholder.jpg';
                    }}
                />

                {/* Brand Overlay on Hover */}
                <div className="absolute inset-0 bg-stone-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {hasSale && (
                    <span className="absolute top-6 left-6 bg-primary text-white text-[9px] uppercase tracking-widest font-black px-4 py-2 shadow-2xl">
                        Selection Noire
                    </span>
                )}

                {product.type?.name === 'sur_mesure' && (
                    <span className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm text-stone-900 text-[9px] uppercase tracking-widest font-black px-4 py-2 shadow-2xl border border-stone-100">
                        Sur Mesure
                    </span>
                )}

                {/* Action Buttons Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0 z-20">
                    <div className="flex items-center gap-3">
                        <div 
                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-stone-900 hover:bg-primary hover:text-white transition-colors shadow-2xl cursor-pointer"
                            title="Voir les détails"
                        >
                            <Eye size={18} />
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
                            className="h-10 px-4 sm:px-6 bg-stone-900 text-white text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-primary transition-colors flex items-center gap-2 shadow-2xl rounded-full focus:outline-none"
                        >
                            <ShoppingCart size={14} />
                            <span className="hidden sm:inline">{product.type?.name === 'sur_mesure' ? 'Personnaliser' : 'Ajouter'}</span>
                        </button>
                        
                        <button
                            onClick={handleShare}
                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-stone-900 hover:bg-primary hover:text-white transition-colors shadow-2xl focus:outline-none"
                            title="Partager"
                        >
                            <Share2 size={18} />
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
            <div className="p-8 space-y-4 bg-white relative z-10 text-center">
                <div className="space-y-1">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-primary font-black">
                        {product.category?.name || 'Artisanat Marocain'}
                    </p>
                    <Link href={`/product/${product.slug}`} className="block">
                        <h3 className="text-xl font-serif font-bold text-stone-900 hover:text-primary transition-colors duration-500">
                            {product.name}
                        </h3>
                    </Link>
                </div>

                <div className="flex items-center justify-center gap-4 pt-2">
                    {hasSale ? (
                        <>
                            <span className="text-lg font-serif font-bold text-primary">
                                {product.sale_price} MAD {product.type?.name === 'sur_mesure' ? '/ m²' : ''}
                            </span>
                            <span className="text-xs text-stone-400 line-through tracking-tighter">{product.price} MAD</span>
                        </>
                    ) : (
                        <span className="text-lg font-serif font-bold text-stone-900">
                            {product.price} MAD {product.type?.name === 'sur_mesure' ? '/ m²' : ''}
                        </span>
                    )}
                </div>

                {/* Color Swatches */}
                {product.color && product.color.length > 0 && (
                    <div className="flex items-center justify-center gap-2 pt-2">
                        {product.color.slice(0, 6).map((c: any, i: number) => {
                            const colorName = typeof c === 'string' ? c : (c?.name || '');
                            const hex = COLOR_MAP[colorName];
                            if (!hex || !colorName) return null;
                            return (
                                <span
                                    key={i}
                                    title={colorName}
                                    className="w-4 h-4 rounded-full border border-stone-200 shadow-sm"
                                    style={{ backgroundColor: hex }}
                                />
                            );
                        })}
                        {product.color.length > 6 && (
                            <span className="text-[9px] text-stone-400 font-bold">+{product.color.length - 6}</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
