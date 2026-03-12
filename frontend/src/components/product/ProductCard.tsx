'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getImageUrl } from '@/services/api';
import SurMesureModal from './SurMesureModal';

interface ProductCardProps {
    product: {
        id: number;
        name: string;
        slug: string;
        price: string | number;
        sale_price?: string | number;
        category?: { name: string };
        images?: { image_path: string }[];
        type?: { name: string }; // Added type property
        max_longueur?: number;
        max_largeur?: number;
    };
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const primaryImage = getImageUrl(product.images?.[0]?.image_path);
    const hasSale = !!product.sale_price;

    return (
        <div className="group relative bg-white border border-stone-100 overflow-hidden transition-all duration-1000 hover:shadow-2xl hover:shadow-stone-200/50">
            {/* Image Container with Luxury Overlay */}
            <Link href={`/product/${product.slug}`} className="block aspect-[4/5] overflow-hidden bg-stone-100 relative">
                <img
                    src={primaryImage}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
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

                {/* Quick Add Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            if (product.type?.name === 'sur_mesure') {
                                setIsModalOpen(true);
                            } else {
                                addToCart(product);
                            }
                        }}
                        className="btn-premium flex items-center gap-2 group/btn"
                    >
                        <ShoppingCart size={14} className="transition-transform duration-500 group-hover/btn:-translate-y-1" />
                        <span>{product.type?.name === 'sur_mesure' ? 'Personnaliser' : 'Ajouter au Panier'}</span>
                    </button>
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
            </div>
        </div>
    );
}
