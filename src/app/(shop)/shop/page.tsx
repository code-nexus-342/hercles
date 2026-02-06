import Link from "next/link";
import { SafeImage } from "@/components/SafeImage";
import { formatCurrency, getEffectivePrice } from "@/lib/pricing";
import { addToCart } from "@/app/actions/cart";
import { getCategories, getShopProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function ShopPage({
    searchParams,
}: {
    searchParams?: Promise<SearchParams>;
}) {
    const resolvedSearchParams = (await searchParams) ?? {};
    const category = typeof resolvedSearchParams.category === "string" ? resolvedSearchParams.category : undefined;
    const filter = typeof resolvedSearchParams.filter === "string" ? resolvedSearchParams.filter : undefined;
    const min = typeof resolvedSearchParams.min === "string" ? Number(resolvedSearchParams.min) : undefined;
    const max = typeof resolvedSearchParams.max === "string" ? Number(resolvedSearchParams.max) : undefined;
    const sort = typeof resolvedSearchParams.sort === "string" ? resolvedSearchParams.sort : undefined;

    const [products, categories] = await Promise.all([
        getShopProducts({
            category,
            filter: filter === "new" || filter === "refurb" ? filter : undefined,
            min: Number.isFinite(min) ? min : undefined,
            max: Number.isFinite(max) ? max : undefined,
            sort: sort === "price_asc" || sort === "price_desc" || sort === "newest" ? sort : "newest",
        }),
        getCategories(),
    ]);

    return (
        <div className="min-h-screen pt-20 pb-24 px-6 flex gap-8 max-w-7xl mx-auto">
            {/* Filters Sidebar */}
            <aside className="hidden lg:block w-56 shrink-0">
                <div className="sticky top-28 space-y-8">
                    <div>
                        <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-[#A3A3A3] mb-4">
                            Category
                        </h3>
                        <div className="space-y-2">
                            <Link
                                href="/shop"
                                className={`block text-sm transition-colors ${!category ? "text-[#171717] font-medium" : "text-[#525252] hover:text-[#171717]"}`}
                            >
                                All Products
                            </Link>
                            {categories.map((c) => (
                                <Link
                                    key={c.id}
                                    href={`/shop?category=${c.slug}`}
                                    className={`block text-sm transition-colors ${category === c.slug ? "text-[#171717] font-medium" : "text-[#525252] hover:text-[#171717]"}`}
                                >
                                    {c.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-[#E5E5E5]" />

                    <div>
                        <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-[#A3A3A3] mb-4">
                            Price Range
                        </h3>
                        <form className="space-y-3" action="/shop" method="get">
                            {category ? <input type="hidden" name="category" value={category} /> : null}
                            <input
                                type="number"
                                name="min"
                                placeholder="Min"
                                defaultValue={Number.isFinite(min) ? String(min) : ""}
                                className="w-full px-3 py-2 text-sm bg-white border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#DBEAFE]"
                            />
                            <input
                                type="number"
                                name="max"
                                placeholder="Max"
                                defaultValue={Number.isFinite(max) ? String(max) : ""}
                                className="w-full px-3 py-2 text-sm bg-white border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#DBEAFE]"
                            />
                            <button className="w-full px-4 py-2 text-sm font-medium bg-[#171717] text-white rounded-lg hover:bg-[#404040] transition-colors">
                                Apply
                            </button>
                        </form>
                    </div>
                </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-semibold text-[#171717] tracking-tight">
                            {category ? categories.find(c => c.slug === category)?.name : "All Products"}
                        </h1>
                        <p className="text-sm text-[#A3A3A3] mt-1">
                            {products.length} {products.length === 1 ? "product" : "products"}
                        </p>
                    </div>
                    <form action="/shop" method="get" className="flex items-center gap-2">
                        {category ? <input type="hidden" name="category" value={category} /> : null}
                        {filter ? <input type="hidden" name="filter" value={filter} /> : null}
                        <select
                            name="sort"
                            defaultValue={sort ?? "newest"}
                            className="text-sm bg-white border border-[#E5E5E5] rounded-lg px-3 py-2 focus:outline-none focus:border-[#2563EB]"
                        >
                            <option value="newest">Newest</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                        </select>
                        <button
                            type="submit"
                            className="px-3 py-2 text-sm font-medium bg-[#171717] text-white rounded-lg hover:bg-[#404040] transition-colors"
                        >
                            Sort
                        </button>
                    </form>
                </div>

                {/* Product Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {products.map((p) => (
                        <div
                            key={p.id}
                            className="group bg-white border border-[#E5E5E5] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                        >
                            <Link href={`/p/${p.slug}`} className="relative block aspect-[4/3] bg-[#F5F5F5] overflow-hidden">
                                {p.images[0]?.url ? (
                                    <SafeImage
                                        src={p.images[0].url}
                                        alt={p.title}
                                        fill
                                        sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-sm text-[#A3A3A3]">
                                        Image coming soon
                                    </div>
                                )}
                            </Link>
                            <div className="p-5">
                                <Link href={`/p/${p.slug}`} className="font-medium text-[#171717] group-hover:text-[#2563EB] transition-colors block mb-1">
                                    {p.title}
                                </Link>
                                <p className="text-sm text-[#A3A3A3] mb-3">
                                    {p.categories[0]?.category.name ?? p.brand}
                                </p>
                                <span className="inline-block text-xs font-medium px-2 py-0.5 bg-[#F5F5F5] text-[#525252] rounded-full mb-3">
                                    {p.condition}
                                </span>
                                <div className="flex justify-between items-center pt-4 border-t border-[#E5E5E5]">
                                    <span className="text-lg font-semibold text-[#171717]">
                                        {formatCurrency(getEffectivePrice(p))}
                                    </span>
                                    <form action={addToCart}>
                                        <input type="hidden" name="productId" value={p.id} />
                                        <input type="hidden" name="quantity" value="1" />
                                        <input type="hidden" name="returnTo" value="/shop" />
                                        <button
                                            className="w-9 h-9 bg-[#F5F5F5] text-[#525252] rounded-lg flex items-center justify-center hover:bg-[#171717] hover:text-white transition-colors"
                                            aria-label="Add to cart"
                                        >
                                            +
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {products.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-[#525252]">No products match these filters.</p>
                        <Link href="/shop" className="inline-block mt-4 text-sm font-medium text-[#2563EB] hover:underline">
                            Clear filters
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
