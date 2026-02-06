"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { authOptions } from "@/lib/auth";

function parseIntField(value: FormDataEntryValue | null, fallback = 0) {
    if (typeof value !== "string") return fallback;
    const n = Number.parseInt(value, 10);
    return Number.isFinite(n) ? n : fallback;
}

function parseStringField(value: FormDataEntryValue | null) {
    if (typeof value !== "string") return "";
    return value.trim();
}

function parseJsonObject(value: string) {
    if (!value.trim()) return {};
    const parsed = JSON.parse(value);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("Specs JSON must be an object.");
    }
    return parsed as Record<string, string | number | boolean>;
}

export type AdminActionState =
    | { ok: true; message: string }
    | { ok: false; message: string };

export async function createProductAction(
    _prev: AdminActionState,
    formData: FormData
): Promise<AdminActionState> {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || session.user.role !== "ADMIN") {
            return { ok: false, message: "Unauthorized" };
        }

        const slug = parseStringField(formData.get("slug"));
        const title = parseStringField(formData.get("title"));
        const brand = parseStringField(formData.get("brand"));
        const model = parseStringField(formData.get("model"));
        const description = parseStringField(formData.get("description"));
        const condition = parseStringField(formData.get("condition")) || "NEW";
        const status = parseStringField(formData.get("status")) || "DRAFT";

        const priceAmount = parseIntField(formData.get("priceAmount"), 0);
        const salePriceAmountRaw = parseStringField(formData.get("salePriceAmount"));
        const stockRemaining = parseIntField(formData.get("stockRemaining"), 0);
        const warrantyMonths = parseIntField(formData.get("warrantyMonths"), 12);
        const returnPolicyDays = parseIntField(formData.get("returnPolicyDays"), 14);

        const specsJsonRaw = parseStringField(formData.get("specsJson"));
        const highlightsRaw = parseStringField(formData.get("highlights"));
        const categoriesRaw = parseStringField(formData.get("categories"));
        const imageUrl = parseStringField(formData.get("imageUrl"));
        const imageAlt = parseStringField(formData.get("imageAlt"));

        if (!slug || !title || !brand || !model || !description) {
            return { ok: false, message: "Missing required fields (slug, title, brand, model, description)." };
        }
        if (priceAmount <= 0) {
            return { ok: false, message: "Price must be greater than 0." };
        }

        const specsJson = parseJsonObject(specsJsonRaw);
        const highlightsJson = highlightsRaw
            ? highlightsRaw
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean)
            : [];

        const categorySlugs = categoriesRaw
            ? categoriesRaw
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : [];

        const categories = await prisma.category.findMany({
            where: categorySlugs.length ? { slug: { in: categorySlugs } } : undefined,
            select: { id: true, slug: true },
        });

        const missing = categorySlugs.filter((s) => !categories.some((c) => c.slug === s));
        if (missing.length) {
            return { ok: false, message: `Unknown categories: ${missing.join(", ")}` };
        }

        const existing = await prisma.product.findUnique({ where: { slug }, select: { id: true } });
        if (existing) {
            return { ok: false, message: `Product slug already exists: ${slug}` };
        }

        await prisma.product.create({
            data: {
                slug,
                title,
                brand,
                model,
                description,
                condition: condition === "REFURBISHED" ? "REFURBISHED" : "NEW",
                status: status === "ACTIVE" || status === "ARCHIVED" ? status : "DRAFT",
                priceAmount,
                salePriceAmount: salePriceAmountRaw ? Number.parseInt(salePriceAmountRaw, 10) : null,
                saleStart: null,
                saleEnd: null,
                warrantyMonths,
                returnPolicyDays,
                stockRemaining,
                specsJson,
                highlightsJson,
                categories: {
                    create: categories.map((c) => ({ categoryId: c.id })),
                },
                images: imageUrl
                    ? {
                        create: [{
                            url: imageUrl,
                            alt: imageAlt || title,
                            sortOrder: 0,
                        }],
                    }
                    : undefined,
            },
        });

        revalidatePath("/shop");
        revalidatePath("/admin/ops");
        revalidatePath("/admin");

        return { ok: true, message: "Product created." };
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unexpected error";
        return { ok: false, message };
    }
}
