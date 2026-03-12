'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, Menu, User, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
    transparent?: boolean;
}

export default function Header({ transparent = false }: HeaderProps) {
    const router = useRouter();
    const { cartCount } = useCart();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    // Logic for dynamic styling
    const isTransparentMode = transparent && !isScrolled;
    const headerBg = isScrolled
        ? 'bg-white/95 backdrop-blur-xl py-4 shadow-sm'
        : transparent
            ? 'bg-transparent py-6'
            : 'bg-white/95 backdrop-blur-xl py-4 border-b border-stone-100 shadow-sm';

    const textColor = isTransparentMode ? 'text-white' : 'text-stone-900';
    const navTextColor = isTransparentMode ? 'text-white/80 hover:text-white' : 'text-stone-600 hover:text-primary';

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerBg}`}>
                <div className="container mx-auto px-4 flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-stone-900 rounded-full flex items-center justify-center text-primary font-serif font-bold text-xl group-hover:scale-110 transition-transform duration-500 border border-white/10">W</div>
                        <span className={`text-2xl font-serif font-bold tracking-tighter transition-colors duration-500 ${textColor}`}>WOW TAPIS</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-12">
                        {['Accueil', 'À Propos', 'Nos Tapis', 'Collections', 'Sur Mesure', 'Journal', 'Contact'].map((item) => {
                            const href = item === 'Accueil' ? '/' :
                                item === 'Nos Tapis' ? '/products' :
                                    item === 'Collections' ? '/collections' :
                                        item === 'Sur Mesure' ? '/products?type=sur_mesure' :
                                            item === 'À Propos' ? '/a-propos' :
                                                item === 'Journal' ? '/blog' : '/contact';
                            return (
                                <Link
                                    key={item}
                                    href={href}
                                    className={`relative text-[11px] uppercase tracking-[0.2em] font-bold transition-all duration-500 group ${navTextColor}`}
                                >
                                    {item}
                                    <span className={`absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-500 group-hover:w-full`} />
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Actions */}
                    <div className={`flex items-center gap-6 transition-colors duration-500 ${textColor}`}>
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="hover:text-primary transition-colors hover:scale-110 duration-300"
                        >
                            <Search size={20} />
                        </button>



                        <Link href="/cart" className={`relative group p-2 rounded-full transition-all duration-500 hover:scale-110 ${isTransparentMode ? 'bg-white/10 hover:bg-white/20' : 'bg-stone-100 hover:bg-stone-900'}`}>
                            <ShoppingCart size={20} className={`transition-colors ${!isTransparentMode ? 'group-hover:text-white' : ''}`} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold animate-in zoom-in duration-300">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden hover:text-primary transition-colors hover:scale-110 duration-300 ml-2"
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Search Overlay */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-[60] bg-stone-900/95 backdrop-blur-xl flex items-center justify-center p-4"
                    >
                        <button
                            onClick={() => setIsSearchOpen(false)}
                            className="absolute top-10 right-10 text-stone-400 hover:text-white transition-colors"
                        >
                            <X size={32} />
                        </button>

                        <div className="w-full max-w-4xl text-center">
                            <h2 className="text-primary uppercase tracking-[0.5em] text-[10px] font-bold mb-12">Quelle pièce cherchez-vous ?</h2>
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    autoFocus
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Rechercher un tapis, un motif, une matière..."
                                    className="w-full bg-transparent border-b-2 border-primary/30 py-8 px-4 text-4xl md:text-6xl font-serif text-white placeholder:text-stone-700 focus:outline-none focus:border-primary transition-colors"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-0 bottom-8 text-primary hover:scale-110 transition-transform"
                                >
                                    <Search size={40} />
                                </button>
                            </form>
                            <div className="mt-12 flex flex-wrap justify-center gap-6">
                                <span className="text-stone-500 text-[10px] uppercase tracking-widest">Suggestions :</span>
                                {['Persan', 'Moderne', 'Laine', 'Berbère'].map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => {
                                            setSearchQuery(tag);
                                            router.push(`/products?search=${tag}`);
                                            setIsSearchOpen(false);
                                        }}
                                        className="text-white text-[10px] uppercase tracking-widest font-bold hover:text-primary transition-colors"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed inset-0 z-[70] bg-stone-900 text-white flex flex-col p-6"
                    >
                        <div className="flex justify-between items-center mb-12">
                            <span className="text-2xl font-serif font-bold tracking-tighter">WOW TAPIS</span>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-stone-400 hover:text-white transition-colors p-2"
                            >
                                <X size={32} />
                            </button>
                        </div>

                        <nav className="flex flex-col gap-8 flex-1 overflow-y-auto mt-8">
                            {['Accueil', 'À Propos', 'Nos Tapis', 'Collections', 'Sur Mesure', 'Journal', 'Contact'].map((item) => {
                                const href = item === 'Accueil' ? '/' :
                                    item === 'Nos Tapis' ? '/products' :
                                        item === 'Collections' ? '/collections' :
                                            item === 'Sur Mesure' ? '/products?type=sur_mesure' :
                                                item === 'À Propos' ? '/a-propos' :
                                                    item === 'Journal' ? '/blog' : '/contact';
                                return (
                                    <Link
                                        key={item}
                                        href={href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-3xl font-serif tracking-widest hover:text-primary transition-colors"
                                    >
                                        {item}
                                    </Link>
                                );
                            })}
                        </nav>
                        
                        <div className="mt-auto pt-8 border-t border-stone-800">
                            <p className="text-stone-500 text-xs uppercase tracking-widest mb-4">Contactez-nous</p>
                            <a href="mailto:contact@waootapis.com" className="block text-white hover:text-primary mb-2 transition-colors">contact@waootapis.com</a>
                            <a href="tel:+212524308038" className="block text-white hover:text-primary transition-colors">+212 5 24 30 80 38</a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
