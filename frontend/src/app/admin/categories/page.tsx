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
    X
} from 'lucide-react';

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [types, setTypes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [error, setError] = useState('');

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

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await adminService.createCategory(newCat);
            setNewCat({ name: '', type_id: '', description: '' });
            setShowAddForm(false);
            fetchData();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors de la création.');
        }
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
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Catégories</h1>
                    <p className="text-stone-500 text-sm">Gérez les types et collections de tapis.</p>
                </div>
                {!showAddForm && (
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-stone-900 text-white px-4 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-stone-800 transition-colors self-start"
                    >
                        <Plus className="w-5 h-5" />
                        Nouvelle Catégorie
                    </button>
                )}
            </div>

            {showAddForm && (
                <div className="bg-white p-8 rounded-2xl border border-stone-900/10 shadow-xl shadow-stone-200/50 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-stone-900">Ajouter une Catégorie</h2>
                        <button onClick={() => setShowAddForm(false)} className="text-stone-400 hover:text-stone-900">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Nom *</label>
                                <input
                                    type="text"
                                    required
                                    value={newCat.name}
                                    onChange={e => setNewCat({ ...newCat, name: e.target.value })}
                                    className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-stone-900 transition-all font-medium"
                                    placeholder="ex: Kilim"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Type *</label>
                                <select
                                    required
                                    value={newCat.type_id}
                                    onChange={e => setNewCat({ ...newCat, type_id: e.target.value })}
                                    className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-stone-900 transition-all text-sm font-medium"
                                >
                                    <option value="">Sélectionnez un type</option>
                                    {types.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                                <textarea
                                    value={newCat.description}
                                    onChange={e => setNewCat({ ...newCat, description: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-stone-900 transition-all text-sm"
                                    placeholder="Détails sur cette collection..."
                                />
                            </div>
                            <div className="flex gap-3 pt-1">
                                <button
                                    type="submit"
                                    className="flex-1 bg-stone-900 text-white py-2.5 rounded-xl font-bold hover:bg-stone-800 transition-all flex items-center justify-center gap-2"
                                >
                                    <Save className="w-5 h-5" />
                                    Enregistrer
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="px-6 py-2.5 border border-stone-200 text-stone-600 rounded-xl font-bold hover:bg-stone-50 transition-all"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                        {error && (
                            <div className="md:col-span-2 p-3 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-2">
                                <AlertCircle className="w-5 h-5" />
                                {error}
                            </div>
                        )}
                    </form>
                </div>
            )}

            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-[400px]">
                        <Loader2 className="w-8 h-8 animate-spin text-stone-400 mb-2" />
                        <p className="text-stone-400 text-sm">Chargement des catégories...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-stone-50 text-stone-500 text-xs font-bold uppercase tracking-wider">
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">Catégorie</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Slug</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {categories.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-stone-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-stone-400 text-sm">#{cat.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-stone-100 flex items-center justify-center">
                                                    <Layers className="w-4 h-4 text-stone-400" />
                                                </div>
                                                <span className="text-sm font-bold text-stone-900">{cat.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-bold bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full uppercase tracking-tight">
                                                {cat.type?.name || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-stone-500 font-mono italic">{cat.slug}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleDelete(cat.id)}
                                                    className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
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
