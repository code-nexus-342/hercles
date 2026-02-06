const testimonials = [
    {
        quote: "The curation is exceptional. Every laptop I've purchased from Hercles has exceeded expectations. They truly understand quality engineering.",
        author: "Michael Chen",
        role: "Software Engineer",
        company: "Stripe",
    },
    {
        quote: "Finally, a place that values build quality over marketing hype. The attention to detail and customer service is unmatched.",
        author: "Sarah Okonkwo",
        role: "Product Designer",
        company: "Figma",
    },
    {
        quote: "Their repair service saved my ThinkPad. Quick turnaround, transparent pricing, and they actually fix the root cause.",
        author: "David Kimani",
        role: "DevOps Lead",
        company: "Safaricom",
    },
];

export function Testimonials() {
    return (
        <section className="w-full max-w-6xl mx-auto px-6 py-24">
            <div className="text-center mb-16">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#A3A3A3] mb-3">
                    Testimonials
                </p>
                <h2 className="text-3xl font-semibold text-[#171717] tracking-tight">
                    What our customers say
                </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                    <div
                        key={index}
                        className="bg-white border border-[#E5E5E5] rounded-xl p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                    >
                        {/* Quote Icon */}
                        <div className="text-4xl text-[#E5E5E5] font-serif leading-none mb-4">
                            "
                        </div>

                        <p className="text-[#525252] leading-relaxed mb-6">
                            {testimonial.quote}
                        </p>

                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-[#F5F5F5] rounded-full flex items-center justify-center text-sm font-medium text-[#525252]">
                                {testimonial.author.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                                <p className="font-medium text-[#171717]">
                                    {testimonial.author}
                                </p>
                                <p className="text-sm text-[#A3A3A3]">
                                    {testimonial.role}, {testimonial.company}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
