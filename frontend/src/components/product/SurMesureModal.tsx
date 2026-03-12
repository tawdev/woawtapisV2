'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, X, Ruler, Info } from 'lucide-react';

interface SurMesureModalProps {
    product: any;
    isOpen: boolean;
    onClose: () => void;
    onAdd: (product: any, quantity: number, dimensions: { longueur: number; largeur: number }) => void;
}

export default function SurMesureModal({ product, isOpen, onClose, onAdd }: SurMesureModalProps) {
    const [customL, setCustomL] = useState('');
    const [customl, setCustoml] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Reset fields when modal opens
    useEffect(() => {
        if (isOpen) {
            setCustomL('');
            setCustoml('');
            setError(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const minL = 50;
    const minl = 50;
    const maxL = product.max_longueur || 600;
    const maxl = product.max_largeur || 400;

    const handleLChange = (val: string) => {
        setCustomL(val);
        setError(null);
    };

    const handlelChange = (val: string) => {
        setCustoml(val);
        setError(null);
    };

    const calculateSurface = () => {
        const L = parseFloat(customL) || 0;
        const l = parseFloat(customl) || 0;
        return (L * l) / 10000;
    };

    const calculateCurrentTotal = () => {
        const area = calculateSurface();
        const pricePerM2 = parseFloat(product.sale_price || product.price);
        return area * pricePerM2;
    };

    const handleSubmit = () => {
        const L = parseFloat(customL);
        const l = parseFloat(customl);
        
        if (!L || !l) {
            setError('Veuillez saisir des dimensions valides.');
            return;
        }

        if (L < minL || l < minl) {
            setError(`Les dimensions minimales sont de ${minL} x ${minl} cm.`);
            return;
        }

        if (L > maxL || l > maxl) {
            setError(`Les dimensions maximales pour ce modèle sont de ${maxL} x ${maxl} cm.`);
            return;
        }

        onAdd(product, 1, { longueur: L, largeur: l });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-md" onClick={onClose} />
            <div className="relative bg-white w-full max-w-xl overflow-hidden rounded-sm shadow-2xl animate-in fade-in zoom-in duration-500">
                {/* Header Decoration */}
                <div className="h-2 bg-primary w-full" />
                
                <div className="p-8 sm:p-12 space-y-10">
                    <button 
                        onClick={onClose}
                        className="absolute top-8 right-8 p-2 text-stone-400 hover:text-stone-900 transition-colors bg-stone-50 rounded-full"
                    >
                        <X size={20} />
                    </button>

                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-primary">
                            <Ruler size={18} />
                            <h2 className="text-3xl font-serif font-bold text-stone-900 italic">Sur Mesure</h2>
                        </div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold">
                            Personnalisez les dimensions de votre pièce unique : <span className="text-stone-900">{product.name}</span>
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-6 animate-in slide-in-from-top-4 duration-300">
                            <div className="flex items-start gap-4">
                                <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                                <p className="text-xs uppercase tracking-widest text-red-700 font-bold leading-relaxed">
                                    {error}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <label className="text-[10px] uppercase tracking-widest text-stone-900 font-black">Longueur</label>
                                <span className="text-[9px] text-stone-400 font-bold uppercase italic">Max {maxL} cm</span>
                            </div>
                            <div className="relative">
                                <input 
                                    type="number"
                                    value={customL}
                                    onChange={(e) => handleLChange(e.target.value)}
                                    placeholder="250"
                                    className="w-full bg-stone-50 border-b-2 border-stone-100 p-5 focus:border-primary outline-none transition-all font-serif italic text-2xl pr-12 text-stone-900"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 font-serif italic">cm</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <label className="text-[10px] uppercase tracking-widest text-stone-900 font-black">Largeur</label>
                                <span className="text-[9px] text-stone-400 font-bold uppercase italic">Max {maxl} cm</span>
                            </div>
                            <div className="relative">
                                <input 
                                    type="number"
                                    value={customl}
                                    onChange={(e) => handlelChange(e.target.value)}
                                    placeholder="180"
                                    className="w-full bg-stone-50 border-b-2 border-stone-100 p-5 focus:border-primary outline-none transition-all font-serif italic text-2xl pr-12 text-stone-900"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 font-serif italic">cm</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-stone-50 p-8 rounded-sm space-y-6">
                        <div className="flex justify-between items-center group">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Prix de l'artisanat</span>
                                <div className="group-hover:block hidden p-2 bg-stone-900 text-white text-[8px] absolute mb-12 rounded">Prix par mètre carré</div>
                            </div>
                            <span className="text-stone-900 font-bold text-sm tracking-tight">{parseFloat(product.sale_price || product.price).toLocaleString()} MAD / m²</span>
                        </div>
                        
                        <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-stone-400 font-bold border-t border-stone-200/50 pt-4">
                            <span>Surface calculée</span>
                            <span className="text-stone-900">{calculateSurface().toFixed(2)} m²</span>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                            <span className="text-xs uppercase tracking-[0.2em] text-stone-900 font-black">Investissement Total</span>
                            <div className="text-right">
                                <span className="text-3xl font-serif font-bold text-primary italic">
                                    {calculateCurrentTotal().toLocaleString('fr-FR', { minimumFractionDigits: 0 })} MAD
                                </span>
                                <p className="text-[8px] text-stone-400 uppercase tracking-tighter mt-1">TVA et transport inclus</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button 
                            onClick={handleSubmit}
                            className="btn-premium w-full py-6 text-xs flex items-center justify-center gap-4 group"
                        >
                            <ShoppingBag size={18} className="transition-transform duration-500 group-hover:-translate-y-1" />
                            Acquérir cette pièce sur mesure
                        </button>
                        
                        <div className="flex items-start gap-3 px-4">
                            <Info size={12} className="text-primary mt-0.5 shrink-0" />
                            <p className="text-[9px] text-stone-400 uppercase leading-loose font-medium">
                                Le délai de confection pour un tapis sur mesure est de <span className="text-stone-600 font-bold">4 à 6 semaines</span>. Nos artisans mettront tout leur cœur dans votre création.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
