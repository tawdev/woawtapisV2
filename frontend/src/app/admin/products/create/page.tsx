'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminService } from '@/services/admin';
import {
    ArrowLeft,
    Save,
    Loader2,
    AlertCircle,
    X
} from 'lucide-react';
import Link from 'next/link';

const COLORS = [
    { name: 'Beige', hex: '#F5F5DC' },
    { name: 'Blanc', hex: '#FFFFFF' },
    { name: 'Bleu', hex: '#3B82F6' },
    { name: 'Vert', hex: '#10B981' },
    { name: 'Gris', hex: '#6B7280' },
    { name: 'Jaune', hex: '#FBBF24' },
    { name: 'Marron', hex: '#78350F' },
    { name: 'Noir', hex: '#000000' },
    { name: 'Orange', hex: '#F97316' },
    { name: 'Rose', hex: '#EC4899' },
];

export default function CreateProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Data for selects
    const [categories, setCategories] = useState<any[]>([]);
    const [types, setTypes] = useState<any[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<any[]>([]);
    const [isSurMesure, setIsSurMesure] = useState(false);
    const [maxLongueur, setMaxLongueur] = useState('');
    const [maxLargeur, setMaxLargeur] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        short_description: '',
        price: '',
        sale_price: '',
        stock: '0',
        status: 'active',
        type_id: '',
        category_id: '',
        material: '',
        size: '',
        color: [] as string[],
        is_featured: false,
        is_best_seller: false,
        max_longueur: '',
        max_largeur: '',
        is_couloir: false,
        is_tapis_de_lit: false,
        sub_category: '',
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catsRes] = await Promise.all([
                    adminService.getCategories(),
                ]);

                const allCats = catsRes.data;
                const uniqueTypes = Array.from(new Set(allCats.map((c: any) => JSON.stringify(c.type)))).map((t: any) => JSON.parse(t));

                setCategories(allCats);
                setTypes(uniqueTypes);
            } catch (err) {
                console.error('Failed to fetch types/categories:', err);
            }
        };
        fetchData();
    }, []);

    const selectedType = types.find(t => t.id.toString() === formData.type_id);
    const selectedCategory = categories.find(c => c.id.toString() === formData.category_id);
    
    // Check if category name OR type name contains 'moderne' AND type name contains 'stock'
    const showSubCategories = (selectedCategory?.name?.toLowerCase().includes('moderne') || 
                               selectedType?.name?.toLowerCase().includes('moderne')) && 
                               (selectedType?.name?.toLowerCase().includes('stock') || 
                                selectedCategory?.name?.toLowerCase().includes('stock'));

    useEffect(() => {
        if (formData.type_id) {
            const surMesure = selectedType?.name?.toLowerCase() === 'sur_mesure';
            setIsSurMesure(surMesure);
            if (!surMesure) {
                setMaxLongueur('');
                setMaxLargeur('');
            }
            const filtered = categories.filter(c => c.type_id.toString() === formData.type_id);
            setFilteredCategories(filtered);
            // Reset category if not in filtered list
            if (!filtered.find(c => c.id.toString() === formData.category_id)) {
                setFormData(prev => ({ ...prev, category_id: '' }));
            }
        } else {
            setIsSurMesure(false);
            setFilteredCategories([]);
            setFormData(prev => ({ ...prev, category_id: '' }));
        }
    }, [formData.type_id, categories, types, selectedType]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 1. Create product
            const response = await adminService.createProduct(formData);
            const productId = response.data.id;

            // 2. Upload image if selected
            if (imageFile && productId) {
                const imageFormData = new FormData();
                imageFormData.append('image_file', imageFile);
                await adminService.addProductImage(productId, imageFormData);
            }

            router.push('/admin/products');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Une erreur est survenue lors de la création.');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleColorToggle = (colorName: string) => {
        setFormData(prev => ({
            ...prev,
            color: prev.color.includes(colorName)
                ? prev.color.filter(c => c !== colorName)
                : [...prev.color, colorName]
        }));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/products" className="p-2 rounded-lg hover:bg-stone-100 text-stone-500">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Nouveau Produit</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-2xl border border-stone-200 space-y-6">
                        <h2 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-4">Informations Générales</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Nom du produit *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-stone-900 transition-all font-medium"
                                    placeholder="ex: Tapis Berbère Beni Ourain"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Description courte</label>
                                <textarea
                                    value={formData.short_description}
                                    onChange={e => setFormData({ ...formData, short_description: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-stone-900 transition-all text-sm"
                                    placeholder="Une brève description pour les listes..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Description complète</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-stone-900 transition-all text-sm"
                                    placeholder="L'histoire et les détails de ce tapis..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-stone-200 space-y-6">
                        <h2 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-4">Caractéristiques</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Matière</label>
                                <input
                                    type="text"
                                    value={formData.material}
                                    onChange={e => setFormData({ ...formData, material: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-stone-900 transition-all text-sm"
                                    placeholder="ex: 100% Laine vierge"
                                />
                            </div>
                            {isSurMesure ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-1">Max Longueur (cm)</label>
                                        <input
                                            type="number"
                                            value={formData.max_longueur}
                                            onChange={e => {
                                                const val = e.target.value;
                                                setFormData(prev => ({ ...prev, max_longueur: val, size: `${val}x${prev.max_largeur}` }));
                                            }}
                                            className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-stone-900 transition-all text-sm"
                                            placeholder="ex: 300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-1">Max Largeur (cm)</label>
                                        <input
                                            type="number"
                                            value={formData.max_largeur}
                                            onChange={e => {
                                                const val = e.target.value;
                                                setFormData(prev => ({ ...prev, max_largeur: val, size: `${prev.max_longueur}x${val}` }));
                                            }}
                                            className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-stone-900 transition-all text-sm"
                                            placeholder="ex: 200"
                                        />
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Dimensions</label>
                                    <input
                                        type="text"
                                        value={formData.size}
                                        onChange={e => setFormData({ ...formData, size: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-stone-900 transition-all text-sm"
                                        placeholder="ex: 200 x 300 cm"
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-3">Couleurs</label>
                            <div className="flex flex-wrap gap-2">
                                {COLORS.map(color => (
                                    <button
                                        key={color.name}
                                        type="button"
                                        onClick={() => handleColorToggle(color.name)}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-xs font-bold ${formData.color.includes(color.name)
                                                ? 'bg-stone-900 border-stone-900 text-white'
                                                : 'bg-white border-stone-200 text-stone-600 hover:border-stone-400'
                                            }`}
                                    >
                                        <span
                                            className="w-3 h-3 rounded-full border border-black/10"
                                            style={{ backgroundColor: color.hex }}
                                        ></span>
                                        {color.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-6">
                        <h2 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-4">Organisation</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Type *</label>
                                <select
                                    required
                                    value={formData.type_id}
                                    onChange={e => setFormData({ ...formData, type_id: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-stone-900 transition-all text-sm font-medium appearance-none"
                                >
                                    <option value="">Sélectionnez un type</option>
                                    {types.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Catégorie *</label>
                                <select
                                    required
                                    disabled={!formData.type_id}
                                    value={formData.category_id}
                                    onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-stone-900 transition-all text-sm font-medium appearance-none disabled:opacity-50"
                                >
                                    <option value="">Sélectionnez une catégorie</option>
                                    {filteredCategories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Statut</label>
                                <select
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-stone-900 transition-all text-sm font-semibold"
                                >
                                    <option value="active" className="font-bold text-green-600">Actif</option>
                                    <option value="inactive" className="font-bold text-red-600">Inactif</option>
                                </select>
                            </div>

                            {/* Dynamic Sub-categories */}
                            {showSubCategories && (
                                <div className="pt-4 border-t border-stone-100">
                                    <label className="block text-[10px] uppercase tracking-widest font-black text-primary mb-2">Sous-Catégorie Moderne</label>
                                    <select
                                        value={formData.sub_category}
                                        onChange={e => setFormData({ ...formData, sub_category: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-primary/5 border border-primary/20 rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all text-sm font-bold text-primary"
                                    >
                                        <option value="">Standard (Aucune)</option>
                                        <option value="home_elegance">Home Elegance</option>
                                        <option value="kids_tapis">Kids Tapis</option>
                                        <option value="tapis_moquette">Tapis Moquette</option>
                                    </select>
                                </div>
                            )}

                            {/* Runner and Bedside checkboxes */}
                            <div className="pt-4 border-t border-stone-100 space-y-3">
                                <label className="block text-[10px] uppercase tracking-widest font-black text-stone-400 mb-2">Options spéciales</label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input 
                                        type="checkbox"
                                        checked={formData.is_couloir}
                                        onChange={e => setFormData({ ...formData, is_couloir: e.target.checked })}
                                        className="w-5 h-5 rounded border-stone-300 text-stone-900 focus:ring-stone-900" 
                                    />
                                    <span className="text-sm font-medium text-stone-700 group-hover:text-stone-900 transition-colors">Tapis de Couloir</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input 
                                        type="checkbox"
                                        checked={formData.is_tapis_de_lit}
                                        onChange={e => setFormData({ ...formData, is_tapis_de_lit: e.target.checked })}
                                        className="w-5 h-5 rounded border-stone-300 text-stone-900 focus:ring-stone-900" 
                                    />
                                    <span className="text-sm font-medium text-stone-700 group-hover:text-stone-900 transition-colors">Tapis de Lit / Descente</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-6">
                        <h2 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-4">Image Principale</h2>
                        
                        <div className="space-y-4">
                            {imagePreview ? (
                                <div className="relative aspect-square rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                                    <img 
                                        src={imagePreview} 
                                        alt="Preview" 
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImageFile(null);
                                            setImagePreview('');
                                        }}
                                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center aspect-square rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50 hover:bg-stone-100 hover:border-stone-300 transition-all cursor-pointer group">
                                    <div className="flex flex-col items-center gap-2 text-stone-500 group-hover:text-stone-700">
                                        <div className="p-3 bg-white rounded-xl shadow-sm border border-stone-100 group-hover:scale-110 transition-transform">
                                            <Save className="w-6 h-6 text-stone-400" />
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-widest mt-2">Ajouter une image</span>
                                        <span className="text-[10px] opacity-60">JPG, PNG ou WebP seulement</span>
                                    </div>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleImageChange} 
                                        className="hidden" 
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-6">
                        <h2 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-4">Prix et Stock</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Prix (MAD) *</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-stone-900 transition-all font-bold"
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Prix soldé (Optionnel)</label>
                                <input
                                    type="number"
                                    value={formData.sale_price}
                                    onChange={e => setFormData({ ...formData, sale_price: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-stone-900 transition-all text-stone-500 font-bold"
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Quantité en stock *</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.stock}
                                    onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-stone-900 transition-all font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-stone-900 text-white py-4 rounded-2xl font-bold hover:bg-stone-800 transition-all shadow-lg shadow-stone-200 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                        Enregistrer le produit
                    </button>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            {error}
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}
