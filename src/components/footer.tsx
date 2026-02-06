import Link from "next/link";

export function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        shop: [
            { label: "All Products", href: "/shop" },
            { label: "New Arrivals", href: "/shop?filter=new" },
            { label: "Refurbished", href: "/shop?filter=refurb" },
        ],
        services: [
            { label: "Laptop Repairs", href: "/repairs" },
            { label: "Custom Builds", href: "/support" },
            { label: "Trade-In", href: "/support" },
        ],
        company: [
            { label: "About Us", href: "/about" },
            { label: "Support", href: "/support" },
            { label: "Warranty", href: "/warranty" },
        ],
    };

    return (
        <footer className="mt-24 border-t border-[#E5E5E5]">
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-8">
                    {/* Brand */}
                    <div className="col-span-2">
                        <Link href="/" className="text-xl font-semibold text-[#171717]">
                            Hercles
                        </Link>
                        <p className="mt-4 text-sm text-[#525252] max-w-xs leading-relaxed">
                            A curated collection of flagship laptops and rare engineering marvels.
                            Quiet power, exceptional quality.
                        </p>
                        <div className="flex gap-4 mt-6">
                            <a
                                href="#"
                                className="w-9 h-9 flex items-center justify-center rounded-full bg-[#F5F5F5] text-[#525252] hover:bg-[#171717] hover:text-white transition-colors"
                                aria-label="Twitter"
                            >
                                𝕏
                            </a>
                            <a
                                href="#"
                                className="w-9 h-9 flex items-center justify-center rounded-full bg-[#F5F5F5] text-[#525252] hover:bg-[#171717] hover:text-white transition-colors"
                                aria-label="Instagram"
                            >
                                IG
                            </a>
                            <a
                                href="#"
                                className="w-9 h-9 flex items-center justify-center rounded-full bg-[#F5F5F5] text-[#525252] hover:bg-[#171717] hover:text-white transition-colors"
                                aria-label="LinkedIn"
                            >
                                in
                            </a>
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 className="text-xs font-medium uppercase tracking-wider text-[#A3A3A3] mb-4">
                            Shop
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.shop.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-[#525252] hover:text-[#171717] transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-xs font-medium uppercase tracking-wider text-[#A3A3A3] mb-4">
                            Services
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.services.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-[#525252] hover:text-[#171717] transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-xs font-medium uppercase tracking-wider text-[#A3A3A3] mb-4">
                            Company
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-[#525252] hover:text-[#171717] transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-16 pt-8 border-t border-[#E5E5E5] flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-[#A3A3A3]">
                        © {currentYear} Hercles Computers. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-[#A3A3A3]">
                        <Link href="/privacy" className="hover:text-[#525252] transition-colors">
                            Privacy
                        </Link>
                        <Link href="/terms" className="hover:text-[#525252] transition-colors">
                            Terms
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
