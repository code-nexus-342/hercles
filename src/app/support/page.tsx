import { GlassContainer } from "@/ui/glass";

export default function SupportPage() {
    return (
        <div className="min-h-screen pt-28 pb-16 px-6 bg-[#FAFAFA]">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="text-center space-y-3">
                    <h1 className="text-4xl font-semibold text-[#171717]">Support</h1>
                    <p className="text-[#525252]">
                        Dedicated technicians, fast response, and clear answers for every Hercles client.
                    </p>
                </div>

                <GlassContainer intensity="low" className="p-8 grid md:grid-cols-2 gap-6 text-[#525252]">
                    <div className="space-y-3">
                        <h2 className="text-xl font-semibold">Concierge care</h2>
                        <p>
                            Reach us 7 days a week. We can help with setup, optimization, and warranty queries.
                        </p>
                        <p className="text-sm text-[#A3A3A3]">support@hercles.com · +254 700 000 000</p>
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-xl font-semibold">Service turnaround</h2>
                        <p>
                            On-site diagnostics within Nairobi. Regional shipping available within 48 hours.
                        </p>
                        <p className="text-sm text-[#A3A3A3]">Response SLA: 4 hours · Repair SLA: 3–5 business days</p>
                    </div>
                </GlassContainer>
            </div>
        </div>
    );
}
