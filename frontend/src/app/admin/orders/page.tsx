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
    Hash,
    Filter,
    Download,
    ArrowUpRight,
    TrendingUp,
    Clock4
} from 'lucide-react';
import { getImageUrl } from '@/services/api';
import Link from 'next/link';

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

    const totalStats = {
        total: orders.reduce((acc, curr) => acc + (parseFloat(curr.total_amount) || 0), 0),
        pending: orders.filter(o => o.status === 'pending').length
    };

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-700">
            {/* Header with Stats */}
            <div className="flex flex-col lg:flex-row justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-playfair font-bold text-stone-900 tracking-tight italic">Journal des Acquisitions</h1>
                    <p className="text-stone-500 font-medium mt-1">Gérez le flux de vos pièces artisanales d'exception.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white p-5 rounded-3xl border border-stone-100 shadow-sm flex items-center gap-4 min-w-[200px]">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Total Ventes</p>
                            <p className="text-xl font-bold text-stone-900">{totalStats.total.toLocaleString()} <span className="text-[10px] font-medium">MAD</span></p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-3xl border border-stone-100 shadow-sm flex items-center gap-4 min-w-[200px]">
                        <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                            <Clock4 size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">En attente</p>
                            <p className="text-xl font-bold text-stone-900">{totalStats.pending} <span className="text-[10px] font-medium">Commandes</span></p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Table Card */}
            <div className="bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] border border-stone-100/60 overflow-hidden">
                <div className="px-8 py-6 border-b border-stone-50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                            <input 
                                type="text" 
                                placeholder="Rechercher une commande..." 
                                className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium outline-none focus:bg-white focus:ring-4 focus:ring-stone-50 focus:border-stone-200 transition-all"
                            />
                        </div>
                        <button className="p-3 bg-white border border-stone-100 rounded-2xl text-stone-500 hover:text-stone-900 transition-all shadow-sm">
                            <Filter size={18} />
                        </button>
                    </div>
                    <button className="flex items-center gap-3 bg-stone-900 text-white px-6 py-3 rounded-2xl font-bold text-xs hover:bg-stone-800 transition-all">
                        <Download size={16} />
                        Exporter CSV
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-stone-50/50 text-stone-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                <th className="px-8 py-5">Référence & Date</th>
                                <th className="px-8 py-5">Client d'Exception</th>
                                <th className="px-8 py-5">Montant Acquisition</th>
                                <th className="px-8 py-5">Statut Actuel</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-32 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <LoaderIcon className="animate-spin text-stone-300" size={32} />
                                            <p className="text-stone-400 text-xs font-black uppercase tracking-widest">Récupération du registre...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => {
                                    const statusInfo = orderStatusMap[order.status as keyof typeof orderStatusMap] || { label: order.status, color: 'text-stone-500 bg-stone-50' };
                                    return (
                                        <tr key={order.id} className="group hover:bg-stone-50/50 transition-all duration-300">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-900 font-black text-[10px]">
                                                        {order.order_number.slice(-2)}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-stone-900 group-hover:text-primary transition-colors">#{order.order_number}</div>
                                                        <div className="text-[10px] text-stone-400 font-medium mt-1">{new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px] font-bold">
                                                        {order.customer_name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-stone-900">{order.customer_name}</div>
                                                        <div className="text-[10px] text-stone-400 mt-0.5 italic">{order.customer_city}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-sm font-bold text-stone-900">
                                                {parseFloat(order.total_amount).toLocaleString()} <span className="text-[10px] font-serif uppercase tracking-widest opacity-40">MAD</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="relative inline-block w-full max-w-[160px]">
                                                    {updatingId === order.id ? (
                                                        <div className="flex items-center gap-2 text-stone-400 text-[10px] font-black uppercase tracking-widest pl-3 py-2">
                                                            <LoaderIcon className="animate-spin" size={12} />
                                                            Sync...
                                                        </div>
                                                    ) : (
                                                        <select
                                                            value={order.status}
                                                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                            className={`w-full appearance-none px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer outline-none transition-all ${statusInfo.color} border border-transparent hover:border-current/20`}
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
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleViewDetails(order.id)}
                                                        className="w-10 h-10 rounded-xl bg-white border border-stone-100 text-stone-400 hover:text-stone-900 hover:border-stone-900 hover:shadow-lg transition-all flex items-center justify-center"
                                                        title="Inspecter"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(order.id)}
                                                        className="w-10 h-10 rounded-xl bg-white border border-stone-100 text-stone-300 hover:text-red-600 hover:border-red-100 hover:bg-red-50 hover:shadow-lg transition-all flex items-center justify-center"
                                                        title="Archiver"
                                                    >
                                                        <TrashIcon size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && pagination?.last_page > 1 && (
                    <div className="px-8 py-6 bg-stone-50/50 border-t border-stone-50 flex items-center justify-between">
                        <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                            Page <span className="text-stone-900">{pagination.current_page}</span> sur <span className="text-stone-900">{pagination.last_page}</span> — <span className="text-stone-900 font-serif italic">{pagination.total} commandes</span>
                        </div>
                        <div className="flex gap-3">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                className="flex items-center gap-2 px-6 py-2.5 bg-white border border-stone-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-stone-600 disabled:opacity-30 hover:bg-stone-50 transition-all shadow-sm"
                            >
                                <PrevIcon size={14} />
                                Précédent
                            </button>
                            <button
                                disabled={page === pagination.last_page}
                                onClick={() => setPage(page + 1)}
                                className="flex items-center gap-2 px-6 py-2.5 bg-white border border-stone-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-stone-900 disabled:opacity-30 hover:bg-stone-50 transition-all shadow-sm"
                            >
                                Suivant
                                <NextIcon size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de Détails (Inspiré de votre Checkout Success) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-[#FDFCFB] w-full max-w-5xl max-h-[92vh] rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col border border-stone-200/50">
                        {/* Modal Header */}
                        <div className="px-12 py-10 border-b border-stone-100 flex items-center justify-between bg-white relative">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
                            <div>
                                <div className="flex items-center gap-5">
                                    <h2 className="text-3xl font-playfair font-bold text-stone-900 italic tracking-tight">
                                        Fiche Commande {selectedOrder && `#${selectedOrder.order_number}`}
                                    </h2>
                                    {selectedOrder && (
                                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${orderStatusMap[selectedOrder.status as keyof typeof orderStatusMap]?.color}`}>
                                            {orderStatusMap[selectedOrder.status as keyof typeof orderStatusMap]?.label}
                                        </div>
                                    )}
                                </div>
                                <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Détails de transaction artisanale</p>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-900 hover:rotate-90 hover:bg-white transition-all duration-500 shadow-sm"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-12">
                            {detailsLoading ? (
                                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                                    <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center">
                                        <LoaderIcon className="w-8 h-8 animate-spin text-primary" />
                                    </div>
                                    <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest animate-pulse">Accès aux coffres...</p>
                                </div>
                            ) : selectedOrder ? (
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                                    {/* Left Content (Info) */}
                                    <div className="lg:col-span-4 space-y-12">
                                        <div className="space-y-8">
                                            <section>
                                                <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-stone-400 mb-6 flex items-center gap-3">
                                                    <UserIcon size={12} className="text-primary" />
                                                    Le Client
                                                </h3>
                                                <div className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-stone-100 space-y-6">
                                                    <div>
                                                        <p className="text-[11px] font-black uppercase tracking-widest text-stone-400 opacity-60 mb-2">Nom Complet</p>
                                                        <p className="text-lg font-bold text-stone-900 tracking-tight">{selectedOrder.customer_name}</p>
                                                    </div>
                                                    <div className="flex items-center gap-4 group">
                                                        <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center border border-stone-100 text-stone-400 group-hover:text-primary transition-colors">
                                                            <Mail size={16} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[9px] font-black uppercase tracking-widest text-stone-300">Email</p>
                                                            <p className="text-sm font-bold text-stone-900 truncate">{selectedOrder.customer_email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 group">
                                                        <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center border border-stone-100 text-stone-400 group-hover:text-primary transition-colors">
                                                            <Phone size={16} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] font-black uppercase tracking-widest text-stone-300">Contact</p>
                                                            <p className="text-sm font-bold text-stone-900">{selectedOrder.customer_phone}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>

                                            <section>
                                                <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-stone-400 mb-6 flex items-center gap-3">
                                                    <PinIcon size={12} className="text-primary" />
                                                    Destination
                                                </h3>
                                                <div className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-stone-100 space-y-6">
                                                    <div>
                                                        <p className="text-[11px] font-black uppercase tracking-widest text-stone-400 opacity-60 mb-2">Ville & Adresse</p>
                                                        <p className="text-lg font-bold text-stone-900 leading-tight italic">{selectedOrder.customer_city}</p>
                                                        <p className="text-sm font-medium text-stone-500 mt-3 leading-relaxed">
                                                            {selectedOrder.customer_address}
                                                        </p>
                                                    </div>
                                                </div>
                                            </section>
                                        </div>
                                    </div>

                                    {/* Right Content (Items) */}
                                    <div className="lg:col-span-8 flex flex-col">
                                        <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-stone-400 mb-6 flex items-center gap-3">
                                            <CartIcon size={12} className="text-primary" />
                                            Sélection d&apos;Exception
                                        </h3>
                                        <div className="flex-1 bg-white rounded-[2.5rem] shadow-[0_20px_80px_rgba(0,0,0,0.03)] border border-stone-100 overflow-hidden flex flex-col">
                                            <div className="flex-1 overflow-y-auto max-h-[450px] p-2">
                                                <table className="w-full text-left">
                                                    <thead>
                                                        <tr className="text-[10px] uppercase tracking-[0.2em] font-black text-stone-300 border-b border-stone-50">
                                                            <th className="px-8 py-6">Composition</th>
                                                            <th className="px-8 py-6 text-center">Unités</th>
                                                            <th className="px-8 py-6 text-right">Valeur</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-stone-50">
                                                        {selectedOrder.items?.map((item: any) => (
                                                            <tr key={item.id} className="group hover:bg-stone-50/50 transition-all duration-300">
                                                                <td className="px-8 py-6">
                                                                    <div className="flex items-center gap-6">
                                                                        <div className="w-16 h-20 rounded-2xl overflow-hidden bg-stone-50 border border-stone-100 flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                                                                            <img 
                                                                                src={getImageUrl(item.product?.primary_image?.image_path)} 
                                                                                alt={item.product?.name}
                                                                                className="w-full h-full object-cover"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-base font-playfair font-bold text-stone-900 leading-tight italic">{item.product?.name}</p>
                                                                            <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mt-1 opacity-50">Ref. {item.product?.id}</p>
                                                                            {(item.length_cm || item.width_cm) && (
                                                                                <div className="inline-flex mt-3 px-3 py-1 bg-primary/5 rounded-lg border border-primary/10 text-[9px] font-black text-primary uppercase tracking-[0.2em]">
                                                                                    {item.length_cm} x {item.width_cm} cm
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-8 py-6 text-center font-bold text-stone-900 italic">
                                                                    {item.quantity}
                                                                </td>
                                                                <td className="px-8 py-6 text-right font-bold text-stone-900">
                                                                    {parseFloat(item.subtotal).toLocaleString()} <span className="text-[10px] opacity-40">MAD</span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Summary Banner */}
                                            <div className="p-10 bg-stone-900 text-white relative">
                                                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                                                <div className="flex justify-between items-end relative z-10">
                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-3 text-primary">
                                                            <PackageCheck size={20} />
                                                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Paiement à la Livraison</span>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Valeur de l&apos;Acquisition</p>
                                                            <p className="text-5xl font-playfair font-bold italic">{parseFloat(selectedOrder.total_amount).toLocaleString()} <span className="text-xs font-sans tracking-widest uppercase ml-2 opacity-50">MAD</span></p>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        onClick={() => window.print()}
                                                        className="px-8 py-4 bg-white text-stone-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                                                    >
                                                        Imprimer Bon
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E5E7EB;
                    border-radius: 10px;
                }
                @media print {
                    .no-print, header, footer, nav, button, aside {
                        display: none !important;
                    }
                    body {
                        background: white !important;
                    }
                }
            `}</style>
        </div>
    );
}
