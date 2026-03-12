'use client';

import React, { useState, useEffect } from 'react';
import { adminService } from '@/services/admin';
import { orderStatusMap } from '@/utils/status';
import {
    TrendingUp,
    ShoppingBag,
    Package as PackageIcon,
    MessageSquare,
    Clock,
    ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await adminService.getStats();
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 bg-white rounded-2xl border border-stone-200"></div>
                    ))}
                </div>
                <div className="h-96 bg-white rounded-2xl border border-stone-200"></div>
            </div>
        );
    }

    const cards = [
        {
            label: 'Ventes Totales',
            value: `${stats?.total_sales?.toLocaleString()} MAD`,
            icon: TrendingUp,
            color: 'bg-green-50 text-green-600'
        },
        {
            label: 'Commandes',
            value: stats?.orders_count,
            icon: ShoppingBag,
            color: 'bg-blue-50 text-blue-600'
        },
        {
            label: 'Produits',
            value: stats?.products_count,
            icon: PackageIcon,
            color: 'bg-purple-50 text-purple-600'
        },
        {
            label: 'Messages',
            value: stats?.messages_count,
            icon: MessageSquare,
            color: 'bg-amber-50 text-amber-600'
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Tableau de Bord</h1>
                <p className="text-stone-500">Aperçu global de votre activité pour aujourd'hui.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center mb-4`}>
                            <card.icon className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-medium text-stone-500 mb-1">{card.label}</p>
                        <h3 className="text-2xl font-bold text-stone-900">{card.value}</h3>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-stone-400" />
                        <h2 className="font-bold text-stone-900">Commandes Récentes</h2>
                    </div>
                    <Link href="/admin/orders" className="text-sm font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1">
                        Voir tout <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-stone-50 text-stone-500 text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">Commande</th>
                                <th className="px-6 py-4">Client</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Montant</th>
                                <th className="px-6 py-4">Statut</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {stats?.recent_orders?.map((order: any) => {
                                const status = orderStatusMap[order.status as keyof typeof orderStatusMap] || { label: order.status, color: 'text-stone-500 bg-stone-50' };
                                return (
                                    <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-stone-900 text-sm">#{order.order_number}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-stone-900">{order.customer_name}</div>
                                            <div className="text-xs text-stone-400">{order.customer_city}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-stone-600">
                                            {new Date(order.created_at).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-stone-900 text-sm">{order.total_amount} MAD</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tighter ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
