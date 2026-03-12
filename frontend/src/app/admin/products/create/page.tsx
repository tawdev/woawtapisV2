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
    });

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

    useEffect(() => {
        if (formData.type_id) {
            const selectedType = types.find(t => t.id.toString() === formData.type_id);
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
    }, [formData.type_id, categories, types]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await adminService.createProduct(formData);
            router.push('/admin/products');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Une erreur est survenue lors de la création.');
        } finally {
            setLoading(false);
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
