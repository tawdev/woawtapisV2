import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "waootapis | Tapis de Luxe Authentiques",
  description: "Découvrez notre collection de tapis de luxe orientaux, modernes et sur mesure.",
};

import { CartProvider } from "@/context/CartContext";
import WhatsappContact from "@/components/layout/WhatsappContact";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased bg-stone-50 text-stone-900 font-sans">
        <CartProvider>
          {children}
          <WhatsappContact />
        </CartProvider>
      </body>
    </html>
  );
}
