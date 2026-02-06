"use client";

import Link from "next/link";
import { SafeImage } from "@/components/SafeImage";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";

export function FloatingNav() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const router = useRouter();
    const { count: cartCount } = useCart();
    const [visible, setVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const logoClicksRef = useRef(0);
    const logoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleLogoClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        // Secret admin entry: 3 quick clicks within a short window.
        // We delay navigation slightly so we can detect the triple-click even from other pages.
        event.preventDefault();

        if (logoTimerRef.current) {
            clearTimeout(logoTimerRef.current);
            logoTimerRef.current = null;
        }

        logoClicksRef.current += 1;

        if (logoClicksRef.current >= 3) {
            logoClicksRef.current = 0;
            router.push("/admin/ops");
            return;
        }

        logoTimerRef.current = setTimeout(() => {
            const clicks = logoClicksRef.current;
            logoClicksRef.current = 0;

            // Treat a single click as "go home" without reloading the home page.
            if (clicks === 1 && pathname !== "/") {
                router.push("/");
            }
        }, 450);
    };

    useEffect(() => {
        return () => {
            if (logoTimerRef.current) {
                clearTimeout(logoTimerRef.current);
                logoTimerRef.current = null;
            }
        };
    }, []);

    // Smart hide/show on scroll
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Always show near top of page
            if (currentScrollY < 100) {
                setVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 200) {
                // Scrolling down - hide
                setVisible(false);
            } else {
                // Scrolling up - show
                setVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    const navItems = [
        { href: "/", icon: "⌂", label: "Home" },
        { href: "/shop", icon: "◉", label: "Shop" },
        { href: "/repairs", icon: "⚙", label: "Repairs" },
        { href: "/cart", icon: "◎", label: "Cart", badge: cartCount },
    ];

    return (
        <>
            {/* Top Logo Bar - minimal */}
            <header className="fixed top-0 left-0 right-0 z-40 p-4 flex justify-between items-center pointer-events-none">
                <Link
                    href="/"
                    onClick={handleLogoClick}
                    className="pointer-events-auto flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-[#E5E5E5]"
                    aria-label="Hercles home (triple-click for admin)"
                >
                    <SafeImage
                        src="/brand/logo.svg"
                        fallbackSrc="/placeholder.svg"
                        alt="Hercles Computers"
                        width={28}
                        height={28}
                        className="opacity-90"
                    />
                    <span className="text-xl font-semibold tracking-tight text-[#171717] hover:text-[#525252] transition-colors">
                        Hercles
                    </span>
                </Link>

                <div className="pointer-events-auto flex items-center gap-2">
                    {session ? (
                        <button
                            onClick={() => signOut()}
                            className="text-sm font-medium text-[#525252] hover:text-[#171717] bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full transition-colors"
                        >
                            Sign out
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            className="text-sm font-medium bg-[#171717] text-white px-4 py-2 rounded-full hover:bg-[#404040] transition-colors"
                        >
                            Sign in
                        </Link>
                    )}
                </div>
            </header>

            {/* Floating Navigation Pill */}
            <nav
                className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${visible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-20 pointer-events-none"
                    }`}
            >
                <div className="flex items-center gap-1 bg-[#171717] rounded-full px-2 py-2 shadow-2xl shadow-black/20">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== "/" && pathname.startsWith(item.href));

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`relative flex flex-col items-center justify-center px-4 py-2 rounded-full transition-all ${isActive
                                        ? "bg-white text-[#171717]"
                                        : "text-white/70 hover:text-white hover:bg-white/10"
                                    }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span className="text-[10px] font-medium mt-0.5">{item.label}</span>

                                {/* Badge */}
                                {item.badge && item.badge > 0 ? (
                                    <span className="absolute -top-1 -right-1 bg-[#2563EB] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                        {item.badge > 9 ? "9+" : item.badge}
                                    </span>
                                ) : null}
                            </Link>
                        );
                    })}

                    {/* More Menu */}
                    <MoreMenu />
                </div>
            </nav>
        </>
    );
}

function MoreMenu() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const menuItems = [
        { href: "/about", label: "About" },
        { href: "/support", label: "Support" },
        { href: "/orders", label: "Orders" },
    ];

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className={`flex flex-col items-center justify-center px-4 py-2 rounded-full transition-all ${open ? "bg-white/20 text-white" : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
            >
                <span className="text-lg">⋯</span>
                <span className="text-[10px] font-medium mt-0.5">More</span>
            </button>

            {open && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute bottom-full right-0 mb-3 bg-white rounded-xl shadow-xl border border-[#E5E5E5] py-2 min-w-[140px] z-50 animate-fade-up">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={`block px-4 py-2.5 text-sm transition-colors ${pathname === item.href
                                        ? "text-[#171717] font-medium bg-[#F5F5F5]"
                                        : "text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F5]"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
