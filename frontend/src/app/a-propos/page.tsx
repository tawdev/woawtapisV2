import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-stone-50">
            <Header />

            {/* Header */}
            <section className="bg-stone-900 py-32 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-accent uppercase tracking-[0.3em] text-sm font-bold mb-6">Notre Histoire</h2>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8">Plus qu&apos;un Tapis, <br /> un Héritage.</h1>
                </div>
            </section>

            <main className="py-24">
                <div className="container mx-auto px-4 max-w-4xl space-y-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-serif font-bold text-stone-800">L&apos;Excellence du Tissage</h2>
                            <p className="text-stone-600 leading-relaxed italic border-l-4 border-primary pl-6">
                                &quot;Chaque nœud raconte une histoire, chaque motif préserve une tradition millénaire.&quot;
                            </p>
                            <p className="text-stone-600 leading-relaxed">
                                Chez waootapis, nous croyons que le tapis est le cœur d&apos;un foyer. Depuis plus de 10 ans, nous parcourons les villages du Moyen Atlas pour dénicher les plus belles pièces et collaborer avec les meilleures tisseuses.
                            </p>
                        </div>
                        <div className="bg-stone-200 aspect-[4/5] rounded shadow-2xl overflow-hidden">
                            <div className="w-full h-full bg-stone-300 flex items-center justify-center text-stone-500 font-serif italic text-xl p-10 text-center">
                                [Image de tissage traditionnel]
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center flex-row-reverse">
                        <div className="bg-stone-200 aspect-[4/5] rounded shadow-2xl overflow-hidden md:order-1">
                            <div className="w-full h-full bg-stone-300 flex items-center justify-center text-stone-500 font-serif italic text-xl p-10 text-center">
                                [Image du Showroom]
                            </div>
                        </div>
                        <div className="space-y-6 md:order-2">
                            <h2 className="text-3xl font-serif font-bold text-stone-800">Engagement & Qualité</h2>
                            <p className="text-stone-600 leading-relaxed">
                                Nous nous engageons pour un commerce équitable et durable. En achetant un tapis waootapis, vous soutenez directement les communautés de tisseuses et contribuez à la pérennité de cet artisanat unique au monde.
                            </p>
                            <p className="text-stone-600 leading-relaxed">
                                Chacun de nos modèles passe par un contrôle de qualité rigoureux : lavage traditionnel, séchage au soleil et brossage méticuleux.
                            </p>
                            <div className="pt-6">
                                <a href="/products" className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-sm font-bold transition-all shadow-lg shadow-primary/20">
                                    Découvrir nos créations
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
