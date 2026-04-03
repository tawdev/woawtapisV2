'use client';

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FaWhatsapp, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function WhatsappContact() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleChat = () => setIsOpen(!isOpen);

    // TAW 10 Brand Colors
    const primaryColor = "#1C1917"; // Adjusted to project stone-900
    const secondaryColor = "#d4af37"; // Secondary Gold

    const t = {
        title: "Support Tapis Marocain",
        status: "En ligne",
        description: "Bonjour ! Nos experts en artisanat sont à votre disposition. Comment pouvons-nous vous accompagner aujourd'hui ?",
        role: "Service Client Premium",
        tooltip_title: "Besoin d'aide ?",
        tooltip_sub: "Discutez avec un expert sur WhatsApp"
    };

    if (!mounted || pathname?.startsWith('/admin')) return null;

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[100]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleChat}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed bottom-24 md:bottom-28 right-4 md:right-8 z-[101] w-80 rounded-sm overflow-hidden shadow-2xl border border-stone-100 bg-white font-sans"
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                    >
                        <div className="p-7 text-white" style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, #292524 100%)` }}>
                            <div className="flex items-center gap-4">
                                <div className="bg-white/10 p-3 rounded-sm backdrop-blur-md">
                                    <FaWhatsapp size={24} style={{ color: secondaryColor }} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-serif font-bold tracking-tight italic">{t.title}</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                        <span className="text-[10px] text-white/60 uppercase tracking-widest font-black">{t.status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-7 space-y-5">
                            <p className="text-stone-500 text-sm leading-relaxed font-light">{t.description}</p>
                            <a
                                href="https://wa.me/+212607790956"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between bg-stone-50 hover:bg-white p-5 rounded-sm border border-stone-100 transition-all duration-500 group shadow-sm hover:shadow-md"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-sm flex items-center justify-center text-white font-black text-lg shadow-lg" style={{ backgroundColor: secondaryColor }}>
                                        T10
                                    </div>
                                    <div>
                                        <span className="block font-serif font-bold text-stone-900 italic">TAW 10</span>
                                        <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">{t.role}</span>
                                    </div>
                                </div>
                                <FaWhatsapp size={24} style={{ color: secondaryColor }} className="group-hover:scale-110 transition-transform duration-500" />
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="fixed bottom-8 right-8 z-[101]">
                <motion.button
                    onClick={toggleChat}
                    className="relative w-16 h-16 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex items-center justify-center text-white overflow-hidden cursor-pointer active:scale-90 transition-transform"
                    style={{ background: isOpen ? '#A82D2D' : `linear-gradient(135deg, ${primaryColor} 0%, #292524 100%)` }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{ rotate: isOpen ? 0 : [0, -5, 5, -5, 0] }}
                    transition={{ rotate: { duration: 2, repeat: isOpen ? 0 : Infinity, repeatDelay: 3 } }}
                >
                    {isOpen ? <FaTimes size={28} /> : <FaWhatsapp size={32} style={{ color: secondaryColor }} />}
                </motion.button>
            </div>

            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        className="fixed bottom-11 right-28 z-[100] bg-white/95 backdrop-blur-xl py-3 px-6 rounded-sm shadow-2xl border border-stone-100 hidden lg:block font-sans"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        <div className="text-stone-900 font-serif font-bold text-sm italic">{t.tooltip_title}</div>
                        <div className="text-stone-400 text-[10px] uppercase tracking-wider font-bold opacity-60">{t.tooltip_sub}</div>
                        {/* Triangle decorator */}
                        <div className="absolute top-1/2 right-[-6px] -translate-y-1/2 w-3 h-3 bg-white border-r border-t border-stone-100 rotate-45" />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
