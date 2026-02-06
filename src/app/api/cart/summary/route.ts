import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ count: 0 });
    }

    const result = await prisma.cartItem.aggregate({
        where: { cart: { is: { userId: session.user.id } } },
        _sum: { quantity: true },
    });

    const count = result._sum.quantity ?? 0;
    return NextResponse.json({ count });
}
