import { unstable_cache } from "next/cache";
import prisma from "@/lib/db";
import { Condition, Prisma, ProductStatus } from "@prisma/client";

export type ShopQuery = {
    category?: string;
    filter?: "new" | "refurb";
    min?: number;
    max?: number;
    sort?: "newest" | "price_asc" | "price_desc";
};

function buildProductWhere(query: ShopQuery): Prisma.ProductWhereInput {
    const where: Prisma.ProductWhereInput = { status: ProductStatus.ACTIVE };

    if (query.filter === "new") where.condition = Condition.NEW;
    if (query.filter === "refurb") where.condition = Condition.REFURBISHED;

    if (query.category) {
        where.categories = { some: { category: { slug: query.category } } };
    }

    const min = Number.isFinite(query.min) ? query.min : undefined;
    const max = Number.isFinite(query.max) ? query.max : undefined;

    if (typeof min === "number" || typeof max === "number") {
        where.priceAmount = {
            ...(typeof min === "number" ? { gte: min } : null),
            ...(typeof max === "number" ? { lte: max } : null),
        };
    }

    return where;
}

function buildOrderBy(query: ShopQuery): Prisma.ProductOrderByWithRelationInput {
    switch (query.sort) {
        case "price_asc":
            return { priceAmount: "asc" };
        case "price_desc":
            return { priceAmount: "desc" };
        case "newest":
        default:
            return { createdAt: "desc" };
    }
}

export const getCategories = unstable_cache(
    async () => {
        return prisma.category.findMany({ orderBy: { name: "asc" } });
    },
    ["categories"],
    { revalidate: 300, tags: ["categories"] }
);

export async function getShopProducts(query: ShopQuery) {
    const categoryKey = query.category ?? "";
    const filterKey = query.filter ?? "";
    const minKey = typeof query.min === "number" ? String(query.min) : "";
    const maxKey = typeof query.max === "number" ? String(query.max) : "";
    const sortKey = query.sort ?? "newest";

    const where = buildProductWhere(query);
    const orderBy = buildOrderBy(query);

    const cached = unstable_cache(
        async () => {
            return prisma.product.findMany({
                where,
                orderBy,
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
                    createdAt: true,
                    images: { take: 1, orderBy: { sortOrder: "asc" }, select: { url: true, alt: true } },
                    categories: {
                        take: 1,
                        select: { category: { select: { name: true, slug: true } } },
                    },
                },
            });
        },
        ["shop-products", categoryKey, filterKey, minKey, maxKey, sortKey],
        { revalidate: 120, tags: ["products", "categories"] }
    );

    return cached();
}

export async function getProductBySlug(slug: string) {
    const cached = unstable_cache(
        async () => {
            return prisma.product.findUnique({
                where: { slug },
                include: {
                    images: { orderBy: { sortOrder: "asc" } },
                    categories: { include: { category: true } },
                },
            });
        },
        ["product", slug],
        { revalidate: 300, tags: ["products", `product:${slug}`] }
    );

    return cached();
}

export async function getFeaturedProductBySlug(slug: string) {
    const cached = unstable_cache(
        async () => {
            return prisma.product.findFirst({
                where: { slug, status: ProductStatus.ACTIVE },
                select: {
                    id: true,
                    slug: true,
                    title: true,
                    description: true,
                    priceAmount: true,
                    salePriceAmount: true,
                    saleStart: true,
                    saleEnd: true,
                    highlightsJson: true,
                    images: { take: 1, orderBy: { sortOrder: "asc" }, select: { url: true, alt: true } },
                    categories: { take: 1, select: { category: { select: { name: true, slug: true } } } },
                },
            });
        },
        ["featured", slug],
        { revalidate: 300, tags: ["products", `product:${slug}`] }
    );

    return cached();
}

export async function getTrendingProducts(take = 4) {
    const cached = unstable_cache(
        async () => {
            return prisma.product.findMany({
                where: { status: ProductStatus.ACTIVE },
                orderBy: [{ soldCount: "desc" }, { createdAt: "desc" }],
                take,
                select: {
                    id: true,
                    slug: true,
                    title: true,
                    description: true,
                    priceAmount: true,
                    salePriceAmount: true,
                    saleStart: true,
                    saleEnd: true,
                    highlightsJson: true,
                    images: { take: 1, orderBy: { sortOrder: "asc" }, select: { url: true, alt: true } },
                    categories: { take: 1, select: { category: { select: { name: true, slug: true } } } },
                },
            });
        },
        ["trending", String(take)],
        { revalidate: 120, tags: ["products", "categories"] }
    );

    return cached();
}
