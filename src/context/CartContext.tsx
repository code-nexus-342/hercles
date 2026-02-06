"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";

interface CartContextType {
    count: number;
    refreshCart: () => Promise<void>;
    incrementCount: (amount?: number) => void;
    decrementCount: (amount?: number) => void;
}

const CartContext = createContext<CartContextType>({
    count: 0,
    refreshCart: async () => { },
    incrementCount: () => { },
    decrementCount: () => { },
});

export function useCart() {
    return useContext(CartContext);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const [count, setCount] = useState(0);

    const refreshCart = useCallback(async () => {
        if (!session?.user) {
            setCount(0);
            return;
        }

        try {
            const res = await fetch("/api/cart/count");
            if (res.ok) {
                const data = await res.json();
                setCount(data.count ?? 0);
            }
        } catch {
            // Silently fail
        }
    }, [session?.user]);

    const incrementCount = useCallback((amount = 1) => {
        setCount((prev) => prev + amount);
    }, []);

    const decrementCount = useCallback((amount = 1) => {
        setCount((prev) => Math.max(0, prev - amount));
    }, []);

    // Fetch cart count on mount and when session changes
    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    // Listen for custom cart update events
    useEffect(() => {
        const handleCartUpdate = () => {
            refreshCart();
        };

        window.addEventListener("cart-updated", handleCartUpdate);
        return () => window.removeEventListener("cart-updated", handleCartUpdate);
    }, [refreshCart]);

    return (
        <CartContext.Provider value={{ count, refreshCart, incrementCount, decrementCount }}>
            {children}
        </CartContext.Provider>
    );
}
