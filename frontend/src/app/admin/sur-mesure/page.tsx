'use client';

import React, { useState, useEffect } from 'react';
import { adminService } from '@/services/admin';
import {
    Layers,
    Phone,
    Mail,
    Clock,
    User,
    ChevronLeft,
    ChevronRight,
    Search,
    Download,
    Eye,
    CheckCircle2,
    XCircle,
    Loader2,
    Calendar,
    Ruler,
    Palette,
    Sparkles,
    PenTool
} from 'lucide-react';

export default function AdminSurMesurePage() {
    // Print styles
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            @media print {
                body * { visibility: hidden; }
                .modal-print-content, .modal-print-content * { visibility: visible; }
                .modal-print-content { 
                    position: absolute; 
                    left: 0; 
                    top: 0; 
                    width: 100%;
                    padding: 0 !important;
                    margin: 0 !important;
                    box-shadow: none !important;
                    border: none !important;
                }
                .no-print { display: none !important; }
            }
        `;
        document.head.appendChild(style);
        return () => { document.head.removeChild(style); };
    }, []);
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRequest, setSelectedRequest] = useState<any>(null);

    useEffect(() => {
        fetchRequests();
    }, [page]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            // We fetch all messages and filter by 'SUR MESURE' subject
            // Note: In a real app with many messages, the backend should have a dedicated endpoint
            const res = await adminService.getMessages(page);
            const filtered = res.data.data.filter((m: any) => m.subject?.toUpperCase().includes('SUR MESURE'));
            
            setRequests(filtered);
            setPagination({
                current_page: res.data.current_page,
                last_page: res.data.last_page,
                total: res.data.total
            });
        } catch (error) {
            console.error('Error fetching sur-mesure requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const parseMessage = (msg: string) => {
        const lines = msg.split('\n');
        const data: any = {};
        lines.forEach(line => {
            if (line.startsWith('Style: ')) data.style = line.replace('Style: ', '').replace(' (IMAGE PERSONNALISÉE FOURNIE)', '');
            if (line.startsWith('Dimensions: ')) data.dimensions = line.replace('Dimensions: ', '');
            if (line.startsWith('Teinte: ')) data.color = line.replace('Teinte: ', '');
            if (line.startsWith('Total estimé: ')) data.price = line.replace('Total estimé: ', '');
            if (line.startsWith('Notes: ')) data.notes = line.replace('Notes: ', '');
        });
        return data;
    };

    const getStyleImage = (request: any) => {
        if (request.style_image) return request.style_image;
        
        const details = parseMessage(request.message);
        const styleName = details.style?.toLowerCase() || '';
        
        if (styleName.includes('beni')) return '/images/textures/beni.png';
        if (styleName.includes('kilim')) return '/images/textures/kilim.png';
        if (styleName.includes('vintage') || styleName.includes('azilal')) return '/images/inspiration/vintage_azilal.png';
        if (styleName.includes('contemporain') || styleName.includes('moderne')) return '/images/inspiration/dining_modern.png';
        
        return null; // Fallback to icon
    };

    const filteredRequests = requests.filter(req => 
        req.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        req.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-stone-900 rounded-[1.75rem] flex items-center justify-center text-white shadow-2xl">
                            <Layers size={28} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-playfair font-bold text-stone-900 tracking-tight italic">Réservations Sur-Mesure</h1>
                            <p className="text-stone-500 font-medium mt-1">Gérez les demandes de personnalisation exclusive.</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Rechercher un client..."
                            className="w-full pl-11 pr-4 py-3 bg-white border border-stone-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-stone-50 outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-[2.5rem] border border-stone-100/60 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-stone-50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none opacity-50" />
                
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 relative z-10">
                        <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mb-4">
                            <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
                        </div>
                        <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Extraction des demandes...</p>
                    </div>
                ) : filteredRequests.length > 0 ? (
                    <div className="overflow-x-auto relative z-10">
                        <table className="w-full text-left">
                            <thead className="bg-stone-50/50 border-b border-stone-100">
                                <tr className="text-stone-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                    <th className="px-8 py-6">Client</th>
                                    <th className="px-8 py-6">Style & Teinte</th>
                                    <th className="px-8 py-6">Dimensions</th>
                                    <th className="px-8 py-6">Estimation</th>
                                    <th className="px-8 py-6">Date</th>
                                    <th className="px-8 py-6 text-right">Détails</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-50">
                                {filteredRequests.map((req) => {
                                    const details = parseMessage(req.message);
                                    return (
                                        <tr key={req.id} className="group hover:bg-stone-50/30 transition-all duration-300">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center text-stone-900 font-bold border border-stone-100">
                                                        {req.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-stone-900 group-hover:text-amber-600 transition-colors uppercase tracking-tight">{req.name}</div>
                                                        <div className="text-[10px] text-stone-400 mt-1">{req.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-4">
                                                        {getStyleImage(req) ? (
                                                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-stone-100 shadow-sm shrink-0 bg-stone-50">
                                                                <img src={getStyleImage(req)} alt="style visual" className="w-full h-full object-cover" />
                                                            </div>
                                                        ) : (
                                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${details.style?.includes('Inspiration') ? 'bg-amber-50 text-amber-500 border-amber-100' : 'bg-stone-50 text-stone-300 border-stone-100'}`}>
                                                                {details.style?.includes('Inspiration') ? <PenTool size={20} /> : <Sparkles size={20} />}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="text-sm font-bold text-stone-700 uppercase tracking-tight">{details.style || '—'}</div>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <Palette size={10} className="text-amber-400" />
                                                                <span className="text-[10px] font-medium text-stone-400 uppercase tracking-widest">{details.color || '—'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 text-sm font-bold text-stone-600">
                                                    <Ruler size={14} className="text-stone-300" />
                                                    {details.dimensions || 'Standard'}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-sm font-black text-stone-900 bg-stone-50 px-3 py-1 rounded-lg border border-stone-100">
                                                    {details.price || 'À estimer'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                                                    <Calendar size={12} className="text-emerald-500" />
                                                    {new Date(req.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button
                                                    onClick={() => setSelectedRequest(req)}
                                                    className="w-10 h-10 bg-white border border-stone-100 rounded-xl text-stone-400 hover:text-stone-900 hover:border-stone-900 hover:shadow-xl transition-all inline-flex items-center justify-center"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-32 flex flex-col items-center justify-center opacity-40">
                        <Layers size={48} className="text-stone-300 mb-6" />
                        <h3 className="text-xl font-bold font-playfair italic">Aucune demande trouvée</h3>
                        <p className="text-xs font-black uppercase tracking-widest mt-2">Votre atelier est prêt pour de nouveaux défis.</p>
                    </div>
                )}
            </div>

            {/* Pagination Placeholder */}
            {!loading && pagination?.last_page > 1 && (
                <div className="flex items-center justify-between px-2">
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">Affichage {filteredRequests.length} sur {pagination.total}</p>
                    <div className="flex gap-4">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="px-6 py-2.5 bg-white border border-stone-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-stone-600 disabled:opacity-30 hover:bg-stone-50 transition-all shadow-sm"
                        >
                            Précédent
                        </button>
                        <button
                            disabled={page === pagination.last_page}
                            onClick={() => setPage(page + 1)}
                            className="px-6 py-2.5 bg-white border border-stone-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-stone-900 disabled:opacity-30 hover:bg-stone-50 transition-all shadow-sm"
                        >
                            Suivant
                        </button>
                    </div>
                </div>
            )}

            {/* Detail Modal Overlay */}
            {selectedRequest && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-md no-print" onClick={() => setSelectedRequest(null)} />
                    <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col border border-stone-200/50 modal-print-content">
                        {/* Modal Header */}
                        <div className="px-12 py-10 border-b border-stone-50 flex items-center justify-between bg-white/50 backdrop-blur-xl sticky top-0 z-20">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-stone-900 rounded-[2rem] flex items-center justify-center text-white shadow-xl">
                                    <Layers size={28} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-playfair font-bold text-stone-900 italic tracking-tight">Détails de la Commande</h2>
                                    <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1 italic">Vérification de faisabilité</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-900 hover:bg-white transition-all shadow-sm no-print"
                            >
                                <XCircle size={24} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-12 space-y-12">
                            {/* Client Info Banner */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-stone-50 rounded-[2.5rem] border border-stone-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                                
                                <div className="space-y-2">
                                    <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest block">Client Nom</span>
                                    <div className="text-lg font-bold text-stone-900 flex items-center gap-3">
                                        <User size={18} className="text-stone-400" />
                                        {selectedRequest.name}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest block">Email</span>
                                    <div className="text-sm font-bold text-stone-900 flex items-center gap-3 truncate">
                                        <Mail size={18} className="text-stone-400" />
                                        {selectedRequest.email}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest block">Téléphone</span>
                                    <div className="text-sm font-bold text-stone-900 flex items-center gap-3">
                                        <Phone size={18} className="text-stone-400" />
                                        {selectedRequest.phone || 'Non renseigné'}
                                    </div>
                                </div>
                            </div>

                            {/* Technical Specs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <h3 className="text-xl font-playfair font-bold text-stone-900 italic border-b border-stone-100 pb-4">Spécifications Techniques</h3>
                                    
                                    <div className="space-y-6">
                                        {Object.entries(parseMessage(selectedRequest.message)).map(([key, value]: any) => {
                                            if (key === 'notes' || key === 'price') return null;
                                            return (
                                                <div key={key} className="flex justify-between items-center group">
                                                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{key}</span>
                                                    <span className="text-sm font-bold text-stone-900 group-hover:text-amber-600 transition-colors">{value}</span>
                                                </div>
                                            );
                                        })}
                                        <div className="pt-6 border-t border-stone-50 flex justify-between items-center">
                                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] italic">Estimation Finale</span>
                                            <span className="text-2xl font-black text-stone-900">
                                                {parseMessage(selectedRequest.message).price}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <h3 className="text-xl font-playfair font-bold text-stone-900 italic border-b border-stone-100 pb-4">Référence Visuelle</h3>
                                    {getStyleImage(selectedRequest) ? (
                                        <div className="rounded-[2.5rem] border border-stone-100 overflow-hidden shadow-2xl bg-stone-50">
                                            <img src={getStyleImage(selectedRequest)} alt="style visual" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700 max-h-[400px]" />
                                            <div className="p-6 bg-stone-900 text-white text-[9px] font-black uppercase tracking-widest text-center">
                                                {selectedRequest.style_image ? "Visuel de d'inspiration client" : "Référence du style sélectionné"}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-8 bg-amber-50/30 rounded-[2.5rem] border border-stone-100/50 min-h-[150px] relative">
                                            <div className="absolute top-6 left-6 text-amber-200/50 select-none">
                                                <Layers size={40} />
                                            </div>
                                            <p className="text-stone-600 leading-relaxed text-sm relative z-10 font-medium whitespace-pre-wrap italic text-center">
                                                "{parseMessage(selectedRequest.message).notes || 'Aucune consigne particulière ajoutée.'}"
                                            </p>
                                        </div>
                                    )}
                                    {selectedRequest.style_image && parseMessage(selectedRequest.message).notes && (
                                        <div className="p-8 bg-stone-50 rounded-[2rem] border border-stone-100">
                                            <p className="text-stone-600 text-sm font-medium italic">"{parseMessage(selectedRequest.message).notes}"</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-12 py-8 bg-stone-900 flex flex-col sm:flex-row items-center justify-between gap-6 no-print">
                            <div className="flex gap-4">
                                <button
                                    onClick={() => window.print()}
                                    className="px-6 py-3.5 bg-stone-800 text-stone-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-white hover:bg-stone-700 transition-all flex items-center gap-3 border border-stone-700/50"
                                >
                                    <Download className="w-4 h-4" />
                                    Fiche Atelier
                                </button>
                                <button
                                    onClick={async () => {
                                        if (confirm('Voulez-vous archiver (supprimer) cette demande définitivement ?')) {
                                            try {
                                                await adminService.deleteMessage(selectedRequest.id);
                                                setSelectedRequest(null);
                                                fetchRequests();
                                            } catch (err) {
                                                alert('Erreur lors de l’archivage');
                                            }
                                        }
                                    }}
                                    className="px-6 py-3.5 bg-stone-800 text-rose-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-white hover:bg-rose-900/50 transition-all flex items-center gap-3 border border-rose-900/20"
                                >
                                    <XCircle className="w-4 h-4" />
                                    Archiver
                                </button>
                            </div>
                            <div className="flex gap-4">
                                <a
                                    href={`mailto:${selectedRequest.email}?subject=RE: ${selectedRequest.subject}`}
                                    className="px-8 py-3.5 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/50 flex items-center gap-3"
                                >
                                    <Mail className="w-4 h-4" />
                                    Initier le devis
                                </a>
                                {selectedRequest.phone && (
                                    <a
                                        href={`https://wa.me/${selectedRequest.phone.replace(/[^0-9]/g, '')}`}
                                        target="_blank"
                                        className="px-8 py-3.5 bg-white text-stone-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-stone-50 transition-all shadow-xl flex items-center gap-3"
                                    >
                                        <Phone className="w-4 h-4 text-emerald-500" />
                                        WhatsApp
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
