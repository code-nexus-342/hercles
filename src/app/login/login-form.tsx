"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
    const [loginError, setLoginError] = useState<string | null>(null);
    const [registerError, setRegisterError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleLogin(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoginError(null);
        setLoading(true);

        const form = e.currentTarget;
        const email = String(new FormData(form).get("email") ?? "");
        const password = String(new FormData(form).get("password") ?? "");

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
            callbackUrl,
        });

        setLoading(false);

        if (result?.error) {
            setLoginError("Invalid email or password.");
            return;
        }

        if (result?.url) {
            window.location.href = result.url;
        }
    }

    async function handleRegister(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setRegisterError(null);
        setLoading(true);

        const form = e.currentTarget;
        const data = Object.fromEntries(new FormData(form).entries()) as {
            name?: string;
            email?: string;
            password?: string;
        };

        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const payload = await response.json().catch(() => ({}));
            setRegisterError(payload.error ?? "Registration failed.");
            setLoading(false);
            return;
        }

        await signIn("credentials", {
            email: data.email ?? "",
            password: data.password ?? "",
            redirect: true,
            callbackUrl,
        });
    }

    return (
        <div className="grid md:grid-cols-2 gap-8">
            <form onSubmit={handleLogin} className="space-y-4">
                <h2 className="text-xl font-semibold">Sign in</h2>
                <input
                    name="email"
                    type="email"
                    placeholder="Email address"
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2"
                    required
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2"
                    required
                />
                {loginError ? <p className="text-sm text-red-300">{loginError}</p> : null}
                <button className="skeuo-button w-full justify-center" disabled={loading}>
                    {loading ? "Signing in..." : "Sign in"}
                </button>
            </form>

            <form onSubmit={handleRegister} className="space-y-4">
                <h2 className="text-xl font-semibold">Create account</h2>
                <input
                    name="name"
                    type="text"
                    placeholder="Full name"
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2"
                />
                <input
                    name="email"
                    type="email"
                    placeholder="Email address"
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2"
                    required
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password (min 8 characters)"
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2"
                    required
                    minLength={8}
                />
                {registerError ? <p className="text-sm text-red-300">{registerError}</p> : null}
                <button className="skeuo-button w-full justify-center" disabled={loading}>
                    {loading ? "Creating..." : "Create account"}
                </button>
            </form>
        </div>
    );
}
