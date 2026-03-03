'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

export interface CartItem {
    slug: string;
    name: string;
    image: string;
    flavor: string;
    boxCount: number; // Total number of physical boxes for this flavor
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: { slug: string; name: string; image: string; flavor: string; boxCount: number }) => void;
    removeItem: (slug: string, flavor: string) => void;
    updateQuantity: (slug: string, flavor: string, boxCount: number) => void;
    clearCart: () => void;
    totalItems: number; // Sum of line item quantities (now just 1 per flavor usually)
    totalPrice: number;
    totalBoxes: number;
    pricePerBox: number;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = 'ezyrelife-cart';

// Dynamic Pricing Tiers
const getPricePerBox = (totalBoxes: number) => {
    if (totalBoxes >= 3) return 121.00;
    if (totalBoxes === 2) return 130.50;
    return 145.00;
};

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

    const addItem = useCallback((newItem: CartItem) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.slug === newItem.slug && i.flavor === newItem.flavor);
            if (existing) {
                return prev.map((i) =>
                    i.slug === newItem.slug && i.flavor === newItem.flavor
                        ? { ...i, boxCount: i.boxCount + newItem.boxCount }
                        : i
                );
            }
            return [...prev, { ...newItem }];
        });
        setIsOpen(true);
    }, []);

    const removeItem = useCallback((slug: string, flavor: string) => {
        setItems((prev) => prev.filter((i) => !(i.slug === slug && i.flavor === flavor)));
    }, []);

    const updateQuantity = useCallback((slug: string, flavor: string, boxCount: number) => {
        if (boxCount <= 0) {
            removeItem(slug, flavor);
            return;
        }
        setItems((prev) =>
            prev.map((i) =>
                i.slug === slug && i.flavor === flavor ? { ...i, boxCount } : i
            )
        );
    }, [removeItem]);

    const clearCart = useCallback(() => {
        setItems([]);
        localStorage.removeItem(CART_KEY);
    }, []);

    const totalBoxes = items.reduce((sum, i) => sum + i.boxCount, 0);
    const pricePerBox = getPricePerBox(totalBoxes);
    const totalPrice = totalBoxes * pricePerBox;
    const totalItems = items.length; // Number of flavor entries

    return (
        <CartContext.Provider value={{
            items, addItem, removeItem, updateQuantity, clearCart,
            totalItems, totalPrice, totalBoxes, pricePerBox,
            isOpen, setIsOpen
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
}
