import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const productId = String(formData.get("productId") ?? "");
        const rawQuantity = Number(formData.get("quantity") ?? 1);
        const quantity = Number.isFinite(rawQuantity) && rawQuantity > 0 ? rawQuantity : 1;

        if (!productId) {
            return NextResponse.json({ error: "Missing productId" }, { status: 400 });
        }

        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { stockRemaining: true },
        });

        if (!product || product.stockRemaining <= 0) {
            return NextResponse.json({ error: "Out of stock" }, { status: 400 });
        }

        // Get or create cart
        const cart = await prisma.cart.upsert({
            where: { userId: session.user.id },
            update: {},
            create: { userId: session.user.id },
            include: { items: true },
        });

        const existing = await prisma.cartItem.findUnique({
            where: { cartId_productId: { cartId: cart.id, productId } },
        });

        const desiredQuantity = (existing?.quantity ?? 0) + quantity;
        if (desiredQuantity > product.stockRemaining) {
            return NextResponse.json({ error: "Exceeds available stock" }, { status: 400 });
        }

        await prisma.cartItem.upsert({
            where: { cartId_productId: { cartId: cart.id, productId } },
            update: { quantity: { increment: quantity } },
            create: { cartId: cart.id, productId, quantity },
        });

        // Get updated cart count
        const updatedCart = await prisma.cart.findUnique({
            where: { userId: session.user.id },
            select: {
                items: {
                    select: { quantity: true },
                },
            },
        });

        const count = updatedCart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

        return NextResponse.json({ success: true, count });
    } catch (error) {
        console.error("Failed to add to cart:", error);
        return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
    }
}
