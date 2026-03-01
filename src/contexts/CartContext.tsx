'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

export interface CartItem {
    slug: string;
    name: string;
    image: string;
    tier: 'single' | 'double' | 'triple';
    tierLabel: string;
    pricePerBox: number;
    boxCount: number;
    quantity: number; // how many "sets" of this tier
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (slug: string, tier: string) => void;
    updateQuantity: (slug: string, tier: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = 'ezyrelife-cart';

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [hydrated, setHydrated] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(CART_KEY);
        if (stored) {
            try { setItems(JSON.parse(stored)); } catch { }
        }
        setHydrated(true);
    }, []);

    // Persist to localStorage
    useEffect(() => {
        if (hydrated) {
            localStorage.setItem(CART_KEY, JSON.stringify(items));
        }
    }, [items, hydrated]);

    const addItem = useCallback((newItem: Omit<CartItem, 'quantity'>) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.slug === newItem.slug && i.tier === newItem.tier);
            if (existing) {
                return prev.map((i) =>
                    i.slug === newItem.slug && i.tier === newItem.tier
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            return [...prev, { ...newItem, quantity: 1 }];
        });
        setIsOpen(true);
    }, []);

    const removeItem = useCallback((slug: string, tier: string) => {
        setItems((prev) => prev.filter((i) => !(i.slug === slug && i.tier === tier)));
    }, []);

    const updateQuantity = useCallback((slug: string, tier: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(slug, tier);
            return;
        }
        setItems((prev) =>
            prev.map((i) =>
                i.slug === slug && i.tier === tier ? { ...i, quantity } : i
            )
        );
    }, [removeItem]);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = items.reduce((sum, i) => sum + i.pricePerBox * i.boxCount * i.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, isOpen, setIsOpen }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
}
