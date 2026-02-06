import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { getEffectivePrice } from "@/lib/pricing";
import { placeOrder } from "@/app/actions/cart";
import { CheckoutClient } from "./CheckoutClient";

export default async function CheckoutPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/login?callbackUrl=/checkout");
    }

    const cart = await prisma.cart.findUnique({
        where: { userId: session.user.id },
        select: {
            items: {
                select: {
                    id: true,
                    quantity: true,
                    product: {
                        select: {
                            slug: true,
                            title: true,
                            priceAmount: true,
                            salePriceAmount: true,
                            saleStart: true,
                            saleEnd: true,
                        },
                    },
                },
            },
        },
    });

    const items = cart?.items ?? [];
    if (items.length === 0) {
        redirect("/cart");
    }

    const subtotal = items.reduce((sum, item) => sum + getEffectivePrice(item.product) * item.quantity, 0);

    return (
        <CheckoutClient
            action={placeOrder}
            items={items.map((item) => ({
                id: item.id,
                slug: item.product.slug,
                title: item.product.title,
                quantity: item.quantity,
                unitPrice: getEffectivePrice(item.product),
            }))}
            subtotal={subtotal}
            defaultEmail={session.user.email ?? ""}
            freeShippingThreshold={300000}
            standardShippingFee={2500}
            expressShippingFee={8000}
        />
    );
}
