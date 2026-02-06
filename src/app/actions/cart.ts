"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getEffectivePrice } from "@/lib/pricing";

export type PlaceOrderState = {
    formError?: string;
    fieldErrors?: Record<string, string>;
};

async function requireUser(returnTo?: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        const callback = returnTo ? `?callbackUrl=${encodeURIComponent(returnTo)}` : "";
        redirect(`/login${callback}`);
    }
    return session.user;
}

async function getOrCreateCart(userId: string) {
    return prisma.cart.upsert({
        where: { userId },
        update: {},
        create: { userId },
        include: { items: true },
    });
}

export async function addToCart(formData: FormData) {
    const productId = String(formData.get("productId") ?? "");
    const rawQuantity = Number(formData.get("quantity") ?? 1);
    const quantity = Number.isFinite(rawQuantity) && rawQuantity > 0 ? rawQuantity : 1;
    const returnTo = String(formData.get("returnTo") ?? "/cart");

    if (!productId) return;

    const user = await requireUser(returnTo);
    const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { stockRemaining: true },
    });

    if (!product || product.stockRemaining <= 0) {
        redirect(`${returnTo}?error=outofstock`);
    }

    const cart = await getOrCreateCart(user.id);

    const existing = await prisma.cartItem.findUnique({
        where: { cartId_productId: { cartId: cart.id, productId } },
    });

    const desiredQuantity = (existing?.quantity ?? 0) + quantity;
    if (desiredQuantity > product.stockRemaining) {
        redirect(`${returnTo}?error=stock`);
    }

    await prisma.cartItem.upsert({
        where: { cartId_productId: { cartId: cart.id, productId } },
        update: { quantity: { increment: quantity } },
        create: { cartId: cart.id, productId, quantity },
    });

    revalidatePath("/cart");
    revalidatePath("/shop");
}

export async function updateCartItem(formData: FormData) {
    const itemId = String(formData.get("itemId") ?? "");
    const quantity = Number(formData.get("quantity") ?? 1);

    if (!itemId) return;
    if (!Number.isFinite(quantity)) return;

    await requireUser();

    if (quantity <= 0) {
        await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
        await prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity },
        });
    }

    revalidatePath("/cart");
}

export async function removeCartItem(formData: FormData) {
    const itemId = String(formData.get("itemId") ?? "");
    if (!itemId) return;

    await requireUser();
    await prisma.cartItem.delete({ where: { id: itemId } });
    revalidatePath("/cart");
}

export async function placeOrder(prevState: PlaceOrderState | void, formData: FormData): Promise<PlaceOrderState | void> {
    const user = await requireUser("/checkout");

    const safePrevState: PlaceOrderState = prevState ?? {};

    const fullName = String(formData.get("fullName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const address1 = String(formData.get("address1") ?? "").trim();
    const address2 = String(formData.get("address2") ?? "").trim();
    const city = String(formData.get("city") ?? "").trim();
    const state = String(formData.get("state") ?? "").trim();
    const country = String(formData.get("country") ?? "").trim();
    const postalCode = String(formData.get("postalCode") ?? "").trim();

    const fieldErrors: Record<string, string> = {};
    if (!fullName) fieldErrors.fullName = "Required";
    if (!email) fieldErrors.email = "Required";
    if (!phone) fieldErrors.phone = "Required";
    if (!address1) fieldErrors.address1 = "Required";
    if (!city) fieldErrors.city = "Required";
    if (!country) fieldErrors.country = "Required";

    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
        fieldErrors.email = "Enter a valid email";
    }

    if (Object.keys(fieldErrors).length) {
        return {
            ...safePrevState,
            formError: "Please fix the highlighted fields.",
            fieldErrors,
        };
    }

    const shippingMethodRaw = String(formData.get("shippingMethod") ?? "standard");
    const shippingMethod = shippingMethodRaw === "express" ? "express" : "standard";

    const cart = await prisma.cart.findUnique({
        where: { userId: user.id },
        include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
        redirect("/cart");
    }

    for (const item of cart.items) {
        if (item.quantity > item.product.stockRemaining) {
            redirect("/cart?error=stock");
        }
    }

    const subtotal = cart.items.reduce((sum, item) => {
        const price = getEffectivePrice(item.product);
        return sum + price * item.quantity;
    }, 0);

    const freeShippingThreshold = 300000;
    const standardShippingFee = 2500;
    const expressShippingFee = 8000;

    const shipping =
        shippingMethod === "express"
            ? expressShippingFee
            : subtotal >= freeShippingThreshold
                ? 0
                : standardShippingFee;
    const total = subtotal + shipping;

    const addressJson = {
        address1,
        address2,
        city,
        state,
        country,
        postalCode,
    };

    await prisma.$transaction(async (tx) => {
        await tx.order.create({
            data: {
                userId: user.id,
                customerEmail: email,
                customerName: fullName,
                phone,
                addressJson,
                subtotal,
                shipping,
                total,
                currency: "KES",
                status: "PENDING",
                paymentStatus: "PENDING",
                internalNotes: `Shipping: ${shippingMethod}`,
                items: {
                    create: cart.items.map((item) => ({
                        productId: item.productId,
                        titleSnapshot: item.product.title,
                        priceSnapshot: getEffectivePrice(item.product),
                        quantity: item.quantity,
                    })),
                },
            },
        });

        for (const item of cart.items) {
            await tx.product.update({
                where: { id: item.productId },
                data: {
                    stockRemaining: { decrement: item.quantity },
                    soldCount: { increment: item.quantity },
                },
            });
        }

        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    });

    revalidatePath("/orders");
    revalidatePath("/cart");
    redirect("/orders?success=1");
}
