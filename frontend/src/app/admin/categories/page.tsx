'use client';

import React, { useState, useEffect } from 'react';
import { adminService } from '@/services/admin';
import {
    Plus,
    Trash2,
    Loader2,
    AlertCircle,
    Layers,
    Save,
    X,
    Edit2
} from 'lucide-react';

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [types, setTypes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [error, setError] = useState('');
    const [editingCatId, setEditingCatId] = useState<number | null>(null);

    // New Category form
    const [newCat, setNewCat] = useState({
        name: '',
        type_id: '',
        description: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await adminService.getCategories();
            setCategories(response.data);

            // Extract unique types for the form
            const uniqueTypes = Array.from(new Set(response.data.map((c: any) => JSON.stringify(c.type)))).map((t: any) => JSON.parse(t));
            setTypes(uniqueTypes);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            if (editingCatId) {
                await adminService.updateCategory(editingCatId, newCat);
            } else {
                await adminService.createCategory(newCat);
            }
            handleCloseForm();
            fetchData();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors de la sauvegarde.');
        }
    };

    const handleEditClick = (cat: any) => {
        setEditingCatId(cat.id);
        setNewCat({
            name: cat.name,
            type_id: cat.type?.id || cat.type_id || '',
            description: cat.description || ''
        });
        setShowAddForm(true);
        // Scroll to form if needed
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCloseForm = () => {
        setShowAddForm(false);
        setEditingCatId(null);
        setNewCat({ name: '', type_id: '', description: '' });
    };

    const handleDelete = async (id: number) => {
        if (confirm('Êtes-vous sûr ? Cela pourrait affecter les produits liés.')) {
            try {
                await adminService.deleteCategory(id);
                fetchData();
            } catch (error) {
                alert('Erreur lors de la suppression');
            }
        }
    };

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-playfair font-bold text-stone-900 tracking-tight italic flex items-center gap-4">
                        Catégories & Collections
                        {categories.length > 0 && (
                            <span className="flex items-center justify-center w-8 h-8 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-sans font-bold not-italic">
                                {categories.length}
                            </span>
                        )}
                    </h1>
                    <p className="text-stone-500 font-medium mt-2">Gérez et organisez l'architecture de vos tapis d'exception.</p>
                </div>
                {!showAddForm && (
                    <button
                        onClick={() => {
                            setEditingCatId(null);
                            setNewCat({ name: '', type_id: '', description: '' });
                            setShowAddForm(true);
                        }}
                        className="bg-stone-900 text-white px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-stone-800 transition-all self-start shadow-xl shadow-stone-200 group"
                    >
                        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                        Nouvelle Catégorie
                    </button>
                )}
            </div>

            {/* Add/Edit Form */}
            {showAddForm && (
                <div className="bg-white p-10 rounded-[2.5rem] border border-stone-100/60 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] animate-in fade-in slide-in-from-top-4 duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                    
                    <div className="relative z-10 flex items-center justify-between mb-8 pb-6 border-b border-stone-50">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                                {editingCatId ? <Edit2 className="w-6 h-6" /> : <Layers className="w-6 h-6" />}
                            </div>
                            <div>
                                <h2 className="text-2xl font-playfair font-bold text-stone-900 italic">
                                    {editingCatId ? "Modifier la Collection" : "Créer une Collection"}
                                </h2>
                                <p className="text-[10px] text-stone-400 uppercase font-black tracking-[0.2em] mt-1">
                                    {editingCatId ? "Mise à jour des informations" : "Définissez une nouvelle taxonomie"}
                                </p>
                            </div>
                        </div>
                        <button onClick={handleCloseForm} className="w-10 h-10 rounded-xl bg-stone-50 text-stone-400 flex items-center justify-center hover:bg-white border border-transparent hover:border-stone-100 hover:text-stone-900 hover:shadow-lg transition-all duration-300">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-3">Nom de la collection *</label>
                                <input
                                    type="text"
                                    required
                                    value={newCat.name}
                                    onChange={e => setNewCat({ ...newCat, name: e.target.value })}
                                    className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-emerald-50 focus:border-emerald-200 transition-all font-bold text-stone-900"
                                    placeholder="ex: Kilim Anatolien"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-3">Type Associé *</label>
                                <select
                                    required
                                    value={newCat.type_id}
                                    onChange={e => setNewCat({ ...newCat, type_id: e.target.value })}
                                    className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-stone-50 focus:border-stone-200 transition-all font-bold text-sm text-stone-900 appearance-none cursor-pointer"
                                >
                                    <option value="" className="text-stone-400 font-normal">-- Sélectionnez la famille racine --</option>
                                    {types.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-6 flex flex-col">
                            <div className="flex-1">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-3">Description Contextuelle</label>
                                <textarea
                                    value={newCat.description}
                                    onChange={e => setNewCat({ ...newCat, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-stone-50 focus:border-stone-200 transition-all font-medium text-stone-700 resize-none h-full"
                                    placeholder="Histoire ou détails spécifiques sur cette collection..."
                                />
                            </div>
                            <div className="flex gap-4 pt-2">
                                <button
                                    type="submit"
                                    className="flex-1 bg-stone-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-stone-800 transition-all shadow-xl flex items-center justify-center gap-3 group"
                                >
                                    <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    {editingCatId ? 'Mettre à jour' : 'Sauvegarder'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCloseForm}
                                    className="px-8 py-4 bg-white border border-stone-200 text-stone-400 hover:text-stone-900 hover:bg-stone-50 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                        {error && (
                            <div className="lg:col-span-2 p-5 bg-red-50/50 border border-red-100 text-red-600 rounded-2xl font-bold flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}
                    </form>
                </div>
            )}

            {/* Main Table Wrapper */}
            <div className="bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] border border-stone-100/60 overflow-hidden min-h-[400px] relative">
                <div className="absolute top-0 left-0 w-64 h-64 bg-stone-50 rounded-full blur-3xl -ml-32 -mt-32 pointer-events-none" />
                
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-[500px] relative z-10">
                        <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mb-4">
                            <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
                        </div>
                        <p className="text-stone-400 text-xs font-black uppercase tracking-[0.2em] animate-pulse">Chargement de la hiérarchie...</p>
                    </div>
                ) : (
                    <div className="relative z-10 overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-stone-50/50 text-stone-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                    <th className="px-8 py-5">Identifiant</th>
                                    <th className="px-8 py-5">Collection</th>
                                    <th className="px-8 py-5">Famille / Type</th>
                                    <th className="px-8 py-5">Slug</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {categories.map((cat) => (
                                    <tr key={cat.id} className="group hover:bg-stone-50/50 transition-all duration-300">
                                        <td className="px-8 py-6">
                                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                                                #{cat.id.toString().padStart(4, '0')}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-[1.25rem] bg-stone-50 flex items-center justify-center border border-stone-100/50 group-hover:scale-105 transition-transform group-hover:bg-white group-hover:shadow-lg group-hover:border-stone-200">
                                                    <Layers className="w-5 h-5 text-stone-400 group-hover:text-amber-600 transition-colors" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-stone-900">{cat.name}</span>
                                                    {cat.description && <span className="text-[10px] text-stone-400 font-medium truncate max-w-[200px] mt-1">{cat.description}</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[10px] font-black tracking-widest bg-stone-50 border border-stone-100 text-stone-600 px-3 py-1.5 rounded-lg uppercase">
                                                {cat.type?.name || 'Globale'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-[11px] font-mono font-medium text-stone-400 bg-stone-50/50 inline-block px-3 py-1.5 rounded-lg">
                                                /{cat.slug}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEditClick(cat)}
                                                    className="w-10 h-10 rounded-xl bg-white border border-stone-100 text-stone-400 hover:text-stone-900 hover:border-stone-900 hover:shadow-lg transition-all flex items-center justify-center"
                                                    title="Modifier la catégorie"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cat.id)}
                                                    className="w-10 h-10 rounded-xl bg-white border border-stone-100 text-stone-300 hover:text-red-500 hover:border-red-100 hover:bg-red-50 hover:shadow-lg transition-all flex items-center justify-center"
                                                    title="Supprimer la catégorie"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
