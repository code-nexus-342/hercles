export default function PrivacyPage() {
    return (
        <div className="min-h-screen pt-32 pb-16 px-6 bg-[#FAFAFA]">
            <div className="max-w-3xl mx-auto">
                <div className="mb-12">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#A3A3A3] mb-3">
                        Legal
                    </p>
                    <h1 className="text-4xl font-semibold text-[#171717] tracking-tight mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-[#A3A3A3] text-sm">
                        Last updated: February 2026
                    </p>
                </div>

                <div className="prose prose-lg max-w-none space-y-8">
                    <section>
                        <h2 className="text-xl font-semibold text-[#171717] mb-4">
                            Information We Collect
                        </h2>
                        <p className="text-[#525252] leading-relaxed">
                            We collect information you provide directly to us, such as when you create an account,
                            make a purchase, request a repair, or contact us for support. This may include your
                            name, email address, phone number, shipping address, and payment information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#171717] mb-4">
                            How We Use Your Information
                        </h2>
                        <p className="text-[#525252] leading-relaxed mb-4">
                            We use the information we collect to:
                        </p>
                        <ul className="space-y-2 text-[#525252]">
                            <li className="flex items-start gap-3">
                                <span className="text-[#A3A3A3]">•</span>
                                Process and fulfill your orders
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#A3A3A3]">•</span>
                                Communicate with you about your orders and repairs
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#A3A3A3]">•</span>
                                Provide customer support
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#A3A3A3]">•</span>
                                Send promotional communications (with your consent)
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#A3A3A3]">•</span>
                                Improve our products and services
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#171717] mb-4">
                            Information Sharing
                        </h2>
                        <p className="text-[#525252] leading-relaxed">
                            We do not sell your personal information. We may share your information with
                            third-party service providers who perform services on our behalf, such as
                            payment processing, shipping, and email delivery. These providers are
                            contractually obligated to protect your information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#171717] mb-4">
                            Data Security
                        </h2>
                        <p className="text-[#525252] leading-relaxed">
                            We implement appropriate technical and organizational measures to protect
                            your personal information against unauthorized access, alteration, disclosure,
                            or destruction. All payment transactions are encrypted using SSL technology.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#171717] mb-4">
                            Your Rights
                        </h2>
                        <p className="text-[#525252] leading-relaxed">
                            You have the right to access, correct, or delete your personal information.
                            You may also opt out of receiving promotional communications at any time.
                            To exercise these rights, please contact us at privacy@hercles.com.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#171717] mb-4">
                            Contact Us
                        </h2>
                        <p className="text-[#525252] leading-relaxed">
                            If you have questions about this Privacy Policy, please contact us at:
                        </p>
                        <div className="mt-4 p-6 bg-white border border-[#E5E5E5] rounded-xl">
                            <p className="text-[#171717] font-medium">Hercles Computers</p>
                            <p className="text-[#525252] text-sm mt-1">privacy@hercles.com</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
