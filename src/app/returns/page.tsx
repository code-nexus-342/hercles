import { GlassContainer } from "@/ui/glass";

export default function ReturnsPage() {
    return (
        <div className="min-h-screen pt-28 pb-16 px-6">
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-4xl font-semibold text-center">Returns</h1>
                <GlassContainer intensity="low" className="p-8 space-y-4 text-slate-200/80">
                    <p>
                        Returns are accepted within 7–14 days depending on the product. Each listing includes the
                        return policy window. Devices must be in original condition with accessories and packaging.
                    </p>
                    <p>
                        To start a return, contact support with your order ID. A specialist will schedule pickup or
                        provide a drop-off reference.
                    </p>
                </GlassContainer>
            </div>
        </div>
    );
}
