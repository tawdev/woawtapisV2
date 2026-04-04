'use client';

import React, { useState, useEffect } from 'react';
import { adminService } from '@/services/admin';
import { productService, getImageUrl } from '@/services/api';
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    ExternalLink,
    Loader2,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [pagination, setPagination] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [categories, setCategories] = useState<any[]>([]);
    const [categoryId, setCategoryId] = useState('');
    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
    const [isDeletingBulk, setIsDeletingBulk] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await adminService.getCategories();
                // Admin categories might be paginated or array, handle both
                setCategories(res.data.data || res.data);
            } catch (error) {
                console.error("Failed to load categories:", error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        fetchProducts();
    }, [page, debouncedSearch, categoryId]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await adminService.getProducts(page, debouncedSearch, categoryId);
            setProducts(response.data.data);
            setSelectedProducts([]); // Reset selection on page load
            setPagination({
                current_page: response.data.current_page,
                last_page: response.data.last_page,
                total: response.data.total
            });
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            try {
                await adminService.deleteProduct(id);
                fetchProducts();
            } catch (error: any) {
                console.error(error);
                alert('Erreur lors de la suppression. Ce produit est peut-être lié à une commande.');
            }
        }
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedProducts(products.map(p => p.id));
        } else {
            setSelectedProducts([]);
        }
    };

    const handleSelectProduct = (id: number) => {
        if (selectedProducts.includes(id)) {
            setSelectedProducts(selectedProducts.filter(pId => pId !== id));
        } else {
            setSelectedProducts([...selectedProducts, id]);
        }
    };

    const handleBulkDelete = async () => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedProducts.length} produit(s) ?`)) {
            setIsDeletingBulk(true);
            try {
                const results = await Promise.allSettled(selectedProducts.map(id => adminService.deleteProduct(id)));
                const failedCount = results.filter(r => r.status === 'rejected').length;
                if (failedCount > 0) {
                    alert(`${failedCount} produit(s) n'ont pas pu être supprimés. Ils sont potentiellement liés à des commandes existantes.`);
                }
                fetchProducts();
            } catch (error) {
                console.error(error);
                alert('Erreur inattendue lors de la suppression groupée');
            } finally {
                setIsDeletingBulk(false);
            }
        }
    };

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-700">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-playfair font-bold text-stone-900 tracking-tight italic flex items-center gap-4">
                        Catalogue & Pièces
                        {pagination?.total > 0 && (
                            <span className="flex items-center justify-center w-8 h-8 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-sans font-bold not-italic">
                                {pagination.total}
                            </span>
                        )}
                    </h1>
                    <p className="text-stone-500 font-medium mt-2">Gérez l'inventaire de vos créations artisanales.</p>
                </div>
                <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                            type="text"
                            placeholder="Rechercher une pièce..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-white border border-stone-100 rounded-2xl py-3.5 pl-12 pr-4 text-[13px] font-bold text-stone-900 outline-none focus:ring-4 focus:ring-stone-50 transition-all w-full sm:w-72 shadow-sm"
                        />
                    </div>
                    <select
                        value={categoryId}
                        onChange={(e) => {
                            setCategoryId(e.target.value);
                            setPage(1);
                        }}
                        className="bg-white border border-stone-100 rounded-2xl py-3.5 px-6 text-[11px] font-black uppercase tracking-widest text-stone-500 outline-none focus:ring-4 focus:ring-stone-50 transition-all w-full sm:w-auto shadow-sm appearance-none cursor-pointer"
                    >
                        <option value="">Famille de Tapis</option>
                        {categories.map((cat: any) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    {selectedProducts.length > 0 ? (
                        <button
                            onClick={handleBulkDelete}
                            disabled={isDeletingBulk}
                            className="bg-red-50 text-red-600 px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-red-100 transition-all w-full sm:w-auto flex-1 shadow-sm"
                        >
                            {isDeletingBulk ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            Supprimer ({selectedProducts.length})
                        </button>
                    ) : (
                        <Link
                            href="/admin/products/create"
                            className="bg-stone-900 text-white px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-stone-800 transition-all shadow-xl shadow-stone-200 group w-full sm:w-auto flex-1"
                        >
                            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                            Nouveau Produit
                        </Link>
                    )}
                </div>
            </div>

            {/* Main Table Wrapper */}
            <div className="bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] border border-stone-100/60 overflow-hidden relative min-h-[500px]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-stone-50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 relative z-10 h-full min-h-[400px]">
                        <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mb-4">
                            <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
                        </div>
                        <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Recherche des pièces en cours...</p>
                    </div>
                ) : (
                    <>
                        <div className="relative z-10 overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-stone-50/50 text-stone-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                        <th className="px-8 py-5 w-10">
                                            <input 
                                                type="checkbox" 
                                                className="rounded-md border-stone-300 text-stone-900 focus:ring-stone-900 w-4 h-4"
                                                checked={products.length > 0 && selectedProducts.length === products.length}
                                                onChange={handleSelectAll}
                                            />
                                        </th>
                                        <th className="px-8 py-5">Pièce Artisanale</th>
                                        <th className="px-8 py-5 text-center">Collection</th>
                                        <th className="px-8 py-5 text-center">Acquisition</th>
                                        <th className="px-8 py-5 text-center">Stock</th>
                                        <th className="px-8 py-5 text-center">Statut</th>
                                        <th className="px-8 py-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100">
                                    {products.map((product) => (
                                        <tr key={product.id} className="group hover:bg-stone-50/50 transition-all duration-300">
                                            <td className="px-8 py-6">
                                                <input 
                                                    type="checkbox" 
                                                    className="rounded-md border-stone-300 text-stone-900 focus:ring-stone-900 w-4 h-4"
                                                    checked={selectedProducts.includes(product.id)}
                                                    onChange={() => handleSelectProduct(product.id)}
                                                />
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-14 h-14 rounded-[1.25rem] bg-stone-50 flex-shrink-0 overflow-hidden border border-stone-100/50 shadow-sm group-hover:scale-105 transition-transform">
                                                        {product.images?.[0] ? (
                                                            <img
                                                                src={getImageUrl(product.images[0].image_path)}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-[8px] text-stone-400 font-bold bg-stone-50 uppercase tracking-widest">
                                                                No Img
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-stone-900 group-hover:text-amber-600 transition-colors uppercase tracking-tight">{product.name}</div>
                                                        <div className="text-[10px] font-mono text-stone-400 mt-1 uppercase">SKU: {product.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className="text-[10px] font-black tracking-widest bg-stone-50 border border-stone-100 text-stone-600 px-3 py-1.5 rounded-lg uppercase inline-block">
                                                    {product.category?.name || 'Globale'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className="font-playfair font-bold text-stone-900 text-[15px] italic">
                                                    {Number(product.price).toLocaleString('fr-FR')} <span className="font-sans text-[10px] uppercase font-black tracking-widest text-stone-400 not-italic">MAD</span>
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                {product.stock > 10 ? (
                                                    <span className="text-[11px] font-black text-stone-600">{product.stock} PIÈCES</span>
                                                ) : product.stock > 0 ? (
                                                    <span className="text-[11px] font-black text-amber-500">{product.stock} RESTANT</span>
                                                ) : (
                                                    <span className="text-[11px] font-black text-red-500 italic block">ÉPUISÉ</span>
                                                )}
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <div className="flex items-center justify-center">
                                                    <div className={`w-2 h-2 rounded-full mr-2 ${product.status === 'active' ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-red-400'}`} />
                                                    <span className={`text-[10px] font-black tracking-widest uppercase ${product.status === 'active' ? 'text-emerald-700' : 'text-red-700'}`}>
                                                        {product.status === 'active' ? 'En Ligne' : 'Masqué'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link
                                                        href={`/product/${product.slug}`}
                                                        target="_blank"
                                                        className="w-10 h-10 rounded-xl bg-white border border-stone-100 text-stone-400 hover:text-stone-900 hover:border-stone-900 hover:shadow-lg transition-all flex items-center justify-center"
                                                        title="Aperçu public"
                                                    >
                                                        <ExternalLink size={16} />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/products/${product.id}/edit`}
                                                        className="w-10 h-10 rounded-xl bg-white border border-stone-100 text-stone-400 hover:text-amber-600 hover:border-amber-200 hover:bg-amber-50 hover:shadow-lg transition-all flex items-center justify-center"
                                                        title="Modifier"
                                                    >
                                                        <Pencil size={16} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="w-10 h-10 rounded-xl bg-white border border-stone-100 text-stone-300 hover:text-red-500 hover:border-red-100 hover:bg-red-50 hover:shadow-lg transition-all flex items-center justify-center"
                                                        title="Supprimer définitivement"
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

                        {/* Pagination */}
                        {pagination?.last_page > 1 && (
                            <div className="px-8 py-6 bg-stone-50/50 border-t border-stone-50 flex items-center justify-between">
                                <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                                    Page <span className="text-stone-900">{pagination.current_page}</span> sur <span className="text-stone-900">{pagination.last_page}</span>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        disabled={page === 1}
                                        onClick={() => setPage(page - 1)}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-white border border-stone-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-stone-600 disabled:opacity-30 hover:bg-stone-50 transition-all shadow-sm"
                                    >
                                        <ChevronLeft size={14} />
                                        Précédent
                                    </button>
                                    <button
                                        disabled={page === pagination.last_page}
                                        onClick={() => setPage(page + 1)}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-white border border-stone-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-stone-900 disabled:opacity-30 hover:bg-stone-50 transition-all shadow-sm"
                                    >
                                        Suivant
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
