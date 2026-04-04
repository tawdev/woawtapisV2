import { FaInstagram, FaPinterestP, FaFacebookF, FaTiktok } from 'react-icons/fa6';
import React, { useState } from 'react';
import { CheckCircle2, Loader2, Mail, MapPin, Phone, ArrowRight } from 'lucide-react';

const socials = [
    { icon: FaInstagram, href: 'https://instagram.com/waootapis', label: 'Instagram' },
    { icon: FaPinterestP, href: 'https://pinterest.com', label: 'Pinterest' },
    { icon: FaFacebookF, href: 'https://facebook.com', label: 'Facebook' },
    { icon: FaTiktok, href: 'https://tiktok.com', label: 'TikTok' },
];

export default function Footer() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleNewsletter = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            setEmail('');
        }, 1500);
    };

    return (
        <footer className="bg-[#1C1917] text-white pt-32 pb-16 border-t border-white/5 font-sans relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0" />
            
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">
                    
                    {/* Brand Column */}
                    <div className="lg:col-span-4 space-y-10 group">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center text-primary font-serif font-black text-2xl group-hover:bg-primary group-hover:text-white transition-all duration-700 shadow-2xl">W</div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-playfair font-black italic tracking-tighter leading-none">WOW TAPIS</span>
                                <span className="text-[10px] uppercase font-black tracking-[0.4em] text-primary opacity-80 mt-1">L&apos;art & Le Geste</span>
                            </div>
                        </div>
                        <p className="text-stone-400 text-lg font-light leading-relaxed max-w-sm italic">
                            Nous préservons le savoir-faire ancestral du tissage berbère pour sublimer vos intérieurs avec des pièces uniques et intemporelles.
                        </p>
                        <div className="flex gap-4">
                            {socials.map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-stone-400 hover:text-white hover:border-primary hover:bg-primary/20 transition-all duration-500 shadow-lg"
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Nav Columns */}
                    <div className="lg:col-span-2 space-y-8">
                        <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-primary">Maison</h4>
                        <ul className="space-y-4">
                            {['Nos Tapis', 'Sur Mesure', 'Collections', 'À Propos', 'Le Journal'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-stone-400 hover:text-white text-xs uppercase tracking-widest font-black transition-all duration-300 flex items-center gap-3 group">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary scale-0 group-hover:scale-100 transition-transform" />
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-2 space-y-8">
                        <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-primary">Conciergerie</h4>
                        <ul className="space-y-4">
                            {['Suivi de Commande', 'Livraison & Délais', 'Retours & Échanges', 'Contact Express', 'WhatsApp Direct'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-stone-400 hover:text-white text-xs uppercase tracking-widest font-black transition-all duration-300 flex items-center gap-3 group">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary scale-0 group-hover:scale-100 transition-transform" />
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter Container */}
                    <div className="lg:col-span-4 space-y-8 relative p-10 bg-white/5 border border-white/10 rounded-[2.5rem] shadow-2xl backdrop-blur-sm">
                        <div className="space-y-4">
                            <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-primary">Cercle Privé</h4>
                            <p className="text-stone-300 text-sm font-light italic leading-relaxed">Rejoignez-nous pour découvrir nos ventes privées et nouvelles collections d&apos;exception.</p>
                        </div>
                        
                        {success ? (
                            <div className="flex items-center gap-4 text-primary bg-primary/10 p-6 rounded-2xl border border-primary/20 animate-in fade-in zoom-in duration-500">
                                <CheckCircle2 size={24} />
                                <span className="text-xs uppercase tracking-widest font-black">Bienvenue parmi nous</span>
                            </div>
                        ) : (
                            <form onSubmit={handleNewsletter} className="space-y-4">
                                <div className="relative group">
                                    <input
                                        required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                        placeholder="votre@email.com"
                                        className="w-full bg-transparent border-b-2 border-white/10 py-5 outline-none focus:border-primary transition-all text-sm font-light text-stone-200"
                                    />
                                    <button 
                                        disabled={loading}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 p-4 text-primary hover:text-white transition-colors disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={24} />}
                                    </button>
                                </div>
                                <p className="text-[9px] uppercase tracking-widest text-stone-500 font-bold">* Désabonnement possible en un clic</p>
                            </form>
                        )}
                        
                        {/* Fake Payment Icons Placeholder for aesthetics */}
                        <div className="pt-6 flex gap-6 opacity-30 grayscale items-center">
                             <div className="h-4 w-8 bg-stone-500 rounded-sm" />
                             <div className="h-4 w-7 bg-stone-500 rounded-sm" />
                             <div className="h-4 w-10 bg-stone-500 rounded-sm" />
                             <div className="h-4 w-6 bg-stone-500 rounded-sm" />
                        </div>
                    </div>
                </div>

                <div className="pt-16 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-10">
                    <div className="flex flex-col md:flex-row items-center gap-10 text-[10px] uppercase tracking-[0.3em] font-black text-stone-500">
                        <p>© 2026 WOW TAPIS. ÉDITÉ PAR <a href="https://cdigital.ma" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-white transition-colors">CDIGITAL.MA</a></p>
                        <div className="hidden md:block w-1.5 h-1.5 bg-white/10 rounded-full" />
                        <p>Artisanat d&apos;excellence</p>
                    </div>
                    <div className="flex items-center gap-12 text-[10px] uppercase tracking-[0.3em] font-black text-stone-500">
                        <a href="#" className="hover:text-white transition-colors">Mentions Légales</a>
                        <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
