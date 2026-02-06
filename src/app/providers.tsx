"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
import type { Session } from "next-auth";
import type { ReactNode } from "react";

export function Providers({
    children,
    session,
}: {
    children: ReactNode;
    session?: Session | null;
}) {
    return (
        <SessionProvider session={session}>
            <CartProvider>
                {children}
            </CartProvider>
        </SessionProvider>
    );
}
