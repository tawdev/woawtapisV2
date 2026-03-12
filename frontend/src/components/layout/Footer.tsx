export default function Footer() {
    return (
        <footer className="bg-stone-900 text-white pt-24 pb-12 border-t border-white/5">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20 text-center md:text-left">
                    {/* Brand Column */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-center md:justify-start gap-2">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-stone-900 font-serif font-bold text-xl">W</div>
                            <span className="text-2xl font-serif font-bold tracking-tighter">WOW TAPIS</span>
                        </div>
                        <p className="text-stone-300 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
                            Maison d&apos;artisanat d&apos;exception. Nous préservons le savoir-faire ancestral du tissage berbère pour sublimer vos intérieurs contemporains.
                        </p>
                        <div className="flex justify-center md:justify-start gap-6">
                            {['Instagram', 'Pinterest', 'Facebook'].map(social => (
                                <a key={social} href="#" className="text-stone-500 hover:text-primary transition-colors text-xs uppercase tracking-widest font-bold min-h-[44px] flex items-center p-2" aria-label={`Visitez notre page ${social}`}>{social}</a>
                            ))}
                        </div>
                    </div>

                    {/* Nav Columns */}
                    <div>
                        <h4 className="text-xs uppercase tracking-[0.3em] font-black text-primary mb-8">Navigation</h4>
                        <ul className="space-y-4 text-stone-300 text-sm">
                            {['Nos Tapis', 'Sur Mesure', 'Collections', 'À Propos', 'Journal'].map(link => (
                                <li key={link}><a href={link === 'Journal' ? '/blog' : '#'} className="hover:text-white transition-colors py-2 block">{link}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs uppercase tracking-[0.3em] font-black text-primary mb-8">Aide</h4>
                        <ul className="space-y-4 text-stone-300 text-sm">
                            {['Livraison', 'Retours', 'Guide des tailles', 'Contact'].map(link => (
                                <li key={link}><a href="#" className="hover:text-white transition-colors py-2 block">{link}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-8">
                        <h4 className="text-xs uppercase tracking-[0.3em] font-black text-primary mb-8">Newsletter</h4>
                        <p className="text-stone-300 text-sm">Inscrivez-vous pour recevoir nos sélections privées.</p>
                        <form className="relative">
                            <input
                                type="email"
                                placeholder="votre@email.com"
                                className="w-full bg-white/5 border-b border-white/20 py-4 outline-none focus:border-primary transition-colors text-sm font-light text-stone-200"
                                aria-label="Votre adresse e-mail"
                            />
                            <button className="absolute right-0 top-1/2 -translate-y-1/2 text-primary font-bold uppercase text-[10px] tracking-widest hover:text-white transition-colors p-4" aria-label="S'inscrire à la newsletter">OK</button>
                        </form>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400">
                    <p>© 2026 <a href="https://cdigital.ma" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-white transition-colors">cdigital.ma</a>. Tous droits réservés.</p>
                    <div className="flex gap-12">
                        <a href="#" className="hover:text-white transition-colors p-2">Mentions Légales</a>
                        <a href="#" className="hover:text-white transition-colors p-2">Politique de Confidentialité</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
