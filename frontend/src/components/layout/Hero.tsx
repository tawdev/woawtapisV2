import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
    return (
        <section className="relative h-screen flex items-center overflow-hidden bg-stone-900">
            {/* Background with advanced overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 via-stone-900/40 to-transparent z-10" />
                <Image
                    src="/images/hero-carpet.jpg"
                    alt="Tapis de luxe"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover scale-105 animate-slow-zoom"
                />
            </div>

            <div className="container mx-auto px-4 relative z-20 text-white">
                <div className="max-w-4xl space-y-12">
                    <div className="space-y-4 overflow-hidden">
                        <p className="text-primary uppercase tracking-[0.5em] text-[10px] md:text-xs font-bold animate-in fade-in slide-in-from-bottom-4 duration-700">
                            Héritage & Artisanat
                        </p>
                        <h1 className="text-6xl md:text-8xl xl:text-9xl font-serif font-bold leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                            L&apos;Or de <br />
                            <span className="text-primary italic font-light italic-reveal">vos Sols</span>
                        </h1>
                    </div>

                    <p className="text-lg md:text-xl text-stone-300 max-w-xl leading-relaxed font-light animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
                        Chaque nœud raconte une histoire. Découvrez nos collections exclusives de tapis berbères et contemporains, façonnés à la main.
                    </p>

                    <div className="flex flex-wrap gap-6 pt-6 animate-in fade-in slide-in-from-top-4 duration-700 delay-1000">
                        <Link
                            href="/products"
                            className="btn-premium"
                        >
                            Découvrir la Collection
                        </Link>
                        <Link
                            href="/products?type=sur_mesure"
                            className="relative px-8 py-4 luxury-glass text-white font-bold tracking-widest uppercase text-[10px] transition-all duration-500 hover:bg-white/20"
                        >
                            Sur Mesure
                        </Link>
                    </div>
                </div>
            </div>

            {/* Decorative Scroll Indicator */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4">
                <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold vertical-text">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
            </div>
        </section>
    );
}
