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
        <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in duration-700">
            <div className="flex items-center gap-6">
                <Link href="/admin/products" className="w-12 h-12 rounded-2xl bg-white border border-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-900 hover:shadow-lg transition-all">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-playfair font-bold text-stone-900 italic tracking-tight">Ajouter une Pièce</h1>
                    <p className="text-[10px] text-stone-400 font-black uppercase tracking-[0.2em] mt-1">Détails et taxonomie du tapis</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-10 rounded-[2.5rem] border border-stone-100/60 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                        <h2 className="text-2xl font-playfair font-bold text-stone-900 italic relative z-10 border-b border-stone-50 pb-6">Histoire & Descriptif</h2>

                        <div className="space-y-6 relative z-10">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-3">Nom de la pièce *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-emerald-50 focus:border-emerald-200 transition-all font-bold text-stone-900"
                                    placeholder="ex: Kilim Anatolien Vintage"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-3">Aperçu Rapide</label>
                                <textarea
                                    value={formData.short_description}
                                    onChange={e => setFormData({ ...formData, short_description: e.target.value })}
                                    rows={2}
                                    className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-stone-50 focus:border-stone-200 transition-all font-medium text-stone-700 resize-none"
                                    placeholder="Une brève description pour les listes..."
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-3">Récit Complet</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-stone-50 focus:border-stone-200 transition-all font-medium text-stone-700 resize-none"
                                    placeholder="L'histoire, les origines et les détails de conception..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[2.5rem] border border-stone-100/60 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                        <h2 className="text-2xl font-playfair font-bold text-stone-900 italic relative z-10 border-b border-stone-50 pb-6">Spécifications Techniques</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
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

                        <div className="relative z-10">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-4">Palette de Couleurs</label>
                            <div className="flex flex-wrap gap-3">
                                {COLORS.map(color => (
                                    <button
                                        key={color.name}
                                        type="button"
                                        onClick={() => handleColorToggle(color.name)}
                                        className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border transition-all text-xs font-black uppercase tracking-widest ${formData.color.includes(color.name)
                                                ? 'bg-stone-900 border-stone-900 text-white shadow-lg'
                                                : 'bg-white border-stone-200 text-stone-400 hover:border-stone-300 hover:text-stone-900'
                                            }`}
                                    >
                                        <span
                                            className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-inner"
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
                <div className="space-y-8">
                    <div className="bg-white p-10 rounded-[2.5rem] border border-stone-100/60 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] space-y-8 relative overflow-hidden">
                        <h2 className="text-2xl font-playfair font-bold text-stone-900 italic relative z-10 border-b border-stone-50 pb-6">Classification</h2>

                        <div className="space-y-6 relative z-10">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-3">Famille Racine *</label>
                                <select
                                    required
                                    value={formData.type_id}
                                    onChange={e => setFormData({ ...formData, type_id: e.target.value })}
                                    className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-emerald-50 focus:border-emerald-200 transition-all text-sm font-bold appearance-none cursor-pointer text-stone-900"
                                >
                                    <option value="">-- Collection --</option>
                                    {types.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-3">Sous-Catégorie *</label>
                                <select
                                    required
                                    disabled={!formData.type_id}
                                    value={formData.category_id}
                                    onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                                    className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-emerald-50 focus:border-emerald-200 transition-all text-sm font-bold appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-stone-900"
                                >
                                    <option value="">-- Type --</option>
                                    {filteredCategories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-3">Visibilité</label>
                                <select
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-emerald-50 focus:border-emerald-200 transition-all text-[11px] font-black uppercase tracking-widest"
                                >
                                    <option value="active" className="text-emerald-600">Publié</option>
                                    <option value="inactive" className="text-red-500">Masqué</option>
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

                    <div className="bg-white p-10 rounded-[2.5rem] border border-stone-100/60 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] space-y-8 relative overflow-hidden">
                        <h2 className="text-2xl font-playfair font-bold text-stone-900 italic relative z-10 border-b border-stone-50 pb-6">Valeur & Inventaire</h2>

                        <div className="space-y-6 relative z-10">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-3">Prix Actuel (MAD) *</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-stone-50 focus:border-stone-200 transition-all font-playfair font-bold text-lg text-stone-900"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-3">Prix Soldé (Optionnel)</label>
                                <input
                                    type="number"
                                    value={formData.sale_price}
                                    onChange={e => setFormData({ ...formData, sale_price: e.target.value })}
                                    className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-amber-50 focus:border-amber-200 transition-all font-playfair font-bold text-lg text-amber-600"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-3">Unités Disponibles *</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.stock}
                                    onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                    className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-emerald-50 focus:border-emerald-200 transition-all font-bold text-stone-900"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-stone-900 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-stone-800 transition-all shadow-xl shadow-stone-200 flex items-center justify-center gap-3 disabled:opacity-50 group"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                        {loading ? 'Création en cours...' : 'Mettre en vitrine'}
                    </button>

                    {error && (
                        <div className="p-6 bg-red-50/80 border border-red-100 rounded-2xl flex items-center gap-4 text-red-600 font-bold shadow-sm">
                            <AlertCircle className="w-6 h-6 flex-shrink-0" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}
