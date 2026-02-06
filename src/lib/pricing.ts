export function formatCurrency(amount: number, currency = "KES") {
    return new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    }).format(amount);
}

export function getEffectivePrice(product: {
    priceAmount: number;
    salePriceAmount?: number | null;
    saleStart?: Date | null;
    saleEnd?: Date | null;
}) {
    const now = new Date();

    if (product.salePriceAmount) {
        const hasStart = product.saleStart instanceof Date;
        const hasEnd = product.saleEnd instanceof Date;

        if (!hasStart && !hasEnd) {
            return product.salePriceAmount;
        }

        if (hasStart && hasEnd && product.saleStart && product.saleEnd) {
            if (now >= product.saleStart && now <= product.saleEnd) {
                return product.salePriceAmount;
            }
        }
    }

    return product.priceAmount;
}
