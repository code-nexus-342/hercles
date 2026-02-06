"use client";

import { useActionState, useMemo, useState } from "react";
import type { PlaceOrderState } from "@/app/actions/cart";
import { formatCurrency } from "@/lib/pricing";
import { Card } from "@/ui/glass";

export type CheckoutItem = {
    id: string;
    slug: string;
    title: string;
    quantity: number;
    unitPrice: number;
};

const initialState: PlaceOrderState = {};

export function CheckoutClient({
    action,
    items,
    subtotal,
    defaultEmail,
    freeShippingThreshold,
    standardShippingFee,
    expressShippingFee,
}: {
    action: (prevState: PlaceOrderState | void, formData: FormData) => Promise<PlaceOrderState | void>;
    items: CheckoutItem[];
    subtotal: number;
    defaultEmail: string;
    freeShippingThreshold: number;
    standardShippingFee: number;
    expressShippingFee: number;
}) {
    const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
    const [state, formAction, isPending] = useActionState(action, initialState);
    const safeState = state ?? initialState;

    const shipping = useMemo(() => {
        if (shippingMethod === "express") return expressShippingFee;
        return subtotal >= freeShippingThreshold ? 0 : standardShippingFee;
    }, [expressShippingFee, freeShippingThreshold, standardShippingFee, shippingMethod, subtotal]);

    const total = subtotal + shipping;

    return (
        <div className="min-h-screen pt-20 pb-24 px-4 sm:px-6 bg-[#FAFAFA]">
            <div className="max-w-5xl mx-auto grid lg:grid-cols-[1.5fr,1fr] gap-8">
                {/* Checkout Form */}
            <Card className="p-6 sm:p-8" hover={false}>
                    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl font-semibold text-[#171717]">Checkout</h1>
                            <p className="text-sm text-[#525252] mt-1">
                                Fast delivery in Kenya. A Hercles specialist confirms orders within 24 hours.
                            </p>
                        </div>
                        <div className="text-xs font-medium uppercase tracking-[0.15em] text-[#A3A3A3]">
                            Secure checkout
                        </div>
                    </div>

                    {safeState.formError ? (
                        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {safeState.formError}
                        </div>
                    ) : null}

                    <form className="space-y-8" action={formAction}>
                        <input type="hidden" name="shippingMethod" value={shippingMethod} />

                        {/* Contact Section */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E5]">
                                <h2 className="text-lg font-semibold text-[#171717]">Contact</h2>
                                <span className="text-xs font-medium text-[#A3A3A3]">Step 1</span>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <Field
                                    name="fullName"
                                    label="Full name"
                                    placeholder="Jane Wanjiku"
                                    error={safeState.fieldErrors?.fullName}
                                    autoComplete="name"
                                    required
                                />
                                <Field
                                    name="email"
                                    label="Email"
                                    placeholder="jane@example.com"
                                    defaultValue={defaultEmail}
                                    error={safeState.fieldErrors?.email}
                                    autoComplete="email"
                                    inputMode="email"
                                    required
                                />
                            </div>

                            <Field
                                name="phone"
                                label="Phone"
                                placeholder="+254 7XX XXX XXX"
                                error={safeState.fieldErrors?.phone}
                                autoComplete="tel"
                                inputMode="tel"
                                required
                            />
                        </section>

                        {/* Delivery Section */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E5]">
                                <h2 className="text-lg font-semibold text-[#171717]">Delivery</h2>
                                <span className="text-xs font-medium text-[#A3A3A3]">Step 2</span>
                            </div>

                            <Field
                                name="address1"
                                label="Address line 1"
                                placeholder="Apartment / House / Building"
                                error={safeState.fieldErrors?.address1}
                                autoComplete="address-line1"
                                required
                            />
                            <Field
                                name="address2"
                                label="Address line 2 (optional)"
                                placeholder="Nearest landmark"
                                error={safeState.fieldErrors?.address2}
                                autoComplete="address-line2"
                            />

                            <div className="grid sm:grid-cols-2 gap-4">
                                <Field
                                    name="city"
                                    label="City"
                                    placeholder="Nairobi"
                                    error={safeState.fieldErrors?.city}
                                    autoComplete="address-level2"
                                    required
                                />
                                <Field
                                    name="state"
                                    label="County"
                                    placeholder="Nairobi County"
                                    error={safeState.fieldErrors?.state}
                                    autoComplete="address-level1"
                                />
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <Field
                                    name="country"
                                    label="Country"
                                    placeholder="Kenya"
                                    defaultValue="Kenya"
                                    error={safeState.fieldErrors?.country}
                                    autoComplete="country-name"
                                    required
                                />
                                <Field
                                    name="postalCode"
                                    label="Postal code (optional)"
                                    placeholder="00100"
                                    error={safeState.fieldErrors?.postalCode}
                                    autoComplete="postal-code"
                                    inputMode="numeric"
                                />
                            </div>
                        </section>

                        {/* Shipping Section */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E5]">
                                <h2 className="text-lg font-semibold text-[#171717]">Shipping</h2>
                                <span className="text-xs font-medium text-[#A3A3A3]">Step 3</span>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <ShippingOption
                                    title="Standard"
                                    subtitle={
                                        subtotal >= freeShippingThreshold
                                            ? `Free over ${formatCurrency(freeShippingThreshold)}`
                                            : `Delivered in 2–4 days`
                                    }
                                    price={subtotal >= freeShippingThreshold ? 0 : standardShippingFee}
                                    value="standard"
                                    checked={shippingMethod === "standard"}
                                    onChange={setShippingMethod}
                                />
                                <ShippingOption
                                    title="Express"
                                    subtitle="Delivered in 24–48 hours"
                                    price={expressShippingFee}
                                    value="express"
                                    checked={shippingMethod === "express"}
                                    onChange={setShippingMethod}
                                />
                            </div>
                        </section>

                        <div className="pt-4">
                            <button
                                className="w-full px-6 py-3.5 bg-[#171717] text-white font-medium rounded-lg hover:bg-[#404040] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isPending}
                            >
                                {isPending ? "Placing order…" : "Place order"}
                            </button>
                            <p className="text-xs text-[#A3A3A3] mt-4 text-center">
                                Payments are captured after order confirmation. We&apos;ll email your order details and contact you within 24 hours.
                            </p>
                        </div>
                    </form>
                </Card>

                {/* Order Summary */}
                <div className="lg:sticky lg:top-28 h-fit">
                    <Card className="p-6 space-y-4" hover={false}>
                        <h2 className="text-lg font-semibold text-[#171717]">Order summary</h2>

                        <div className="space-y-3">
                            {items.map((item) => (
                                <div key={item.id} className="flex justify-between gap-4 text-sm">
                                    <span className="truncate text-[#525252]">
                                        {item.title} × {item.quantity}
                                    </span>
                                    <span className="shrink-0 font-medium text-[#171717]">
                                        {formatCurrency(item.unitPrice * item.quantity)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-[#E5E5E5] pt-4 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-[#525252]">Subtotal</span>
                                <span className="text-[#171717]">{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[#525252]">Shipping</span>
                                <span className={shipping === 0 ? "text-green-600" : "text-[#171717]"}>
                                    {shipping === 0 ? "Free" : formatCurrency(shipping)}
                                </span>
                            </div>
                            <div className="h-px bg-[#E5E5E5]" />
                            <div className="flex justify-between text-lg font-semibold">
                                <span className="text-[#171717]">Total</span>
                                <span className="text-[#171717]">{formatCurrency(total)}</span>
                            </div>
                        </div>

                        <div className="pt-4 text-xs text-[#A3A3A3] space-y-1.5 border-t border-[#E5E5E5]">
                            <p>✓ Warranty-backed machines</p>
                            <p>✓ Easy returns within policy window</p>
                            <p>✓ Local support with fast turnaround</p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function Field({
    name,
    label,
    placeholder,
    defaultValue,
    error,
    autoComplete,
    inputMode,
    required,
}: {
    name: string;
    label: string;
    placeholder?: string;
    defaultValue?: string;
    error?: string;
    autoComplete?: string;
    inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
    required?: boolean;
}) {
    return (
        <label className="block">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#171717]">{label}</span>
                {error ? <span className="text-xs text-red-600">{error}</span> : null}
            </div>
            <input
                name={name}
                placeholder={placeholder}
                defaultValue={defaultValue}
                autoComplete={autoComplete}
                inputMode={inputMode}
                required={required}
                className="w-full px-4 py-3 bg-white text-[#171717] border border-[#E5E5E5] rounded-lg transition-all hover:border-[#D4D4D4] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#DBEAFE] placeholder:text-[#A3A3A3]"
            />
        </label>
    );
}

function ShippingOption({
    title,
    subtitle,
    price,
    value,
    checked,
    onChange,
}: {
    title: string;
    subtitle: string;
    price: number;
    value: "standard" | "express";
    checked: boolean;
    onChange: (value: "standard" | "express") => void;
}) {
    return (
        <button
            type="button"
            onClick={() => onChange(value)}
            className={`text-left rounded-xl border p-4 transition-all ${checked
                ? "border-[#2563EB] bg-[#DBEAFE]/30"
                : "border-[#E5E5E5] bg-white hover:border-[#D4D4D4]"
                }`}
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${checked ? "border-[#2563EB]" : "border-[#D4D4D4]"
                            }`}>
                            {checked && <span className="w-2 h-2 rounded-full bg-[#2563EB]" />}
                        </span>
                        <h3 className="font-medium text-[#171717]">{title}</h3>
                    </div>
                    <p className="text-sm text-[#525252] mt-2 ml-6">{subtitle}</p>
                </div>
                <div className="text-sm font-semibold text-[#171717] shrink-0">
                    {price === 0 ? "Free" : formatCurrency(price)}
                </div>
            </div>
        </button>
    );
}
