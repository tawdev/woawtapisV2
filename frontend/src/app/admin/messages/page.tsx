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
        <div className="space-y-8 pb-12 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-playfair font-bold text-stone-900 tracking-tight italic flex items-center gap-4">
                        Boîte de Réception
                        {messages.length > 0 && (
                            <span className="flex items-center justify-center w-8 h-8 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-sans font-bold not-italic">
                                {pagination?.total || messages.length}
                            </span>
                        )}
                    </h1>
                    <p className="text-stone-500 font-medium mt-2">Répondez aux demandes exclusives de vos clients et artisans.</p>
                </div>
            </div>

            {/* Main Wrapper */}
            <div className="bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] border border-stone-100/60 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-stone-50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 relative z-10">
                        <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mb-4">
                            <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
                        </div>
                        <p className="text-stone-400 text-xs font-black uppercase tracking-[0.2em] animate-pulse">Récupération des correspondances...</p>
                    </div>
                ) : (
                    <div className="relative z-10 overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-stone-50/50 text-stone-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                    <th className="px-8 py-5">Expéditeur</th>
                                    <th className="px-8 py-5">Sujet Principal</th>
                                    <th className="px-8 py-5">Date d'Envoi</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {messages.map((msg) => (
                                    <tr key={msg.id} className="group hover:bg-stone-50/50 transition-all duration-300 cursor-pointer" onClick={() => setSelectedMessage(msg)}>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-[1.25rem] bg-stone-50 flex items-center justify-center border border-stone-100/50 group-hover:scale-105 transition-transform">
                                                    <span className="text-lg font-playfair font-bold text-stone-900">{msg.name.charAt(0)}</span>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-stone-900 group-hover:text-amber-600 transition-colors">{msg.name}</div>
                                                    <div className="text-[10px] text-stone-400 font-black tracking-widest uppercase mt-1">{msg.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className="text-sm font-bold text-stone-700 truncate max-w-xs">{msg.subject || '— Sans sujet —'}</div>
                                                {msg.subject?.includes('SUR MESURE') && (
                                                    <span className="px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-100 rounded text-[8px] font-black uppercase tracking-widest whitespace-nowrap">Sur-Mesure</span>
                                                )}
                                            </div>
                                            <div className="text-[11px] font-medium text-stone-400 truncate max-w-xs mt-1 italic opacity-70">{msg.message}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-stone-400">
                                                <Clock className="w-3 h-3 text-emerald-500" />
                                                {new Date(msg.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                                                <button
                                                    onClick={() => setSelectedMessage(msg)}
                                                    className="w-10 h-10 rounded-xl bg-white border border-stone-100 text-stone-400 hover:text-stone-900 hover:border-stone-900 hover:shadow-lg transition-all flex items-center justify-center"
                                                    title="Lire le message"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(msg.id)}
                                                    className="w-10 h-10 rounded-xl bg-white border border-stone-100 text-stone-300 hover:text-red-600 hover:border-red-100 hover:bg-red-50 hover:shadow-lg transition-all flex items-center justify-center"
                                                    title="Supprimer"
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

                {/* Pagination */}
                {!loading && pagination?.last_page > 1 && (
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
            </div>

            {/* Message Detail Overlay */}
            {selectedMessage && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-md" onClick={() => setSelectedMessage(null)} />
                    <div className="relative bg-[#FDFCFB] w-full max-w-4xl max-h-[90vh] rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col border border-stone-200/50">
                        {/* Header */}
                        <div className="px-12 py-10 border-b border-stone-100 flex items-center justify-between bg-white relative">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-200 via-emerald-500 to-emerald-200" />
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-sm">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-playfair font-bold text-stone-900 italic tracking-tight">Lecture du Courrier</h2>
                                    <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Correspondance Privée</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedMessage(null)} 
                                className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-900 hover:rotate-90 hover:bg-white transition-all duration-500 shadow-sm"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                            <div className="space-y-12 max-w-2xl mx-auto">
                                <div className="flex items-start gap-8">
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-white border border-stone-100 shadow-sm flex flex-shrink-0 items-center justify-center text-2xl font-playfair font-bold text-stone-900 mt-2">
                                        {selectedMessage.name.charAt(0)}
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xl font-bold text-stone-900 tracking-tight">{selectedMessage.name}</p>
                                        <div className="flex flex-wrap items-center gap-4 text-[10px] font-black tracking-[0.2em] uppercase">
                                            <span className="text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100/50">{selectedMessage.email}</span>
                                            {selectedMessage.phone && (
                                                <span className="text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100/50">{selectedMessage.phone}</span>
                                            )}
                                            <span className="text-stone-400 flex items-center gap-2">
                                                <Clock className="w-3 h-3" />
                                                {new Date(selectedMessage.created_at).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-[2rem] p-10 shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-stone-100 relative">
                                    <div className="absolute top-10 left-10 w-12 h-12 flex items-center justify-center border-l-2 border-t-2 border-stone-100/50 rounded-tl-2xl" />
                                    <div className="absolute bottom-10 right-10 w-12 h-12 flex items-center justify-center border-r-2 border-b-2 border-stone-100/50 rounded-br-2xl" />
                                    
                                    <div className="relative z-10">
                                        <h3 className="text-lg font-playfair font-bold text-stone-900 mb-8 italic pb-6 border-b border-stone-50 select-all">Objet: {selectedMessage.subject || 'Sans objet sélectionné'}</h3>
                                        <div className="text-stone-600 leading-loose text-sm whitespace-pre-wrap select-all font-medium">
                                            {selectedMessage.message}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-12 py-8 bg-stone-50/80 border-t border-stone-100 flex justify-between items-center backdrop-blur-sm">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Archivage ou réponse requise</p>
                            <div className="flex gap-4">
                                <a
                                    href={`mailto:${selectedMessage.email}?subject=RE: ${selectedMessage.subject}`}
                                    className="px-8 py-3.5 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 hover:scale-105 transition-all shadow-xl shadow-emerald-100 flex items-center gap-3"
                                >
                                    <Mail className="w-4 h-4" />
                                    <span className="hidden sm:inline">Répondre</span>
                                </a>
                                <button
                                    onClick={() => handleDelete(selectedMessage.id)}
                                    className="px-8 py-3.5 bg-white text-stone-400 border border-stone-100 hover:text-red-500 hover:border-red-100 hover:bg-red-50 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm flex items-center gap-3 group"
                                >
                                    <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    <span className="hidden sm:inline">Archiver</span>
                                </button>
                            </div>
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
            `}</style>
        </div>
    );
}
