import Link from "next/link";
import { Card } from "@/ui/glass";
import { RegisterForm } from "./register-form";

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function RegisterPage({ searchParams }: { searchParams?: Promise<SearchParams> }) {
    const resolvedSearchParams = (await searchParams) ?? {};
    const callbackUrl = typeof resolvedSearchParams.callbackUrl === "string" ? resolvedSearchParams.callbackUrl : "/";

    return (
        <div className="min-h-screen pt-28 pb-16 px-6">
            <div className="max-w-md mx-auto space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-semibold tracking-tight">Create account</h1>
                    <p className="text-sm text-[#A3A3A3]">One account for orders, returns, and faster checkout.</p>
                </div>

                <Card className="p-8" hover={false}>
                    <RegisterForm callbackUrl={callbackUrl} />

                    <div className="mt-6 pt-6 border-t border-[#E5E5E5]">
                        <p className="text-xs text-[#A3A3A3] text-center">
                            By creating an account, you agree to our{" "}
                            <Link href="/terms" className="text-[#171717] hover:text-[#525252] transition-colors">
                                Terms
                            </Link>
                            {" "}and{" "}
                            <Link href="/privacy" className="text-[#171717] hover:text-[#525252] transition-colors">
                                Privacy Policy
                            </Link>
                            .
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
