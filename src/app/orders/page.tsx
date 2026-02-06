import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { GlassContainer } from "@/ui/glass";
import { formatCurrency } from "@/lib/pricing";

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function OrdersPage({ searchParams }: { searchParams?: Promise<SearchParams> }) {
    const resolvedSearchParams = (await searchParams) ?? {};
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/login?callbackUrl=/orders");
    }

    const orders = await prisma.order.findMany({
        where: { userId: session.user.id },
        select: {
            id: true,
            status: true,
            total: true,
            createdAt: true,
            items: {
                select: {
                    id: true,
                    titleSnapshot: true,
                    priceSnapshot: true,
                    quantity: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="min-h-screen pt-24 pb-16 px-6">
            <div className="max-w-5xl mx-auto space-y-6">
                <h1 className="text-3xl font-semibold">Your Orders</h1>
                {resolvedSearchParams.success === "1" ? (
                    <GlassContainer intensity="low" className="p-4 text-sm text-emerald-200/80">
                        Order placed successfully. A Hercles specialist will reach out shortly.
                    </GlassContainer>
                ) : null}

                {orders.length === 0 ? (
                    <GlassContainer intensity="low" className="p-8 text-center text-slate-200/70">
                        No orders yet. Your next system is waiting.
                    </GlassContainer>
                ) : (
                    orders.map((order) => (
                        <GlassContainer key={order.id} intensity="low" className="p-6 space-y-3">
                            <div className="flex flex-wrap justify-between gap-4">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-200/60">Order</p>
                                    <p className="text-lg font-semibold">{order.id.slice(0, 8).toUpperCase()}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-200/60">Status</p>
                                    <p className="text-sm font-semibold">{order.status}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-200/60">Total</p>
                                    <p className="text-sm font-semibold">{formatCurrency(order.total)}</p>
                                </div>
                            </div>
                            <div className="text-sm text-slate-200/70">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex justify-between">
                                        <span>
                                            {item.titleSnapshot} × {item.quantity}
                                        </span>
                                        <span>{formatCurrency(item.priceSnapshot * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                        </GlassContainer>
                    ))
                )}
            </div>
        </div>
    );
}
