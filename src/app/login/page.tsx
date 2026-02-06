import { GlassContainer } from "@/ui/glass";
import { LoginForm } from "./login-form";

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function LoginPage({ searchParams }: { searchParams?: Promise<SearchParams> }) {
    const resolvedSearchParams = (await searchParams) ?? {};
    const callbackUrl = typeof resolvedSearchParams.callbackUrl === "string" ? resolvedSearchParams.callbackUrl : "/";
    const error = typeof resolvedSearchParams.error === "string" ? resolvedSearchParams.error : null;

    return (
        <div className="min-h-screen pt-28 pb-16 px-6">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="text-center space-y-3">
                    <h1 className="text-4xl font-semibold">Welcome back</h1>
                    <p className="text-slate-200/70">
                        Sign in to continue your curated Hercles experience or create a new account.
                    </p>
                </div>

                <GlassContainer intensity="low" className="p-8">
                    {error ? (
                        <p className="mb-4 text-sm text-red-300">
                            {error === "CredentialsSignin" ? "Invalid email or password." : "Unable to sign in."}
                        </p>
                    ) : null}
                    <LoginForm callbackUrl={callbackUrl} />
                </GlassContainer>
            </div>
        </div>
    );
}
