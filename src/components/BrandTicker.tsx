"use client";

const brands = [
    "Apple", "ASUS", "Dell", "HP", "Lenovo", "Microsoft", "Razer", "MSI", "Acer", "ThinkPad", "Samsung", "LG"
];

export function BrandTicker() {
    // Triple the brands for seamless loop
    const tickerBrands = [...brands, ...brands, ...brands];

    return (
        <div className="w-full py-8 bg-[#F5F5F5] overflow-hidden">
            <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-[#A3A3A3] mb-6">
                Trusted Brands
            </p>
            <div className="relative">
                <div
                    className="flex items-center gap-16 whitespace-nowrap animate-ticker"
                    style={{ width: "fit-content" }}
                >
                    {tickerBrands.map((brand, index) => (
                        <span
                            key={index}
                            className="text-lg font-medium text-[#525252]"
                        >
                            {brand}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
