'use client';

import React, { useState, useEffect } from 'react';
import { adminService } from '@/services/admin';
import {
    MessageSquare,
    Trash2,
    Loader2,
    Mail,
    User,
    Clock,
    ChevronLeft,
    ChevronRight,
    Eye,
    X
} from 'lucide-react';

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState<any[]>([]);
    const [pagination, setPagination] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [selectedMessage, setSelectedMessage] = useState<any>(null);

    useEffect(() => {
        fetchMessages();
    }, [page]);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const response = await adminService.getMessages(page);
            setMessages(response.data.data);
            setPagination({
                current_page: response.data.current_page,
                last_page: response.data.last_page,
                total: response.data.total
            });
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Supprimer ce message ?')) {
            try {
                await adminService.deleteMessage(id);
                if (selectedMessage?.id === id) setSelectedMessage(null);
                fetchMessages();
            } catch (error) {
                alert('Erreur lors de la suppression');
            }
        }
    };

    return (
        <div className="space-y-6 relative min-h-[600px]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Messages</h1>
                    <p className="text-stone-500 text-sm">Répondez aux demandes de vos clients.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-[400px]">
                        <Loader2 className="w-8 h-8 animate-spin text-stone-400 mb-2" />
                        <p className="text-stone-400 text-sm">Chargement des messages...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-stone-50 text-stone-500 text-xs font-bold uppercase tracking-wider">
                                    <th className="px-6 py-4">Expéditeur</th>
                                    <th className="px-6 py-4">Sujet</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {messages.map((msg) => (
                                    <tr key={msg.id} className="hover:bg-stone-50 transition-colors cursor-pointer" onClick={() => setSelectedMessage(msg)}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center">
                                                    <User className="w-4 h-4 text-stone-500" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-stone-900">{msg.name}</div>
                                                    <div className="text-[10px] text-stone-400 font-mono">{msg.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-stone-700 truncate max-w-xs">{msg.subject || 'Sans sujet'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-[11px] text-stone-500">
                                                <Clock className="w-3 h-3" />
                                                {new Date(msg.created_at).toLocaleDateString('fr-FR')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                                                <button
                                                    onClick={() => setSelectedMessage(msg)}
                                                    className="p-2 text-stone-300 hover:text-stone-900 transition-colors"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(msg.id)}
                                                    className="p-2 text-stone-300 hover:text-red-500 transition-colors"
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

                {/* Pagination */}
                {!loading && pagination?.last_page > 1 && (
                    <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
                        <p className="text-sm text-stone-500">
                            Page <span className="font-bold">{pagination.current_page}</span> sur <span className="font-bold">{pagination.last_page}</span>
                        </p>
                        <div className="flex gap-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                className="p-2 rounded-lg border border-stone-200 bg-white disabled:opacity-50 hover:bg-stone-50"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                disabled={page === pagination.last_page}
                                onClick={() => setPage(page + 1)}
                                className="p-2 rounded-lg border border-stone-200 bg-white disabled:opacity-50 hover:bg-stone-50"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Message Detail Overlay */}
            {selectedMessage && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center text-white">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-stone-900">Détails du message</h2>
                                    <p className="text-[10px] text-stone-500 uppercase font-bold tracking-widest">Reçu le {new Date(selectedMessage.created_at).toLocaleDateString('fr-FR')}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedMessage(null)} className="p-2 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-900 transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-8 space-y-8">
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <p className="text-[10px] text-stone-400 uppercase font-black tracking-tighter mb-1">Expéditeur</p>
                                    <p className="text-stone-900 font-bold">{selectedMessage.name}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-stone-400 uppercase font-black tracking-tighter mb-1">Email</p>
                                    <p className="text-stone-900 font-bold font-mono">{selectedMessage.email}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] text-stone-400 uppercase font-black tracking-tighter mb-1">Sujet</p>
                                <p className="text-stone-900 font-black text-lg">{selectedMessage.subject || 'Sans sujet'}</p>
                            </div>
                            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100 italic text-stone-700 leading-relaxed">
                                &quot;{selectedMessage.message}&quot;
                            </div>
                        </div>
                        <div className="p-6 bg-stone-50 border-t border-stone-100 flex justify-end gap-3">
                            <button
                                onClick={() => handleDelete(selectedMessage.id)}
                                className="px-6 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-all flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Supprimer
                            </button>
                            <button
                                onClick={() => setSelectedMessage(null)}
                                className="px-6 py-2.5 bg-stone-900 text-white rounded-xl font-bold text-sm hover:bg-stone-800 transition-all"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
