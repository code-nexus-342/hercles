import Link from "next/link";

const repairServices = [
    {
        title: "Diagnostic & Assessment",
        description: "Complete hardware and software diagnostic to identify issues.",
        price: "KES 2,500",
        duration: "Same Day",
    },
    {
        title: "Screen Replacement",
        description: "LCD, LED, OLED, and touchscreen panel replacements for all brands.",
        price: "From KES 15,000",
        duration: "1-3 Days",
    },
    {
        title: "Battery Replacement",
        description: "Genuine and compatible battery replacements with warranty.",
        price: "From KES 8,000",
        duration: "Same Day",
    },
    {
        title: "Keyboard Repair",
        description: "Individual key fixes, full keyboard replacements, and backlight repair.",
        price: "From KES 5,000",
        duration: "1-2 Days",
    },
    {
        title: "Motherboard Repair",
        description: "Component-level repair for power issues, no boot, and liquid damage.",
        price: "From KES 12,000",
        duration: "3-7 Days",
    },
    {
        title: "Data Recovery",
        description: "Recover data from failed drives, corrupted systems, or accidental deletion.",
        price: "From KES 10,000",
        duration: "2-5 Days",
    },
];

const brands = ["Apple", "ASUS", "Dell", "HP", "Lenovo", "Razer", "MSI", "Acer", "Microsoft", "ThinkPad"];

export default function RepairsPage() {
    return (
        <div className="min-h-screen pt-32 pb-16 px-6 bg-[#FAFAFA]">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#A3A3A3] mb-3">
                        Services
                    </p>
                    <h1 className="text-4xl md:text-5xl font-semibold text-[#171717] tracking-tight mb-6">
                        Laptop Repairs
                    </h1>
                    <p className="text-lg text-[#525252] leading-relaxed max-w-xl mx-auto">
                        Professional repair services for all major laptop brands.
                        Fast turnaround, genuine parts, expert technicians.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 mt-8">
                        <a
                            href="#request-repair"
                            className="px-6 py-3 bg-[#171717] text-white font-medium rounded-lg hover:bg-[#404040] transition-colors"
                        >
                            Request Repair
                        </a>
                        <a
                            href="tel:+254700000000"
                            className="px-6 py-3 bg-transparent text-[#171717] font-medium rounded-lg border border-[#E5E5E5] hover:bg-[#F5F5F5] transition-colors"
                        >
                            Call Us
                        </a>
                    </div>
                </div>

                {/* Brands */}
                <div className="bg-white border border-[#E5E5E5] rounded-xl p-8 mb-12 text-center">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#A3A3A3] mb-6">
                        Brands We Service
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {brands.map((brand, index) => (
                            <span
                                key={index}
                                className="px-4 py-2 bg-[#F5F5F5] text-[#525252] text-sm font-medium rounded-full"
                            >
                                {brand}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Services Grid */}
                <div className="mb-16">
                    <h2 className="text-2xl font-semibold text-[#171717] mb-8 text-center">
                        Our Services
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {repairServices.map((service, index) => (
                            <div
                                key={index}
                                className="bg-white border border-[#E5E5E5] rounded-xl p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-semibold text-[#171717]">
                                        {service.title}
                                    </h3>
                                    <span className="text-xs font-medium px-2 py-1 bg-[#F5F5F5] text-[#525252] rounded-full">
                                        {service.duration}
                                    </span>
                                </div>
                                <p className="text-sm text-[#525252] mb-4 leading-relaxed">
                                    {service.description}
                                </p>
                                <div className="text-lg font-semibold text-[#171717]">
                                    {service.price}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                    {[
                        { number: "90 Day", label: "Repair warranty" },
                        { number: "24-48hr", label: "Fast turnaround" },
                        { number: "100%", label: "Genuine parts" },
                        { number: "Free", label: "Diagnostic quote" },
                    ].map((stat, index) => (
                        <div key={index} className="text-center py-6 bg-white border border-[#E5E5E5] rounded-xl">
                            <div className="text-xl font-semibold text-[#171717]">{stat.number}</div>
                            <div className="text-sm text-[#A3A3A3] mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Request Form */}
                <div id="request-repair" className="bg-white border border-[#E5E5E5] rounded-2xl p-8 md:p-12">
                    <h2 className="text-2xl font-semibold text-[#171717] mb-8">
                        Request a Repair
                    </h2>

                    <form className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#171717]">
                                Your Name
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#DBEAFE] transition-all"
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#171717]">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#DBEAFE] transition-all"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#171717]">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                required
                                className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#DBEAFE] transition-all"
                                placeholder="+254 700 000 000"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#171717]">
                                Laptop Brand & Model
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#DBEAFE] transition-all"
                                placeholder="e.g. MacBook Pro 14 2023"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-[#171717]">
                                Describe the Issue
                            </label>
                            <textarea
                                rows={4}
                                required
                                className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#DBEAFE] transition-all resize-none"
                                placeholder="Please describe the problem you're experiencing..."
                            />
                        </div>

                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                className="px-6 py-3 bg-[#171717] text-white font-medium rounded-lg hover:bg-[#404040] transition-colors"
                            >
                                Submit Request
                            </button>
                        </div>
                    </form>
                </div>

                {/* Contact CTA */}
                <div className="text-center mt-12 py-12 bg-white border border-[#E5E5E5] rounded-2xl">
                    <h2 className="text-2xl font-semibold text-[#171717] mb-3">
                        Need urgent repair?
                    </h2>
                    <p className="text-[#525252] mb-6">
                        Drop by our service center or give us a call.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/support"
                            className="px-6 py-3 bg-[#171717] text-white font-medium rounded-lg hover:bg-[#404040] transition-colors"
                        >
                            Contact Support
                        </Link>
                        <a
                            href="tel:+254700000000"
                            className="px-6 py-3 bg-transparent text-[#171717] font-medium rounded-lg border border-[#E5E5E5] hover:bg-[#F5F5F5] transition-colors"
                        >
                            +254 700 000 000
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
