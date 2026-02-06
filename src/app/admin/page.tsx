import prisma from "@/lib/db";
import { GlassContainer } from "@/ui/glass";
import { formatCurrency } from "@/lib/pricing";

export default async function AdminPage() {
    const [productCount, orderCount, pendingOrders, revenue] = await Promise.all([
        prisma.product.count(),
        prisma.order.count(),
        prisma.order.count({ where: { status: "PENDING" } }),
        prisma.order.aggregate({ _sum: { total: true } }),
    ]);

    const recentOrders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
    });

    return (
        <div className="min-h-screen pt-24 pb-16 px-6">
            <div className="max-w-6xl mx-auto space-y-6">
                <h1 className="text-3xl font-semibold">Admin dashboard</h1>

                <div className="grid md:grid-cols-4 gap-4">
                    <GlassContainer intensity="low" className="p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-200/60">Products</p>
                        <p className="text-2xl font-semibold">{productCount}</p>
                    </GlassContainer>
                    <GlassContainer intensity="low" className="p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-200/60">Orders</p>
                        <p className="text-2xl font-semibold">{orderCount}</p>
                    </GlassContainer>
                    <GlassContainer intensity="low" className="p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-200/60">Pending</p>
                        <p className="text-2xl font-semibold">{pendingOrders}</p>
                    </GlassContainer>
                    <GlassContainer intensity="low" className="p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-200/60">Revenue</p>
                        <p className="text-2xl font-semibold">{formatCurrency(revenue._sum.total ?? 0)}</p>
                    </GlassContainer>
                </div>

                <GlassContainer intensity="low" className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Recent orders</h2>
                    <div className="space-y-3 text-sm text-slate-200/70">
                        {recentOrders.length === 0 ? (
                            <p>No orders yet.</p>
                        ) : (
                            recentOrders.map((order) => (
                                <div key={order.id} className="flex justify-between border-b border-white/10 pb-2">
                                    <span>{order.customerName}</span>
                                    <span>{order.status}</span>
                                    <span>{formatCurrency(order.total)}</span>
                                </div>
                            ))
                        )}
                    </div>
                </GlassContainer>
            </div>
        </div>
    );
}
