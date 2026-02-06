"use client";

import { useTransition } from "react";
import { useCart } from "@/context/CartContext";

interface AddToCartButtonProps {
    productId: string;
    returnTo?: string;
    className?: string;
    children?: React.ReactNode;
}

export function AddToCartButton({
    productId,
    returnTo = "/cart",
    className = "",
    children = "Add to Cart"
}: AddToCartButtonProps) {
    const [isPending, startTransition] = useTransition();
    const { refreshCart } = useCart();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            try {
                const res = await fetch("/api/cart/add", {
                    method: "POST",
                    body: formData,
                });

                if (res.ok) {
                    // Dispatch custom event and refresh cart
                    window.dispatchEvent(new CustomEvent("cart-updated"));
                    await refreshCart();
                }
            } catch {
                // Fall back to traditional form submission
                e.currentTarget.submit();
            }
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="hidden" name="productId" value={productId} />
            <input type="hidden" name="quantity" value="1" />
            <input type="hidden" name="returnTo" value={returnTo} />
            <button
                type="submit"
                disabled={isPending}
                className={className || "w-full px-6 py-3.5 bg-[#171717] text-white font-medium rounded-lg hover:bg-[#404040] transition-colors disabled:opacity-50"}
            >
                {isPending ? "Adding..." : children}
            </button>
        </form>
    );
}
