import { SafeImage } from "@/components/SafeImage";
import Link from "next/link";

interface ProductSpotlightProps {
    title: string;
    description: string;
    price: string;
    imageUrl?: string;
    features?: string[];
    ctaHref?: string;
}

export function ProductSpotlight({
    title,
    description,
    price,
    imageUrl,
    features = [],
    ctaHref = "/shop",
}: ProductSpotlightProps) {
    return (
        <section className="w-full max-w-6xl mx-auto px-6 py-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Image */}
                <div className="relative aspect-[4/3] bg-[#F5F5F5] rounded-2xl overflow-hidden">
                    {imageUrl ? (
                        <SafeImage
                            src={imageUrl}
                            alt={title}
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

                {/* Content */}
                <div className="space-y-6">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#A3A3A3] mb-2">
                            Featured
                        </p>
                        <h2 className="text-3xl md:text-4xl font-semibold text-[#171717] tracking-tight mb-4">
                            {title}
                        </h2>
                        <p className="text-[#525252] leading-relaxed">
                            {description}
                        </p>
                    </div>

                    {/* Features */}
                    {features.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {features.map((feature, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1.5 bg-[#F5F5F5] rounded-full text-sm text-[#525252]"
                                >
                                    {feature}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Price & CTA */}
                    <div className="flex items-center gap-6 pt-4">
                        <span className="text-3xl font-semibold text-[#171717]">
                            {price}
                        </span>
                        <Link
                            href={ctaHref}
                            className="px-6 py-3 bg-[#171717] text-white font-medium rounded-lg hover:bg-[#404040] transition-colors"
                        >
                            View Details →
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
