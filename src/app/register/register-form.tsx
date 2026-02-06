"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Input } from "@/ui/glass";

function Spinner({ className }: { className?: string }) {
    return (
        <svg
            className={className ?? ""}
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
            />
        </svg>
    );
}

export function RegisterForm({ callbackUrl }: { callbackUrl: string }) {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const loginHref = useMemo(() => {
        return `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;
    }, [callbackUrl]);

    async function handleRegister(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const form = e.currentTarget;
        const data = Object.fromEntries(new FormData(form).entries()) as {
            name?: string;
            email?: string;
            password?: string;
        };

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: data.name ?? "",
                    email: data.email ?? "",
                    password: data.password ?? "",
                }),
            });

            if (!response.ok) {
                const payload = await response.json().catch(() => ({} as { error?: string }));
                if (response.status === 409) {
                    setError("An account already exists for this email. Please sign in instead.");
                } else if (response.status === 400) {
                    setError(payload.error ?? "Please check your details and try again.");
                } else {
                    setError(payload.error ?? "Registration failed.");
                }
                return;
            }

            const signInResult = await signIn("credentials", {
                email: data.email ?? "",
                password: data.password ?? "",
                redirect: false,
                callbackUrl,
            });

            if (signInResult?.error) {
                setError("Account created, but sign-in failed. Please try signing in.");
                return;
            }

            if (signInResult?.url) {
                window.location.href = signInResult.url;
            }
        } catch {
            setError("Unable to create your account right now. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1">
                <h2 className="text-xl font-semibold text-[#171717]">Create your account</h2>
                <p className="text-sm text-[#A3A3A3]">Takes less than a minute.</p>
            </div>

            <div className="space-y-3">
                <Input
                    name="name"
                    type="text"
                    placeholder="Full name (optional)"
                    autoComplete="name"
                />
                <Input
                    name="email"
                    type="email"
                    placeholder="Email address"
                    autoComplete="email"
                    required
                />
                <div className="relative">
                    <Input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password (min 8 characters)"
                        autoComplete="new-password"
                        required
                        minLength={8}
                        className="pr-20"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#525252] hover:text-[#171717] transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        aria-pressed={showPassword}
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>
            </div>

            {error ? <p className="text-sm text-[#EF4444]">{error}</p> : null}

            <button className="skeuo-button w-full justify-center gap-2" disabled={loading}>
                {loading ? (
                    <>
                        <Spinner className="h-4 w-4 animate-spin" />
                        Creating account...
                    </>
                ) : (
                    "Create account"
                )}
            </button>

            <p className="text-sm text-[#A3A3A3] text-center">
                Already have an account?{" "}
                <Link href={loginHref} className="text-[#171717] font-medium hover:text-[#525252] transition-colors">
                    Sign in
                </Link>
            </p>
        </form>
    );
}
