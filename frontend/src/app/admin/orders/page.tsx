'use client';

import React, { useState, useEffect } from 'react';
import { adminService } from '@/services/admin';
import { orderStatusMap } from '@/utils/status';
import {
    ShoppingCart as CartIcon,
    Search as SearchIcon,
    Trash2 as TrashIcon,
    Loader2 as LoaderIcon,
    AlertCircle as AlertIcon,
    Clock as ClockIcon,
    ChevronLeft as PrevIcon,
    ChevronRight as NextIcon,
    User as UserIcon,
    MapPin as PinIcon,
    CheckCircle2,
    Truck,
    CircleDashed,
    PackageCheck,
    XCircle,
    Eye,
    X,
    Phone,
    Mail,
    Calendar,
    Hash
} from 'lucide-react';
import { getImageUrl } from '@/services/api';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [pagination, setPagination] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, [page]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await adminService.getOrders(page);
            setOrders(response.data.data);
            setPagination({
                current_page: response.data.current_page,
                last_page: response.data.last_page,
                total: response.data.total
            });
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = async (id: number) => {
        setDetailsLoading(true);
        setIsModalOpen(true);
        try {
            const response = await adminService.getOrder(id);
            setSelectedOrder(response.data);
        } catch (error) {
            console.error('Failed to fetch order details:', error);
            alert('Impossible de charger les détails de la commande');
            setIsModalOpen(false);
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleStatusUpdate = async (id: number, status: string) => {
        setUpdatingId(id);
        try {
            await adminService.updateOrderStatus(id, status);
            fetchOrders();
        } catch (error) {
            alert('Erreur lors de la mise à jour du statut');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
            try {
                await adminService.deleteOrder(id);
                fetchOrders();
            } catch (error) {
                alert('Erreur lors de la suppression');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Commandes</h1>
                    <p className="text-stone-500 text-sm">Gérez les ventes et le suivi des livraisons.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-[400px]">
                        <LoaderIcon className="w-8 h-8 animate-spin text-stone-400 mb-2" />
                        <p className="text-stone-400 text-sm">Chargement des commandes...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-stone-50 text-stone-500 text-xs font-bold uppercase tracking-wider">
                                    <th className="px-6 py-4">Commande</th>
                                    <th className="px-6 py-4">Client</th>
                                    <th className="px-6 py-4">Détails</th>
                                    <th className="px-6 py-4">Statut</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {orders.map((order) => {
                                    const statusInfo = orderStatusMap[order.status as keyof typeof orderStatusMap] || { label: order.status, color: 'text-stone-500 bg-stone-50' };
                                    return (
                                        <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-stone-900">#{order.order_number}</div>
                                                <div className="flex items-center gap-1 text-[10px] text-stone-400 mt-0.5">
                                                    <ClockIcon className="w-3 h-3" />
                                                    {new Date(order.created_at).toLocaleDateString('fr-FR')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center">
                                                        <UserIcon className="w-3.5 h-3.5 text-stone-500" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-stone-900">{order.customer_name}</div>
                                                        <div className="text-[10px] text-stone-400 font-mono">{order.customer_email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1 text-sm font-bold text-stone-900">
                                                    {order.total_amount} MAD
                                                </div>
                                                <div className="flex items-center gap-1 text-[10px] text-stone-400">
                                                    <PinIcon className="w-3 h-3" />
                                                    {order.customer_city}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="relative group min-w-[140px]">
                                                    {updatingId === order.id ? (
                                                        <div className="flex items-center gap-2 text-stone-400 text-xs py-1 px-3">
                                                            <LoaderIcon className="w-3 h-3 animate-spin" />
                                                            Mise à jour...
                                                        </div>
                                                    ) : (
                                                        <select
                                                            value={order.status}
                                                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                            className={`w-full appearance-none px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-tighter cursor-pointer outline-none transition-all ${statusInfo.color} border-none`}
                                                        >
                                                            {Object.entries(orderStatusMap).map(([key, value]) => (
                                                                <option key={key} value={key} className="bg-white text-stone-900 font-medium normal-case">
                                                                    {value.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleViewDetails(order.id)}
                                                        className="p-2 text-stone-400 hover:text-stone-900 transition-colors"
                                                        title="Voir les détails"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(order.id)}
                                                        className="p-2 text-stone-300 hover:text-red-500 transition-colors"
                                                        title="Supprimer"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {!loading && pagination?.last_page > 1 && (
                    <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
                        <p className="text-sm text-stone-500 font-medium">
                            Page <span className="font-bold text-stone-900">{pagination.current_page}</span> sur <span className="font-bold text-stone-900">{pagination.last_page}</span>
                        </p>
                        <div className="flex gap-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                className="px-3 py-1.5 border border-stone-200 bg-white rounded-lg text-xs font-bold text-stone-600 disabled:opacity-50 hover:bg-stone-50 transition-colors"
                            >
                                Précédent
                            </button>
                            <button
                                disabled={page === pagination.last_page}
                                onClick={() => setPage(page + 1)}
                                className="px-3 py-1.5 border border-stone-200 bg-white rounded-lg text-xs font-bold text-stone-600 disabled:opacity-50 hover:bg-stone-50 transition-colors"
                            >
                                Suivant
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b border-stone-100 flex items-center justify-between bg-white sticky top-0 z-10">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
                                        Commande {selectedOrder && `#${selectedOrder.order_number}`}
                                    </h2>
                                    {selectedOrder && (
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${orderStatusMap[selectedOrder.status as keyof typeof orderStatusMap]?.color}`}>
                                            {orderStatusMap[selectedOrder.status as keyof typeof orderStatusMap]?.label}
                                        </span>
                                    )}
                                </div>
                                <p className="text-stone-500 text-sm mt-1">Détails complets de la transaction.</p>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="w-10 h-10 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-900 transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-8">
                            {detailsLoading ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <LoaderIcon className="w-10 h-10 animate-spin text-primary mb-4" />
                                    <p className="text-stone-500 font-medium">Récupération des données...</p>
                                </div>
                            ) : selectedOrder ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                    {/* Left Column: Customer & Shipping */}
                                    <div className="md:col-span-1 space-y-8">
                                        <section>
                                            <h3 className="text-[10px] uppercase tracking-widest font-black text-stone-400 mb-4 flex items-center gap-2">
                                                <UserIcon size={14} className="text-primary" />
                                                Client
                                            </h3>
                                            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100 space-y-4">
                                                <div>
                                                    <p className="text-xs text-stone-400 mb-0.5">Nom complet</p>
                                                    <p className="font-bold text-stone-900">{selectedOrder.customer_name}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-white border border-stone-100 flex items-center justify-center text-stone-400">
                                                        <Mail size={14} />
                                                    </div>
                                                    <div className="flex-1 overflow-hidden">
                                                        <p className="text-[10px] text-stone-400">Email</p>
                                                        <p className="text-sm font-medium text-stone-900 truncate">{selectedOrder.customer_email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-white border border-stone-100 flex items-center justify-center text-stone-400">
                                                        <Phone size={14} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-stone-400">Téléphone</p>
                                                        <p className="text-sm font-medium text-stone-900">{selectedOrder.customer_phone}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>

                                        <section>
                                            <h3 className="text-[10px] uppercase tracking-widest font-black text-stone-400 mb-4 flex items-center gap-2">
                                                <PinIcon size={14} className="text-primary" />
                                                Livraison
                                            </h3>
                                            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100 space-y-4">
                                                <div>
                                                    <p className="text-xs text-stone-400 mb-0.5">Adresse</p>
                                                    <p className="text-sm font-medium text-stone-900 leading-relaxed">
                                                        {selectedOrder.customer_address}
                                                    </p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-[10px] text-stone-400">Ville</p>
                                                        <p className="text-sm font-bold text-stone-900">{selectedOrder.customer_city}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-stone-400">Code Postal</p>
                                                        <p className="text-sm font-bold text-stone-900">{selectedOrder.customer_postal_code || '--'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </div>

                                    {/* Right Column: Order Items */}
                                    <div className="md:col-span-2 flex flex-col">
                                        <h3 className="text-[10px] uppercase tracking-widest font-black text-stone-400 mb-4 flex items-center gap-2">
                                            <CartIcon size={14} className="text-primary" />
                                            Articles Commandés
                                        </h3>
                                        <div className="flex-1 overflow-hidden bg-white border border-stone-100 rounded-2xl">
                                            <div className="overflow-y-auto max-h-[400px]">
                                                <table className="w-full text-left">
                                                    <thead className="bg-stone-50 sticky top-0">
                                                        <tr className="text-[10px] uppercase tracking-widest font-black text-stone-400">
                                                            <th className="px-6 py-4">Produit</th>
                                                            <th className="px-6 py-4 text-center">Qté</th>
                                                            <th className="px-6 py-4 text-right">Prix</th>
                                                            <th className="px-6 py-4 text-right">Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-stone-50">
                                                        {selectedOrder.items?.map((item: any) => (
                                                            <tr key={item.id} className="text-sm">
                                                                <td className="px-6 py-4">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                                                                            <img 
                                                                                src={getImageUrl(item.product?.primary_image?.image_path)} 
                                                                                alt={item.product?.name}
                                                                                className="w-full h-full object-cover"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-bold text-stone-900">{item.product?.name}</p>
                                                                            <p className="text-[10px] text-stone-400">Réf: {item.product?.id}</p>
                                                                            {(item.length_cm || item.width_cm) && (
                                                                                <p className="text-[10px] text-primary font-bold mt-1 uppercase tracking-wider">
                                                                                    Dimensions: {item.length_cm} x {item.width_cm} cm
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 text-center font-bold text-stone-600">
                                                                    x{item.quantity}
                                                                </td>
                                                                <td className="px-6 py-4 text-right font-medium text-stone-500 uppercase text-[10px]">
                                                                    {item.unit_price || item.product_price || 0} MAD
                                                                </td>
                                                                <td className="px-6 py-4 text-right font-bold text-stone-900">
                                                                    {item.subtotal || ((item.unit_price || item.product_price || 0) * item.quantity)} MAD
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Summary */}
                                            <div className="p-8 bg-stone-900 text-white rounded-b-2xl">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="text-stone-400 text-[10px] uppercase tracking-widest font-black mb-1">Montant Total</p>
                                                        <p className="text-3xl font-serif font-bold italic tracking-tight">{selectedOrder.total_amount} MAD</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="flex items-center gap-2 text-primary font-bold mb-1">
                                                            <PackageCheck size={16} />
                                                            <span className="text-[10px] uppercase tracking-widest">Paiement à la livraison</span>
                                                        </div>
                                                        <p className="text-xs text-stone-400">Total TTC incluant frais de port</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {selectedOrder.notes && (
                                            <div className="mt-6 p-6 bg-amber-50 rounded-2xl border border-amber-100">
                                                <p className="text-[10px] uppercase tracking-widest font-black text-amber-600 mb-2">Notes client</p>
                                                <p className="text-sm text-amber-900 italic">&ldquo;{selectedOrder.notes}&rdquo;</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
