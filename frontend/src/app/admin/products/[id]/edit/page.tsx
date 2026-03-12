'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminService } from '@/services/admin';
import { getImageUrl } from '@/services/api';
import {
    ArrowLeft,
    Save,
    Loader2,
    AlertCircle,
    Eye,
    Star,
    Award,
    Trash2,
    Plus,
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

export default function EditProductPage() {
    const router = useRouter();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');

    // Data for selects
    const [categories, setCategories] = useState<any[]>([]);
    const [types, setTypes] = useState<any[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<any[]>([]);
    const [productImages, setProductImages] = useState<any[]>([]);
    const [isSurMesure, setIsSurMesure] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);

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
                const [catsRes, productRes] = await Promise.all([
                    adminService.getCategories(),
                    adminService.getProduct(id as string),
                ]);

                const allCats = catsRes.data;
                const uniqueTypes = Array.from(new Set(allCats.map((c: any) => JSON.stringify(c.type)))).map((t: any) => JSON.parse(t));

                setCategories(allCats);
                setTypes(uniqueTypes);

                const prod = productRes.data;
                setProductImages(prod.images || []);
                setFormData({
                    name: prod.name || '',
                    description: prod.description || '',
                    short_description: prod.short_description || '',
                    price: prod.price?.toString() || '',
                    sale_price: prod.sale_price?.toString() || '',
                    stock: prod.stock?.toString() || '0',
                    status: prod.status || 'active',
                    type_id: prod.type_id?.toString() || '',
                    category_id: prod.category_id?.toString() || '',
                    material: prod.material || '',
                    size: prod.size || '',
                    color: prod.color || [],
                    is_featured: !!(prod.is_featured ?? prod.featured),
                    is_best_seller: !!(prod.is_best_seller ?? prod.best_seller),
                    max_longueur: prod.max_longueur?.toString() || '',
                    max_largeur: prod.max_largeur?.toString() || '',
                });
            } catch (err) {
                console.error('Failed to fetch data:', err);
                setError('Impossible de charger les données du produit.');
            } finally {
                setFetching(false);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        if (formData.type_id) {
            const selectedType = types.find(t => t.id.toString() === formData.type_id);
            const surMesure = selectedType?.name?.toLowerCase() === 'sur_mesure';
            setIsSurMesure(surMesure);

            const filtered = categories.filter(c => c.type_id.toString() === formData.type_id);
            setFilteredCategories(filtered);
        } else {
            setIsSurMesure(false);
            setFilteredCategories([]);
        }
    }, [formData.type_id, categories, types]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await adminService.updateProduct(id as string, formData);
            router.push('/admin/products');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Une erreur est survenue lors de la mise à jour.');
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

    const handleDeleteImage = async (imageId: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return;
        try {
            await adminService.deleteProductImage(id as string, imageId);
            setProductImages(prev => prev.filter(img => img.id !== imageId));
        } catch (err) {
            console.error('Failed to delete image:', err);
            alert('Erreur lors de la suppression de l\'image.');
        }
    };

    const handleSetPrimary = async (imageId: number) => {
        try {
            await adminService.setProductPrimaryImage(id as string, imageId);
            setProductImages(prev => prev.map(img => ({
                ...img,
                is_primary: img.id === imageId
            })));
        } catch (err) {
            console.error('Failed to set primary image:', err);
            alert('Erreur lors de la définition de l\'image principale.');
        }
    };

    const handleUrlImageSubmit = async () => {
        if (!newImageUrl) return;
        setUploadingImage(true);
        try {
            const res = await adminService.addProductImage(id as string, { image_url: newImageUrl });
            setProductImages(prev => [...prev, res.data]);
            setNewImageUrl('');
        } catch (err) {
            console.error('Failed to add image via URL:', err);
            alert('Erreur lors de l\'ajout de l\'image.');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const formDataFile = new FormData();
        if (files.length === 1) {
            formDataFile.append('image_file', files[0]);
        } else {
            Array.from(files).forEach(file => {
                formDataFile.append('images[]', file);
            });
        }

        setUploadingImage(true);
        try {
            const res = await adminService.addProductImage(id as string, formDataFile);
            const data = Array.isArray(res.data) ? res.data : [res.data];
            setProductImages(prev => [...prev, ...data]);
        } catch (err) {
            console.error('Failed to upload images:', err);
            alert('Erreur lors de l\'upload des images.');
        } finally {
            setUploadingImage(false);
            if (e.target) e.target.value = '';
        }
    };

    if (fetching) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 animate-spin text-stone-400" />
                <p className="mt-4 text-stone-500 font-medium">Chargement du produit...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/products" className="p-2 rounded-lg hover:bg-stone-100 text-stone-500">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Modifier le Produit</h1>
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
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Description courte</label>
                                <textarea
                                    value={formData.short_description}
                                    onChange={e => setFormData({ ...formData, short_description: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-stone-900 transition-all text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Description complète</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-stone-900 transition-all text-sm"
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
                    <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                            <h2 className="text-lg font-bold text-stone-900">Images</h2>
                            <span className="bg-stone-100 text-stone-600 px-2 py-1 rounded-md text-xs font-bold">
                                {productImages.length}
                            </span>
                        </div>

                        {/* Add Image UI */}
                        <div className="space-y-3">
                            <div>
                                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Ajouter via URL</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="https://..."
                                        value={newImageUrl}
                                        onChange={e => setNewImageUrl(e.target.value)}
                                        className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-stone-900"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleUrlImageSubmit}
                                        disabled={uploadingImage || !newImageUrl}
                                        className="p-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 disabled:opacity-50"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="relative">
                                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Ou Upload fichier</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    disabled={uploadingImage}
                                    className="block w-full text-xs text-stone-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-lg file:border-0
                                        file:text-xs file:font-semibold
                                        file:bg-stone-100 file:text-stone-700
                                        hover:file:bg-stone-200 cursor-pointer"
                                />
                                {uploadingImage && (
                                    <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg">
                                        <Loader2 className="w-4 h-4 animate-spin text-stone-900" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-4">
                            {productImages.map((img, idx) => (
                                <div key={img.id || idx} className="relative group aspect-square rounded-xl overflow-hidden border border-stone-100 bg-stone-50">
                                    <img
                                        src={getImageUrl(img.image_path)}
                                        alt={`Image ${idx + 1}`}
                                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        {!img.is_primary && (
                                            <button
                                                type="button"
                                                onClick={() => handleSetPrimary(img.id)}
                                                className="p-1.5 bg-white text-stone-900 rounded-lg hover:bg-stone-100"
                                                title="Définir comme principale"
                                            >
                                                <Star className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteImage(img.id)}
                                            className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                            title="Supprimer"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    {img.is_primary && (
                                        <div className="absolute top-1 left-1 bg-stone-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                                            PRINCIPALE
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
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
                                    <option value="active">Actif (Visible boutique)</option>
                                    <option value="inactive">Inactif (Masqué)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-6">
                        <h2 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-4">Visibilité & Promotions</h2>
                        <div className="space-y-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, is_featured: !formData.is_featured })}
                                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${formData.is_featured ? 'bg-stone-900 border-stone-900 text-white' : 'bg-stone-50 border-stone-200 text-stone-600'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Star className={`w-5 h-5 ${formData.is_featured ? 'fill-current' : ''}`} />
                                    <span className="font-bold text-sm text-left">Produit à la une</span>
                                </div>
                                <div className={`w-10 h-6 rounded-full relative transition-colors ${formData.is_featured ? 'bg-white/20' : 'bg-stone-200'}`}>
                                    <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${formData.is_featured ? 'right-1 bg-white' : 'left-1 bg-white shadow-sm'}`} />
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, is_best_seller: !formData.is_best_seller })}
                                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${formData.is_best_seller ? 'bg-stone-900 border-stone-900 text-white' : 'bg-stone-50 border-stone-200 text-stone-600'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Award className={`w-5 h-5 ${formData.is_best_seller ? 'fill-current' : ''}`} />
                                    <span className="font-bold text-sm text-left">Meilleure vente</span>
                                </div>
                                <div className={`w-10 h-6 rounded-full relative transition-colors ${formData.is_best_seller ? 'bg-white/20' : 'bg-stone-200'}`}>
                                    <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${formData.is_best_seller ? 'right-1 bg-white' : 'left-1 bg-white shadow-sm'}`} />
                                </div>
                            </button>
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
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Prix soldé (Optionnel)</label>
                                <input
                                    type="number"
                                    value={formData.sale_price}
                                    onChange={e => setFormData({ ...formData, sale_price: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-stone-900 transition-all text-stone-500 font-bold"
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
                        Mettre à jour le produit
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
