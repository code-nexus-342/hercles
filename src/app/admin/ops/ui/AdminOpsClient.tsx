"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { Card, Divider } from "@/ui/glass";
import { createProductAction, type AdminActionState } from "../actions";

type RevenuePoint = { date: string; revenue: number; orders: number };

type Props = {
    stats: {
        productCount: number;
        orderCount: number;
        pendingOrders: number;
        revenueTotal: number;
        revenueTotalFormatted: string;
    };
    revenueSeries: RevenuePoint[];
    recentOrders: Array<{
        id: string;
        customerName: string;
        customerEmail: string;
        status: string;
        total: number;
        createdAt: Date;
    }>;
    recentProducts: Array<{
        id: string;
        slug: string;
        title: string;
        brand: string;
        condition: string;
        status: string;
        priceAmount: number;
        stockRemaining: number;
        createdAt: Date;
    }>;
};

const initialState: AdminActionState = { ok: true, message: "" };

type TabKey = "overview" | "products" | "devices" | "repairs" | "tickets" | "finances";

export function AdminOpsClient({ stats, revenueSeries, recentOrders, recentProducts }: Props) {
    const [tab, setTab] = useState<TabKey>("overview");
    const [state, formAction, isPending] = useActionState(createProductAction, initialState);

    const maxRevenue = useMemo(() => {
        return revenueSeries.reduce((max, p) => Math.max(max, p.revenue), 0) || 1;
    }, [revenueSeries]);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
                <TabButton tab={tab} setTab={setTab} value="overview" label="Overview" />
                <TabButton tab={tab} setTab={setTab} value="products" label="Products" />
                <TabButton tab={tab} setTab={setTab} value="devices" label="Devices" />
                <TabButton tab={tab} setTab={setTab} value="repairs" label="Repairs" />
                <TabButton tab={tab} setTab={setTab} value="tickets" label="Tickets" />
                <TabButton tab={tab} setTab={setTab} value="finances" label="Finances" />
            </div>

            {tab === "overview" ? (
                <div className="grid lg:grid-cols-3 gap-4">
                    <Card className="p-5">
                        <p className="text-xs uppercase tracking-[0.2em] text-[#A3A3A3]">Revenue</p>
                        <p className="text-2xl font-semibold text-[#171717] mt-2">{stats.revenueTotalFormatted}</p>
                        <p className="text-sm text-[#525252] mt-1">All-time order revenue</p>
                    </Card>
                    <Card className="p-5">
                        <p className="text-xs uppercase tracking-[0.2em] text-[#A3A3A3]">Orders</p>
                        <p className="text-2xl font-semibold text-[#171717] mt-2">{stats.orderCount}</p>
                        <p className="text-sm text-[#525252] mt-1">Pending: {stats.pendingOrders}</p>
                    </Card>
                    <Card className="p-5">
                        <p className="text-xs uppercase tracking-[0.2em] text-[#A3A3A3]">Products</p>
                        <p className="text-2xl font-semibold text-[#171717] mt-2">{stats.productCount}</p>
                        <p className="text-sm text-[#525252] mt-1">Active + draft inventory</p>
                    </Card>

                    <Card className="p-5 lg:col-span-2">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-semibold text-[#171717]">Revenue (last 14 days)</h2>
                            <Link href="/admin" className="text-sm text-[#2563EB] hover:underline">Legacy admin →</Link>
                        </div>
                        <div className="mt-4 flex items-end gap-1 h-24">
                            {revenueSeries.map((p) => {
                                const h = Math.max(2, Math.round((p.revenue / maxRevenue) * 96));
                                return (
                                    <div key={p.date} className="flex-1">
                                        <div
                                            className="w-full rounded-md bg-[#171717]"
                                            style={{ height: `${h}%`, opacity: p.revenue ? 1 : 0.12 }}
                                            title={`${p.date}: ${p.revenue} (${p.orders} orders)`}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        <p className="text-xs text-[#A3A3A3] mt-3">Hover bars for daily totals.</p>
                    </Card>

                    <Card className="p-5">
                        <h2 className="text-base font-semibold text-[#171717]">Quick links</h2>
                        <div className="mt-3 space-y-2 text-sm">
                            <Link className="block text-[#2563EB] hover:underline" href="/shop">View shop</Link>
                            <Link className="block text-[#2563EB] hover:underline" href="/orders">Customer orders page</Link>
                            <Link className="block text-[#2563EB] hover:underline" href="/admin/ops">Refresh dashboard</Link>
                        </div>
                    </Card>
                </div>
            ) : null}

            {tab === "products" ? (
                <div className="grid lg:grid-cols-5 gap-4">
                    <Card className="p-5 lg:col-span-2">
                        <h2 className="text-lg font-semibold text-[#171717]">Create product</h2>
                        <p className="text-sm text-[#525252] mt-1">
                            Creates a new catalog item (slug must be unique). Categories are comma-separated slugs.
                        </p>

                        <Divider className="my-4" />

                        <form action={formAction} className="space-y-3">
                            <Field label="Slug" name="slug" placeholder="asus-zenbook-17-fold-oled" required />
                            <Field label="Title" name="title" placeholder="ASUS Zenbook 17 Fold OLED" required />
                            <div className="grid grid-cols-2 gap-3">
                                <Field label="Brand" name="brand" placeholder="ASUS" required />
                                <Field label="Model" name="model" placeholder="UX9702" required />
                            </div>
                            <Field label="Description" name="description" placeholder="Short description..." required textarea />

                            <div className="grid grid-cols-2 gap-3">
                                <Select label="Condition" name="condition" options={["NEW", "REFURBISHED"]} />
                                <Select label="Status" name="status" options={["DRAFT", "ACTIVE", "ARCHIVED"]} />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Field label="Price (amount)" name="priceAmount" type="number" placeholder="450000" required />
                                <Field label="Sale price (optional)" name="salePriceAmount" type="number" placeholder="" />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <Field label="Stock" name="stockRemaining" type="number" placeholder="3" />
                                <Field label="Warranty (months)" name="warrantyMonths" type="number" placeholder="24" />
                                <Field label="Return days" name="returnPolicyDays" type="number" placeholder="14" />
                            </div>

                            <Field label="Categories (slugs)" name="categories" placeholder="gaming,deals" />

                            <Field
                                label="Specs JSON"
                                name="specsJson"
                                placeholder='{"cpu":"Intel Core i7","ram":"16GB","storage":"1TB"}'
                                textarea
                            />

                            <Field label="Highlights (one per line)" name="highlights" placeholder="Foldable OLED\n2-year warranty" textarea />

                            <Divider className="my-4" />

                            <Field label="Image URL (optional)" name="imageUrl" placeholder="https://images.unsplash.com/..." />
                            <Field label="Image alt (optional)" name="imageAlt" placeholder="Laptop photo" />

                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full mt-2 px-4 py-2.5 text-sm font-medium bg-[#171717] text-white rounded-lg hover:bg-[#404040] transition-colors disabled:opacity-60"
                            >
                                {isPending ? "Creating..." : "Create product"}
                            </button>

                            {state.message ? (
                                <p className={`text-sm ${state.ok ? "text-green-700" : "text-red-700"}`}>{state.message}</p>
                            ) : null}
                        </form>
                    </Card>

                    <Card className="p-5 lg:col-span-3">
                        <h2 className="text-lg font-semibold text-[#171717]">Recent products</h2>
                        <p className="text-sm text-[#525252] mt-1">Latest 12 catalog entries.</p>
                        <Divider className="my-4" />

                        <div className="overflow-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-[#A3A3A3]">
                                        <th className="py-2 pr-3">Title</th>
                                        <th className="py-2 pr-3">Status</th>
                                        <th className="py-2 pr-3">Stock</th>
                                        <th className="py-2 pr-3">Slug</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentProducts.map((p) => (
                                        <tr key={p.id} className="border-t border-[#E5E5E5]">
                                            <td className="py-2 pr-3 text-[#171717] font-medium">{p.title}</td>
                                            <td className="py-2 pr-3 text-[#525252]">{p.status}</td>
                                            <td className="py-2 pr-3 text-[#525252]">{p.stockRemaining}</td>
                                            <td className="py-2 pr-3">
                                                <Link className="text-[#2563EB] hover:underline" href={`/p/${p.slug}`}>{p.slug}</Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            ) : null}

            {tab === "finances" ? (
                <div className="grid lg:grid-cols-5 gap-4">
                    <Card className="p-5 lg:col-span-2">
                        <h2 className="text-lg font-semibold text-[#171717]">Finance snapshot</h2>
                        <p className="text-sm text-[#525252] mt-1">Currently derived from order totals.</p>
                        <Divider className="my-4" />
                        <div className="space-y-3 text-sm">
                            <Row label="All-time revenue" value={stats.revenueTotalFormatted} />
                            <Row label="Orders" value={String(stats.orderCount)} />
                            <Row label="Pending orders" value={String(stats.pendingOrders)} />
                        </div>
                    </Card>

                    <Card className="p-5 lg:col-span-3">
                        <h2 className="text-lg font-semibold text-[#171717]">Recent orders</h2>
                        <p className="text-sm text-[#525252] mt-1">Latest 12</p>
                        <Divider className="my-4" />

                        <div className="overflow-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-[#A3A3A3]">
                                        <th className="py-2 pr-3">Customer</th>
                                        <th className="py-2 pr-3">Status</th>
                                        <th className="py-2 pr-3">Total</th>
                                        <th className="py-2 pr-3">Created</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((o) => (
                                        <tr key={o.id} className="border-t border-[#E5E5E5]">
                                            <td className="py-2 pr-3 text-[#171717] font-medium">{o.customerName}</td>
                                            <td className="py-2 pr-3 text-[#525252]">{o.status}</td>
                                            <td className="py-2 pr-3 text-[#525252]">{o.total.toLocaleString()}</td>
                                            <td className="py-2 pr-3 text-[#A3A3A3]">{new Date(o.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            ) : null}

            {tab === "devices" || tab === "repairs" || tab === "tickets" ? (
                <Card className="p-6">
                    <h2 className="text-lg font-semibold text-[#171717]">{tabLabel(tab)}</h2>
                    <p className="text-sm text-[#525252] mt-1">
                        UI scaffold is ready. To make this fully functional we should add Prisma models
                        (devices, repair jobs, service tickets) and wire create/update flows.
                    </p>
                    <Divider className="my-4" />
                    <div className="text-sm text-[#A3A3A3]">
                        Suggested next step: add `Device`, `RepairJob`, and `Ticket` models in `prisma/schema.prisma`.
                    </div>
                </Card>
            ) : null}
        </div>
    );
}

function TabButton({ tab, setTab, value, label }: { tab: TabKey; setTab: (t: TabKey) => void; value: TabKey; label: string }) {
    const active = tab === value;
    return (
        <button
            type="button"
            onClick={() => setTab(value)}
            className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${active
                ? "bg-[#171717] text-white border-[#171717]"
                : "bg-white text-[#525252] border-[#E5E5E5] hover:text-[#171717]"
                }`}
        >
            {label}
        </button>
    );
}

function Field({ label, name, placeholder, required, type = "text", textarea = false }: { label: string; name: string; placeholder?: string; required?: boolean; type?: string; textarea?: boolean }) {
    return (
        <label className="block">
            <span className="block text-xs font-medium uppercase tracking-[0.15em] text-[#A3A3A3] mb-1">{label}</span>
            {textarea ? (
                <textarea
                    name={name}
                    required={required}
                    placeholder={placeholder}
                    className="w-full min-h-[88px] px-3 py-2 text-sm bg-white border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#DBEAFE] placeholder:text-[#A3A3A3]"
                />
            ) : (
                <input
                    name={name}
                    type={type}
                    required={required}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#DBEAFE] placeholder:text-[#A3A3A3]"
                />
            )}
        </label>
    );
}

function Select({ label, name, options }: { label: string; name: string; options: string[] }) {
    return (
        <label className="block">
            <span className="block text-xs font-medium uppercase tracking-[0.15em] text-[#A3A3A3] mb-1">{label}</span>
            <select
                name={name}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#2563EB]"
                defaultValue={options[0]}
            >
                {options.map((o) => (
                    <option key={o} value={o}>{o}</option>
                ))}
            </select>
        </label>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-[#525252]">{label}</span>
            <span className="font-medium text-[#171717]">{value}</span>
        </div>
    );
}

function tabLabel(tab: TabKey) {
    switch (tab) {
        case "devices":
            return "Devices (incoming/outgoing)";
        case "repairs":
            return "Repairs";
        case "tickets":
            return "Tickets";
        default:
            return "";
    }
}
