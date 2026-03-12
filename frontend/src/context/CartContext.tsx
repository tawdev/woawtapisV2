'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
    id: number;
    product_id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
    slug: string;
    custom_dimensions?: {
        longueur: number;
        largeur: number;
    };
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: any, quantity?: number, customDimensions?: { longueur: number, largeur: number }) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    cartCount: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('waootapis_cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart from localStorage", e);
            }
        }
    }, []);

    // Save cart to localStorage on change
    useEffect(() => {
        localStorage.setItem('waootapis_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: any, quantity: number = 1, customDimensions?: { longueur: number, largeur: number }) => {
        setCart((prevCart) => {
            // Unique key for cart items could involve dimensions for sur_mesure
            const existingItem = prevCart.find((item) => 
                item.product_id === product.id && 
                JSON.stringify(item.custom_dimensions) === JSON.stringify(customDimensions)
            );

            if (existingItem) {
                return prevCart.map((item) =>
                    (item.product_id === product.id && JSON.stringify(item.custom_dimensions) === JSON.stringify(customDimensions))
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            let finalPrice = parseFloat(product.sale_price || product.price);
            
            // If sur_mesure, calculate price based on Area
            if (customDimensions) {
                const areaM2 = (customDimensions.longueur * customDimensions.largeur) / 10000;
                finalPrice = finalPrice * areaM2;
            }

            return [
                ...prevCart,
                {
                    id: Date.now(),
                    product_id: product.id,
                    name: product.name,
                    price: finalPrice,
                    image: product.images?.[0]?.image_path || '/images/placeholder.jpg',
                    slug: product.slug,
                    quantity: quantity,
                    custom_dimensions: customDimensions
                },
            ];
        });
    };

    const removeFromCart = (id: number) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };

    const updateQuantity = (id: number, quantity: number) => {
        if (quantity < 1) return;
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                cartCount: totalItems,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
