import { GlassContainer } from "@/ui/glass";

export default function WarrantyPage() {
    return (
        <div className="min-h-screen pt-28 pb-16 px-6">
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-4xl font-semibold text-center">Warranty</h1>
                <GlassContainer intensity="low" className="p-8 space-y-4 text-slate-200/80">
                    <p>
                        Every Hercles laptop ships with a standard warranty outlined on the product page. Coverage includes
                        hardware defects and manufacturer faults. Extended protection is available for select devices.
                    </p>
                    <p>
                        For warranty claims, contact support with your serial number and order ID. We will arrange diagnostics
                        and repair or replacement based on the brand policy.
                    </p>
                </GlassContainer>
            </div>
        </div>
    );
}
