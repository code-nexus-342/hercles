import { getServerSession } from "next-auth";
import Link from "next/link";
import { SafeImage } from "@/components/SafeImage";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { formatCurrency, getEffectivePrice } from "@/lib/pricing";
import { removeCartItem, updateCartItem } from "@/app/actions/cart";

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function CartPage({ searchParams }: { searchParams?: Promise<SearchParams> }) {
    const resolvedSearchParams = (await searchParams) ?? {};
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return (
            <div className="min-h-screen pt-32 pb-20 px-6 bg-[#FAFAFA]">
                <div className="max-w-md mx-auto text-center">
                    <div className="w-16 h-16 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-2xl">🛒</span>
                    </div>
                    <h1 className="text-2xl font-semibold text-[#171717] mb-3">
                        Your cart awaits
                    </h1>
                    <p className="text-[#525252] mb-8">
                        Sign in to save your cart and continue shopping.
                    </p>
                    <Link
                        href="/login"
                        className="inline-block px-6 py-3 bg-[#171717] text-white font-medium rounded-lg hover:bg-[#404040] transition-colors"
                    >
                        Sign in to continue
                    </Link>
                </div>
            </div>
        );
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
                            id: true,
                            slug: true,
                            title: true,
                            brand: true,
                            condition: true,
                            priceAmount: true,
                            salePriceAmount: true,
                            saleStart: true,
                            saleEnd: true,
                            images: {
                                take: 1,
                                orderBy: { sortOrder: "asc" },
                                select: { url: true, alt: true },
                            },
                        },
                    },
                },
            },
        },
    });

    const items = cart?.items ?? [];
    const subtotal = items.reduce((sum, item) => sum + getEffectivePrice(item.product) * item.quantity, 0);
    const shipping = subtotal >= 300000 ? 0 : items.length ? 2500 : 0;
    const total = subtotal + shipping;

    return (
        <div className="min-h-screen pt-20 pb-24 px-6 bg-[#FAFAFA]">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl font-semibold text-[#171717] mb-8">
                    Shopping Cart
                </h1>

                {/* Error Messages */}
                {resolvedSearchParams.error === "stock" && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        One or more items exceed available stock. Please adjust quantities.
                    </div>
                )}
                {resolvedSearchParams.error === "outofstock" && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        That laptop is currently out of stock.
                    </div>
                )}

                <div className="grid lg:grid-cols-[1fr,360px] gap-8">
                    {/* Cart Items */}
                    <div className="space-y-4">
                        {items.length === 0 ? (
                            <div className="bg-white border border-[#E5E5E5] rounded-xl p-8 text-center">
                                <p className="text-[#525252] mb-4">Your cart is empty.</p>
                                <Link
                                    href="/shop"
                                    className="inline-block text-sm font-medium text-[#2563EB] hover:underline"
                                >
                                    Continue shopping →
                                </Link>
                            </div>
                        ) : (
                            items.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white border border-[#E5E5E5] rounded-xl p-4 flex gap-4"
                                >
                                    {/* Product Image */}
                                    <div className="relative h-24 w-28 rounded-lg overflow-hidden bg-[#F5F5F5] shrink-0">
                                        {item.product.images[0]?.url ? (
                                            <SafeImage
                                                src={item.product.images[0].url}
                                                alt={item.product.title}
                                                fill
                                                sizes="112px"
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-xs text-[#A3A3A3]">
                                                No image
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1 min-w-0">
                                        <Link href={`/p/${item.product.slug}`} className="font-medium text-[#171717] hover:text-[#2563EB] transition-colors">
                                            {item.product.title}
                                        </Link>
                                        <p className="text-sm text-[#A3A3A3] mt-0.5">{item.product.brand}</p>
                                        <div className="mt-2 text-lg font-semibold text-[#171717]">
                                            {formatCurrency(getEffectivePrice(item.product))}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col items-end gap-2">
                                        <form action={updateCartItem} className="flex items-center gap-2">
                                            <input type="hidden" name="itemId" value={item.id} />
                                            <input
                                                type="number"
                                                name="quantity"
                                                min="1"
                                                defaultValue={item.quantity}
                                                className="w-16 px-2 py-1.5 text-sm bg-white border border-[#E5E5E5] rounded-lg text-center focus:outline-none focus:border-[#2563EB]"
                                            />
                                            <button className="text-xs font-medium text-[#525252] hover:text-[#171717] transition-colors">
                                                Update
                                            </button>
                                        </form>
                                        <form action={removeCartItem}>
                                            <input type="hidden" name="itemId" value={item.id} />
                                            <button className="text-xs text-[#A3A3A3] hover:text-red-500 transition-colors">
                                                Remove
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:sticky lg:top-28 h-fit">
                        <div className="bg-white border border-[#E5E5E5] rounded-xl p-6">
                            <h2 className="font-semibold text-[#171717] mb-4">
                                Order Summary
                            </h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-[#525252]">Subtotal</span>
                                    <span className="text-[#171717]">{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#525252]">Shipping</span>
                                    <span className={shipping === 0 ? "text-green-600" : "text-[#171717]"}>
                                        {shipping === 0 ? "Free" : formatCurrency(shipping)}
                                    </span>
                                </div>
                                <div className="h-px bg-[#E5E5E5] my-3" />
                                <div className="flex justify-between text-lg font-semibold">
                                    <span className="text-[#171717]">Total</span>
                                    <span className="text-[#171717]">{formatCurrency(total)}</span>
                                </div>
                            </div>

                            <Link
                                href="/checkout"
                                className={`block w-full text-center mt-6 px-6 py-3 bg-[#171717] text-white font-medium rounded-lg hover:bg-[#404040] transition-colors ${items.length === 0 ? "pointer-events-none opacity-50" : ""}`}
                            >
                                Proceed to Checkout
                            </Link>

                            <Link
                                href="/shop"
                                className="block w-full text-center mt-3 text-sm text-[#525252] hover:text-[#171717] transition-colors"
                            >
                                ← Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
