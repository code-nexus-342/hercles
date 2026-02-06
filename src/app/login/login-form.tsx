"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
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

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
    const [loginError, setLoginError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function handleLogin(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoginError(null);
        setLoading(true);

        const form = e.currentTarget;
        const email = String(new FormData(form).get("email") ?? "");
        const password = String(new FormData(form).get("password") ?? "");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
                callbackUrl,
            });

            if (result?.error) {
                setLoginError("Invalid email or password.");
                return;
            }

            if (result?.url) {
                window.location.href = result.url;
            }
        } catch {
            setLoginError("Unable to sign in right now. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
                <h2 className="text-xl font-semibold text-[#171717]">Sign in</h2>
                <p className="text-sm text-[#A3A3A3]">Use your email and password.</p>
            </div>

            <div className="space-y-3">
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
                        placeholder="Password"
                        autoComplete="current-password"
                        required
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

            {loginError ? <p className="text-sm text-[#EF4444]">{loginError}</p> : null}

            <button className="skeuo-button w-full justify-center gap-2" disabled={loading}>
                {loading ? (
                    <>
                        <Spinner className="h-4 w-4 animate-spin" />
                        Signing in...
                    </>
                ) : (
                    "Sign in"
                )}
            </button>

            <p className="text-sm text-[#A3A3A3] text-center">
                New here?{" "}
                <Link
                    href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                    className="text-[#171717] font-medium hover:text-[#525252] transition-colors"
                >
                    Create an account
                </Link>
            </p>
        </form>
    );
}
