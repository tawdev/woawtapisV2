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
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Produits</h1>
                    <p className="text-stone-500 text-sm">Gérez votre catalogue de tapis.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <div className="relative w-full sm:w-auto">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                            type="text"
                            placeholder="Rechercher par nom..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 w-full sm:w-64"
                        />
                    </div>
                    <select
                        value={categoryId}
                        onChange={(e) => {
                            setCategoryId(e.target.value);
                            setPage(1); // Reset page on category change
                        }}
                        className="py-2.5 px-4 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 text-stone-600 w-full sm:w-auto outline-none"
                    >
                        <option value="">Toutes les catégories</option>
                        {categories.map((cat: any) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    <Link
                        href="/admin/products/create"
                        className="bg-stone-900 text-white px-4 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-stone-800 transition-colors w-full sm:w-auto"
                    >
                        <Plus className="w-5 h-5" />
                        Nouveau Produit
                    </Link>
                    {selectedProducts.length > 0 && (
                        <button
                            onClick={handleBulkDelete}
                            disabled={isDeletingBulk}
                            className="bg-red-50 text-red-600 px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors w-full sm:w-auto"
                        >
                            {isDeletingBulk ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                            Supprimer ({selectedProducts.length})
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-[400px]">
                        <Loader2 className="w-8 h-8 animate-spin text-stone-400 mb-2" />
                        <p className="text-stone-400 text-sm">Chargement des produits...</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-stone-50 text-stone-500 text-xs font-bold uppercase tracking-wider">
                                        <th className="px-6 py-4 w-10">
                                            <input 
                                                type="checkbox" 
                                                className="rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                                                checked={products.length > 0 && selectedProducts.length === products.length}
                                                onChange={handleSelectAll}
                                            />
                                        </th>
                                        <th className="px-6 py-4">Produit</th>
                                        <th className="px-6 py-4 text-center">Catégorie</th>
                                        <th className="px-6 py-4 text-center">Prix</th>
                                        <th className="px-6 py-4 text-center">Stock</th>
                                        <th className="px-6 py-4 text-center">Statut</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100">
                                    {products.map((product) => (
                                        <tr key={product.id} className="hover:bg-stone-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <input 
                                                    type="checkbox" 
                                                    className="rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                                                    checked={selectedProducts.includes(product.id)}
                                                    onChange={() => handleSelectProduct(product.id)}
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded bg-stone-100 flex-shrink-0 overflow-hidden border border-stone-200">
                                                        {product.images?.[0] ? (
                                                            <img
                                                                src={getImageUrl(product.images[0].image_path)}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-400 font-bold bg-stone-50">
                                                                NO IMG
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-stone-900">{product.name}</div>
                                                        <div className="text-xs text-stone-400">SKU: {product.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-xs font-medium bg-stone-100 text-stone-600 px-2 py-1 rounded">
                                                    {product.category?.name || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center font-bold text-stone-900 text-sm">
                                                {product.price} MAD
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`text-sm font-medium ${product.stock > 0 ? 'text-stone-600' : 'text-red-500 font-bold'}`}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${product.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                                    {product.status === 'active' ? 'Actif' : 'Inactif'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/product/${product.slug}`}
                                                        target="_blank"
                                                        className="p-2 text-stone-400 hover:text-stone-900 transition-colors"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/products/${product.id}/edit`}
                                                        className="p-2 text-stone-400 hover:text-stone-900 transition-colors"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
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

                        {/* Pagination */}
                        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
                            <p className="text-sm text-stone-500">
                                Affichage de <span className="font-bold">{products.length}</span> sur <span className="font-bold">{pagination?.total}</span> produits
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                    className="p-2 rounded-lg border border-stone-200 bg-white disabled:opacity-50 hover:bg-stone-50 transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <div className="text-sm font-bold text-stone-700 mx-2">
                                    Page {pagination?.current_page} sur {pagination?.last_page}
                                </div>
                                <button
                                    disabled={page === pagination?.last_page}
                                    onClick={() => setPage(page + 1)}
                                    className="p-2 rounded-lg border border-stone-200 bg-white disabled:opacity-50 hover:bg-stone-50 transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
