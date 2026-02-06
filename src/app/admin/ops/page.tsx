import prisma from "@/lib/db";
import { formatCurrency } from "@/lib/pricing";
import { AdminOpsClient } from "./ui/AdminOpsClient";

function startOfDay(date: Date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

function addDays(date: Date, days: number) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

type RevenuePoint = { date: string; revenue: number; orders: number };

export default async function AdminOpsPage() {
    const now = new Date();
    const rangeDays = 14;
    const rangeStart = startOfDay(addDays(now, -rangeDays + 1));

    const [productCount, orderCount, pendingOrders, revenueAgg, recentOrders, recentProducts, ordersInRange] = await Promise.all([
        prisma.product.count(),
        prisma.order.count(),
        prisma.order.count({ where: { status: "PENDING" } }),
        prisma.order.aggregate({ _sum: { total: true } }),
        prisma.order.findMany({
            orderBy: { createdAt: "desc" },
            take: 12,
            select: {
                id: true,
                customerName: true,
                customerEmail: true,
                status: true,
                total: true,
                createdAt: true,
            },
        }),
        prisma.product.findMany({
            orderBy: { createdAt: "desc" },
            take: 12,
            select: {
                id: true,
                slug: true,
                title: true,
                brand: true,
                condition: true,
                status: true,
                priceAmount: true,
                stockRemaining: true,
                createdAt: true,
            },
        }),
        prisma.order.findMany({
            where: { createdAt: { gte: rangeStart } },
            select: { createdAt: true, total: true },
        }),
    ]);

    const revenueByDay = new Map<string, { revenue: number; orders: number }>();
    for (let i = 0; i < rangeDays; i++) {
        const d = startOfDay(addDays(rangeStart, i));
        const key = d.toISOString().slice(0, 10);
        revenueByDay.set(key, { revenue: 0, orders: 0 });
    }

    for (const order of ordersInRange) {
        const key = startOfDay(order.createdAt).toISOString().slice(0, 10);
        const bucket = revenueByDay.get(key) ?? { revenue: 0, orders: 0 };
        bucket.revenue += order.total;
        bucket.orders += 1;
        revenueByDay.set(key, bucket);
    }

    const revenueSeries: RevenuePoint[] = Array.from(revenueByDay.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, v]) => ({ date, revenue: v.revenue, orders: v.orders }));

    return (
        <div className="min-h-screen pt-24 pb-16 px-6 bg-[#FAFAFA]">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-end justify-between gap-4 flex-wrap">
                    <div>
                        <h1 className="text-3xl font-semibold text-[#171717] tracking-tight">Admin ops</h1>
                        <p className="text-sm text-[#525252] mt-1">Hidden dashboard for products, repairs, tickets, and finances.</p>
                    </div>
                    <div className="text-sm text-[#A3A3A3]">Tip: triple-click the Hercles logo to open.</div>
                </div>

                <AdminOpsClient
                    stats={{
                        productCount,
                        orderCount,
                        pendingOrders,
                        revenueTotal: revenueAgg._sum.total ?? 0,
                        revenueTotalFormatted: formatCurrency(revenueAgg._sum.total ?? 0),
                    }}
                    revenueSeries={revenueSeries}
                    recentOrders={recentOrders}
                    recentProducts={recentProducts}
                />
            </div>
        </div>
    );
}
