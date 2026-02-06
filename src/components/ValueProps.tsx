const valueProps = [
    {
        icon: "✓",
        title: "Curated Selection",
        description: "Every laptop is hand-picked for exceptional build quality, performance, and engineering excellence.",
    },
    {
        icon: "⚡",
        title: "Expert Repairs",
        description: "Component-level repairs by certified technicians. We fix what others replace.",
    },
    {
        icon: "🛡",
        title: "2-Year Warranty",
        description: "Full coverage on all products. We stand behind every device we sell.",
    },
    {
        icon: "🚚",
        title: "Free Shipping",
        description: "Complimentary delivery on orders over KES 300,000. Careful packaging guaranteed.",
    },
];

export function ValueProps() {
    return (
        <section className="w-full bg-[#F5F5F5] py-24">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#A3A3A3] mb-3">
                        Why Hercles
                    </p>
                    <h2 className="text-3xl font-semibold text-[#171717] tracking-tight">
                        The Hercles difference
                    </h2>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                    {valueProps.map((prop, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-6 transition-all duration-300 hover:shadow-md"
                        >
                            <div className="w-12 h-12 bg-[#F5F5F5] rounded-lg flex items-center justify-center text-xl mb-4">
                                {prop.icon}
                            </div>
                            <h3 className="font-semibold text-[#171717] mb-2">
                                {prop.title}
                            </h3>
                            <p className="text-sm text-[#525252] leading-relaxed">
                                {prop.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
