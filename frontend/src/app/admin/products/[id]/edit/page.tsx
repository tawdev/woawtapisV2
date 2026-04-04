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
        is_couloir: false,
        is_tapis_de_lit: false,
        sub_category: '',
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
                    is_couloir: !!prod.is_couloir,
                    is_tapis_de_lit: !!prod.is_tapis_de_lit,
                    sub_category: prod.sub_category || '',
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
            const filtered = categories.filter(c => c.type_id.toString() === formData.type_id);
            setFilteredCategories(filtered);
        } else {
            setIsSurMesure(false);
            setFilteredCategories([]);
        }
    }, [formData.type_id, categories, types, selectedType]);

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
            <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
                <div className="w-20 h-20 rounded-[2rem] bg-stone-50 border border-stone-100 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
                </div>
                <p className="text-[10px] text-stone-400 font-black uppercase tracking-[0.2em]">Chargement de la pièce...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in duration-700">
            <div className="flex items-center gap-6">
                <Link href="/admin/products" className="w-12 h-12 rounded-2xl bg-white border border-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-900 hover:shadow-lg transition-all">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-playfair font-bold text-stone-900 italic tracking-tight">Modifier la Pièce</h1>
                    <p className="text-[10px] text-stone-400 font-black uppercase tracking-[0.2em] mt-1">Mise à jour des informations du tapis</p>
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
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-3">Aperçu Rapide</label>
                                <textarea
                                    value={formData.short_description}
                                    onChange={e => setFormData({ ...formData, short_description: e.target.value })}
                                    rows={2}
                                    className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-stone-50 focus:border-stone-200 transition-all font-medium text-stone-700 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-3">Récit Complet</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-stone-50 focus:border-stone-200 transition-all font-medium text-stone-700 resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[2.5rem] border border-stone-100/60 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                        <h2 className="text-2xl font-playfair font-bold text-stone-900 italic relative z-10 border-b border-stone-50 pb-6">Spécifications Techniques</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-3">Matière</label>
                                <input
                                    type="text"
                                    value={formData.material}
                                    onChange={e => setFormData({ ...formData, material: e.target.value })}
                                    className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-amber-50 focus:border-amber-200 transition-all font-medium text-stone-900"
                                />
                            </div>
                            {isSurMesure ? (
                                <>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-3">Max Longueur (cm)</label>
                                        <input
                                            type="number"
                                            value={formData.max_longueur}
                                            onChange={e => {
                                                const val = e.target.value;
                                                setFormData(prev => ({ ...prev, max_longueur: val, size: `${val}x${prev.max_largeur}` }));
                                            }}
                                            className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-stone-50 focus:border-stone-200 transition-all font-bold text-stone-900"
                                            placeholder="ex: 300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-3">Max Largeur (cm)</label>
                                        <input
                                            type="number"
                                            value={formData.max_largeur}
                                            onChange={e => {
                                                const val = e.target.value;
                                                setFormData(prev => ({ ...prev, max_largeur: val, size: `${prev.max_longueur}x${val}` }));
                                            }}
                                            className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-stone-50 focus:border-stone-200 transition-all font-bold text-stone-900"
                                            placeholder="ex: 200"
                                        />
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-3">Dimensions</label>
                                    <input
                                        type="text"
                                        value={formData.size}
                                        onChange={e => setFormData({ ...formData, size: e.target.value })}
                                        className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-stone-50 focus:border-stone-200 transition-all font-bold text-stone-900"
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
                    <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100/60 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] space-y-6 relative overflow-hidden">
                        <div className="flex items-center justify-between border-b border-stone-50 pb-6">
                            <h2 className="text-2xl font-playfair font-bold text-stone-900 italic">Galerie</h2>
                            <span className="bg-stone-900 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                {productImages.length} photo{productImages.length > 1 ? 's' : ''}
                            </span>
                        </div>

                        {/* Add Image UI */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-3">Ajouter via URL</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="https://..."
                                        value={newImageUrl}
                                        onChange={e => setNewImageUrl(e.target.value)}
                                        className="flex-1 px-4 py-3 bg-stone-50/50 border border-stone-100 rounded-2xl text-xs outline-none focus:bg-white focus:ring-4 focus:ring-stone-50 focus:border-stone-200 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleUrlImageSubmit}
                                        disabled={uploadingImage || !newImageUrl}
                                        className="w-11 h-11 bg-stone-900 text-white rounded-2xl hover:bg-stone-800 disabled:opacity-40 flex items-center justify-center transition-all"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="relative">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-3">Upload Fichier(s)</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    disabled={uploadingImage}
                                    className="block w-full text-xs text-stone-500
                                        file:mr-4 file:py-2.5 file:px-5
                                        file:rounded-xl file:border-0
                                        file:text-[10px] file:font-black file:uppercase file:tracking-widest
                                        file:bg-stone-100 file:text-stone-600
                                        hover:file:bg-stone-200 cursor-pointer"
                                />
                                {uploadingImage && (
                                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-2xl backdrop-blur-sm">
                                        <Loader2 className="w-5 h-5 animate-spin text-stone-900" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-2">
                            {productImages.map((img, idx) => (
                                <div key={img.id || idx} className="relative group aspect-square rounded-2xl overflow-hidden border border-stone-100 bg-stone-50 shadow-sm">
                                    <img
                                        src={getImageUrl(img.image_path)}
                                        alt={`Image ${idx + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center gap-2 pb-3">
                                        {!img.is_primary && (
                                            <button
                                                type="button"
                                                onClick={() => handleSetPrimary(img.id)}
                                                className="p-2 bg-white/90 backdrop-blur-sm text-stone-900 rounded-xl hover:bg-white transition-all"
                                                title="Définir comme principale"
                                            >
                                                <Star className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteImage(img.id)}
                                            className="p-2 bg-red-500/90 backdrop-blur-sm text-white rounded-xl hover:bg-red-600 transition-all"
                                            title="Supprimer"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    {img.is_primary && (
                                        <div className="absolute top-2 left-2 bg-stone-900 text-white text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest shadow">
                                            ★ Principale
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100/60 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] space-y-6">
                        <h2 className="text-2xl font-playfair font-bold text-stone-900 italic border-b border-stone-50 pb-6">Classification</h2>

                        <div className="space-y-6">
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
                                    <option value="active">Publié — Visible boutique</option>
                                    <option value="inactive">Masqué — Inactif</option>
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

                    <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100/60 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] space-y-6">
                        <h2 className="text-2xl font-playfair font-bold text-stone-900 italic border-b border-stone-50 pb-6">Mise en Avant</h2>
                        <div className="space-y-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, is_featured: !formData.is_featured })}
                                className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${formData.is_featured ? 'bg-stone-900 border-stone-900 text-white' : 'bg-stone-50/50 border-stone-100 text-stone-500 hover:border-stone-200'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <Star className={`w-5 h-5 ${formData.is_featured ? 'fill-current' : ''}`} />
                                    <span className="font-black text-[11px] uppercase tracking-widest text-left">À la une</span>
                                </div>
                                <div className={`w-11 h-6 rounded-full relative transition-colors ${formData.is_featured ? 'bg-white/20' : 'bg-stone-200'}`}>
                                    <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${formData.is_featured ? 'right-1 bg-white' : 'left-1 bg-stone-400/50'}`} />
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, is_best_seller: !formData.is_best_seller })}
                                className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${formData.is_best_seller ? 'bg-stone-900 border-stone-900 text-white' : 'bg-stone-50/50 border-stone-100 text-stone-500 hover:border-stone-200'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <Award className={`w-5 h-5 ${formData.is_best_seller ? 'fill-current' : ''}`} />
                                    <span className="font-black text-[11px] uppercase tracking-widest text-left">Best Seller</span>
                                </div>
                                <div className={`w-11 h-6 rounded-full relative transition-colors ${formData.is_best_seller ? 'bg-white/20' : 'bg-stone-200'}`}>
                                    <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${formData.is_best_seller ? 'right-1 bg-white' : 'left-1 bg-stone-400/50'}`} />
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100/60 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] space-y-6">
                        <h2 className="text-2xl font-playfair font-bold text-stone-900 italic border-b border-stone-50 pb-6">Valeur & Inventaire</h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-3">Prix Actuel (MAD) *</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-stone-50 focus:border-stone-200 transition-all font-playfair font-bold text-lg text-stone-900"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-3">Prix Soldé (Optionnel)</label>
                                <input
                                    type="number"
                                    value={formData.sale_price}
                                    onChange={e => setFormData({ ...formData, sale_price: e.target.value })}
                                    className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-amber-50 focus:border-amber-200 transition-all font-playfair font-bold text-lg text-amber-600"
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
                        {loading ? 'Sauvegarde en cours...' : 'Sauvegarder les modifications'}
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
