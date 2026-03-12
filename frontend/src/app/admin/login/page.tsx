'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminService } from '@/services/admin';
import { Lock, Mail, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await adminService.login({ email, password });
            const { token } = response.data;

            localStorage.setItem('admin_token', token);
            router.push('/admin');
        } catch (err: any) {
            console.error('Login error details:', err.response?.data);
            const message = err.response?.data?.message || err.response?.data?.email?.[0] || 'Identifiants incorrects ou erreur serveur.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
            {/* Artistic Background */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center scale-105"
                style={{
                    backgroundImage: 'url("/images/admin-login-bg.png")',
                    filter: 'brightness(0.7) blur(2px)'
                }}
            />
            <div className="absolute inset-0 z-10 bg-gradient-to-br from-stone-900/40 via-transparent to-stone-900/60" />

            <div className="relative z-20 max-w-md w-full animate-in fade-in zoom-in-95 duration-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-playfair font-bold text-white tracking-tight mb-3 drop-shadow-lg">
                        TAPIS<span className="text-stone-300/80 font-light">ADMIN</span>
                    </h1>
                    <p className="text-stone-200/90 font-medium drop-shadow">Espace de gestion artisanale</p>
                </div>

                {/* Glassmorphism Card */}
                <div className="backdrop-blur-xl bg-white/10 rounded-[2.5rem] shadow-2xl border border-white/20 p-10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-stone-400/50 to-transparent" />

                    <form onSubmit={handleLogin} className="space-y-7">
                        {error && (
                            <div className="bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-100 px-5 py-3.5 rounded-2xl flex items-center gap-3 text-sm animate-in shake duration-500">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-stone-300 uppercase tracking-widest ml-1">
                                Adresse email
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-white transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-5 py-4 bg-stone-900/20 border border-white/10 rounded-2xl text-white placeholder-stone-400/60 focus:ring-2 focus:ring-white/30 focus:border-white/20 transition-all outline-none backdrop-blur-sm"
                                    placeholder="admin@tapis.ma"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-stone-300 uppercase tracking-widest ml-1">
                                Mot de passe
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-white transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-5 py-4 bg-stone-900/20 border border-white/10 rounded-2xl text-white placeholder-stone-400/60 focus:ring-2 focus:ring-white/30 focus:border-white/20 transition-all outline-none backdrop-blur-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white text-stone-900 py-4 rounded-2xl font-bold hover:bg-stone-100 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50 group"
                        >
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    Se connecter
                                    <div className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                        <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                                    </div>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="text-center mt-10 space-y-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Retour à la boutique
                    </Link>
                    <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-medium">
                        &copy; {new Date().getFullYear()} Tapis Artisanat • Système d'Excellence
                    </p>
                </div>
            </div>
        </div>
    );
}
