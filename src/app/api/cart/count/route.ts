import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ count: 0 });
        }

        const cart = await prisma.cart.findUnique({
            where: { userId: session.user.id },
            select: {
                items: {
                    select: { quantity: true },
                },
            },
        });

        const count = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

        return NextResponse.json({ count });
    } catch (error) {
        console.error("Failed to fetch cart count:", error);
        return NextResponse.json({ count: 0 });
    }
}
