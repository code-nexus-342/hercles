import { ProductSpotlight } from "@/components/ProductSpotlight";
import Link from "next/link";
import { SafeImage } from "@/components/SafeImage";
import { formatCurrency, getEffectivePrice } from "@/lib/pricing";
import { getFeaturedProductBySlug, getTrendingProducts } from "@/lib/catalog";
import { BrandTicker } from "@/components/BrandTicker";
import { ValueProps } from "@/components/ValueProps";
import { Testimonials } from "@/components/Testimonials";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [featuredProduct, trendingProducts] = await Promise.all([
    getFeaturedProductBySlug("asus-zenbook-17-fold-oled"),
    getTrendingProducts(4),
  ]);

  const featured = featuredProduct ?? trendingProducts[0];
  const trending = featured
    ? trendingProducts.filter((product) => product.id !== featured.id).slice(0, 3)
    : trendingProducts.slice(0, 3);

  const featuredHighlights = Array.isArray(featured?.highlightsJson)
    ? (featured?.highlightsJson as string[])
    : [];

  return (
    <main className="min-h-screen flex flex-col items-center bg-[#FAFAFA]">
      {/* Hero Section */}
      <section className="relative w-full max-w-6xl pt-20 pb-20 px-6 text-center flex flex-col items-center">
        {/* Decorative gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#DBEAFE] to-transparent rounded-full blur-3xl opacity-50 -z-10" />

        <span className="inline-block px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-[#525252] border border-[#E5E5E5] rounded-full mb-6">
          Curated Engineering
        </span>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-[#171717] leading-[1.1] tracking-tight mb-6">
          Flagship laptops.
          <br />
          <span className="text-[#525252]">Exceptional quality.</span>
        </h1>

        <p className="text-lg text-[#525252] max-w-xl leading-relaxed mb-10">
          A carefully curated collection of rare engineering marvels and premium laptops.
          Quiet power, tactile design, lasting value.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/shop"
            className="px-7 py-3.5 bg-[#171717] text-white font-medium rounded-lg hover:bg-[#404040] transition-colors"
          >
            Explore Collection
          </Link>
          <Link
            href="/repairs"
            className="px-7 py-3.5 bg-transparent text-[#171717] font-medium rounded-lg border border-[#E5E5E5] hover:bg-[#F5F5F5] transition-colors"
          >
            Repair Services
          </Link>
        </div>
      </section>

      <BrandTicker />

      {/* Spotlight Section */}
      {featured ? (
        <ProductSpotlight
          title={featured.title}
          description={featured.description}
          price={formatCurrency(getEffectivePrice(featured))}
          imageUrl={featured.images[0]?.url}
          features={featuredHighlights.length ? featuredHighlights : ["Flagship engineering", "Curated by Hercles", "Limited availability"]}
          ctaHref={`/p/${featured.slug}`}
        />
      ) : null}

      {/* Trending Grid Section */}
      <section className="w-full max-w-6xl px-6 py-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#A3A3A3] mb-2">
              Latest
            </p>
            <h2 className="text-2xl font-semibold text-[#171717] tracking-tight">
              Trending arrivals
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-sm font-medium text-[#525252] hover:text-[#171717] transition-colors"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trending.map((product) => (
            <Link
              key={product.id}
              href={`/p/${product.slug}`}
              className="group flex flex-col bg-white border border-[#E5E5E5] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] bg-[#F5F5F5] overflow-hidden">
                {product.images[0]?.url ? (
                  <SafeImage
                    src={product.images[0].url}
                    alt={product.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-[#A3A3A3]">
                    Image coming soon
                  </div>
                )}
              </div>

              <div className="p-5 flex flex-col flex-1">
                <span className="text-xs font-medium text-[#A3A3A3] uppercase tracking-wider mb-1">
                  {product.categories[0]?.category.name ?? "Signature"}
                </span>
                <h3 className="font-medium text-[#171717] mb-2 group-hover:text-[#2563EB] transition-colors">
                  {product.title}
                </h3>
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-[#E5E5E5]">
                  <span className="text-lg font-semibold text-[#171717]">
                    {formatCurrency(getEffectivePrice(product))}
                  </span>
                  <span className="text-sm text-[#A3A3A3] group-hover:text-[#171717] transition-colors">
                    View →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Testimonials />
      <ValueProps />
    </main>
  );
}
