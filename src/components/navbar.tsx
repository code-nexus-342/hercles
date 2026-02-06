"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";

export function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const { count: cartCount } = useCart();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll for navbar background
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { href: "/shop", label: "Shop" },
        { href: "/repairs", label: "Repairs" },
        { href: "/about", label: "About" },
        { href: "/support", label: "Support" },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-sm border-b border-[#E5E5E5]" : "bg-transparent"}`}>
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link
                    href="/"
                    className="text-xl font-semibold tracking-tight text-[#171717] hover:text-[#525252] transition-colors"
                >
                    Hercles
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm font-medium transition-colors ${pathname === link.href
                                    ? "text-[#171717]"
                                    : "text-[#525252] hover:text-[#171717]"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <Link href="/cart" className="relative group">
                        <span className="text-sm font-medium text-[#525252] group-hover:text-[#171717] transition-colors">
                            Cart
                        </span>
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-4 bg-[#171717] text-white text-[10px] font-medium w-5 h-5 flex items-center justify-center rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {session ? (
                        <button
                            onClick={() => signOut()}
                            className="text-sm font-medium text-[#525252] hover:text-[#171717] transition-colors"
                        >
                            Sign out
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            className="px-4 py-2 bg-[#171717] text-white text-sm font-medium rounded-lg hover:bg-[#404040] transition-colors"
                        >
                            Sign in
                        </Link>
                    )}

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5"
                        aria-label="Toggle menu"
                    >
                        <span className={`w-5 h-0.5 bg-[#171717] transition-all ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
                        <span className={`w-5 h-0.5 bg-[#171717] transition-all ${mobileMenuOpen ? "opacity-0" : ""}`} />
                        <span className={`w-5 h-0.5 bg-[#171717] transition-all ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-[#E5E5E5] px-6 py-6">
                    <div className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-base font-medium text-[#525252] hover:text-[#171717] transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
