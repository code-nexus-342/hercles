import { Card } from "@/ui/glass";
import { notFound } from "next/navigation";
import { SafeImage } from "@/components/SafeImage";
import { formatCurrency, getEffectivePrice } from "@/lib/pricing";
import { AddToCartButton } from "@/components/AddToCartButton";
import { getProductBySlug } from "@/lib/catalog";

export const dynamic = "force-dynamic";

type PageParams = Promise<{ slug: string }>;

export default async function ProductPage({
    params,
}: {
    params: PageParams;
}) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    const highlights = Array.isArray(product.highlightsJson) ? (product.highlightsJson as string[]) : [];
    const specs = product.specsJson && typeof product.specsJson === "object" ? (product.specsJson as Record<string, string | number | boolean>) : {};

    return (
        <div className="min-h-screen pt-20 pb-24 px-4 sm:px-6 bg-[#FAFAFA]">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12">
                {/* Product Image */}
                <div className="relative aspect-square bg-[#F5F5F5] rounded-2xl overflow-hidden">
                    {product.images[0]?.url ? (
                        <SafeImage
                            src={product.images[0].url}
                            alt={product.title}
                            fill
                            sizes="(min-width: 1024px) 50vw, 100vw"
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-[#A3A3A3]">
                            Image coming soon
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="flex flex-col">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#A3A3A3] mb-2">
                        {product.categories[0]?.category.name ?? product.brand}
                    </p>
                    <h1 className="text-3xl md:text-4xl font-semibold text-[#171717] tracking-tight mb-4">
                        {product.title}
                    </h1>
                    <p className="text-[#525252] leading-relaxed mb-6">
                        {product.description}
                    </p>

                    {/* Highlights & Condition */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {highlights.map((highlight) => (
                            <span
                                key={highlight}
                                className="px-3 py-1.5 bg-[#F5F5F5] rounded-full text-sm text-[#525252]"
                            >
                                {highlight}
                            </span>
                        ))}
                        <span className="px-3 py-1.5 bg-[#DBEAFE] rounded-full text-xs font-medium uppercase tracking-wider text-[#2563EB]">
                            {product.condition}
                        </span>
                    </div>

                    {/* Price */}
                    <div className="text-3xl font-semibold text-[#171717] mb-8">
                        {formatCurrency(getEffectivePrice(product))}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <div className="flex-1">
                            <AddToCartButton
                                productId={product.id}
                                returnTo={`/p/${product.slug}`}
                                className="w-full px-6 py-3.5 bg-[#171717] text-white font-medium rounded-lg hover:bg-[#404040] transition-colors disabled:opacity-50"
                            />
                        </div>
                        <button className="w-full sm:w-12 h-12 flex items-center justify-center rounded-lg border border-[#E5E5E5] text-[#525252] hover:bg-[#F5F5F5] hover:text-[#171717] transition-colors">
                            ♡
                        </button>
                    </div>
                </div>
            </div>

            {/* Technical Specs */}
            {Object.keys(specs).length ? (
                <div className="max-w-6xl mx-auto mt-12">
                    <Card className="p-8">
                        <h2 className="text-xl font-semibold text-[#171717] mb-6">
                            Technical Specifications
                        </h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {Object.entries(specs).map(([key, value]) => (
                                <div
                                    key={key}
                                    className="min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3 border-b border-[#E5E5E5]"
                                >
                                    <span className="text-sm text-[#525252] capitalize">
                                        {key.replace(/_/g, " ")}
                                    </span>
                                    <span className="font-medium text-[#171717] sm:text-right break-words">
                                        {String(value)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            ) : null}
        </div>
    );
}
