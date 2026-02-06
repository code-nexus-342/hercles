import { GlassContainer } from "@/ui/glass";

export default function ShippingPage() {
    return (
        <div className="min-h-screen pt-28 pb-16 px-6">
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-4xl font-semibold text-center">Shipping</h1>
                <GlassContainer intensity="low" className="p-8 space-y-4 text-slate-200/80">
                    <p>
                        Nairobi metro deliveries arrive within 24 hours. Regional deliveries ship within 48 hours with
                        secure, insured handling.
                    </p>
                    <p>
                        Orders above KES 300,000 qualify for complimentary white-glove delivery. Tracking details are shared
                        once your order is dispatched.
                    </p>
                </GlassContainer>
            </div>
        </div>
    );
}
