export default function AboutPage() {
    return (
        <div className="min-h-screen pt-32 pb-16 px-6 bg-[#FAFAFA]">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#A3A3A3] mb-3">
                        About
                    </p>
                    <h1 className="text-4xl md:text-5xl font-semibold text-[#171717] tracking-tight mb-6">
                        The Hercles Standard
                    </h1>
                    <p className="text-lg text-[#525252] leading-relaxed max-w-xl mx-auto">
                        We curate rare engineering milestones and flagship laptops with a focus on
                        build quality, longevity, and exceptional performance.
                    </p>
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                    <p className="text-[#525252] leading-relaxed mb-8">
                        Hercles exists to bridge luxury design and professional-grade performance. Every system
                        we carry is inspected, calibrated, and packaged with white-glove service. From foldable
                        OLEDs to modular build platforms, we focus on laptops that tell a story.
                    </p>

                    {/* Values */}
                    <div className="grid md:grid-cols-3 gap-8 my-12">
                        {[
                            {
                                number: "01",
                                title: "Curated",
                                description: "Only the best devices make our roster—no filler, no compromise."
                            },
                            {
                                number: "02",
                                title: "Protected",
                                description: "Industry-leading warranty, transparent returns, and concierge support."
                            },
                            {
                                number: "03",
                                title: "Trusted",
                                description: "We partner with verified distributors to ensure authentic hardware."
                            },
                        ].map((value) => (
                            <div key={value.number} className="text-center md:text-left">
                                <span className="text-xs font-medium text-[#A3A3A3]">{value.number}</span>
                                <h3 className="text-lg font-semibold text-[#171717] mt-2 mb-2">{value.title}</h3>
                                <p className="text-sm text-[#525252]">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-16">
                    {[
                        { number: "500+", label: "Units delivered" },
                        { number: "80+", label: "Countries served" },
                        { number: "2 Year", label: "Full warranty" },
                        { number: "24/7", label: "Expert support" },
                    ].map((stat, index) => (
                        <div key={index} className="text-center py-6 bg-white border border-[#E5E5E5] rounded-xl">
                            <div className="text-2xl font-semibold text-[#171717]">{stat.number}</div>
                            <div className="text-sm text-[#A3A3A3] mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center bg-white border border-[#E5E5E5] rounded-2xl p-12">
                    <h2 className="text-2xl font-semibold text-[#171717] mb-3">
                        Ready to find your next machine?
                    </h2>
                    <p className="text-[#525252] mb-8 max-w-md mx-auto">
                        Browse our curated collection of flagship laptops and engineering marvels.
                    </p>
                    <a
                        href="/shop"
                        className="inline-block px-6 py-3 bg-[#171717] text-white font-medium rounded-lg hover:bg-[#404040] transition-colors"
                    >
                        Explore Collection
                    </a>
                </div>
            </div>
        </div>
    );
}
