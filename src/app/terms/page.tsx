export default function TermsPage() {
    return (
        <div className="min-h-screen pt-32 pb-16 px-6 bg-[#FAFAFA]">
            <div className="max-w-3xl mx-auto">
                <div className="mb-12">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#A3A3A3] mb-3">
                        Legal
                    </p>
                    <h1 className="text-4xl font-semibold text-[#171717] tracking-tight mb-4">
                        Terms of Service
                    </h1>
                    <p className="text-[#A3A3A3] text-sm">
                        Last updated: February 2026
                    </p>
                </div>

                <div className="prose prose-lg max-w-none space-y-8">
                    <section>
                        <h2 className="text-xl font-semibold text-[#171717] mb-4">
                            Acceptance of Terms
                        </h2>
                        <p className="text-[#525252] leading-relaxed">
                            By accessing or using the Hercles Computers website and services, you agree to be
                            bound by these Terms of Service. If you do not agree to these terms, please do not
                            use our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#171717] mb-4">
                            Products and Services
                        </h2>
                        <p className="text-[#525252] leading-relaxed">
                            All products are subject to availability. We reserve the right to discontinue any
                            product at any time. Prices are subject to change without notice. Product images
                            are for illustration purposes and may differ from actual products.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#171717] mb-4">
                            Orders and Payment
                        </h2>
                        <p className="text-[#525252] leading-relaxed mb-4">
                            When you place an order, you agree to provide accurate and complete information.
                            We reserve the right to refuse or cancel any order for any reason, including:
                        </p>
                        <ul className="space-y-2 text-[#525252]">
                            <li className="flex items-start gap-3">
                                <span className="text-[#A3A3A3]">•</span>
                                Product unavailability
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#A3A3A3]">•</span>
                                Errors in product or pricing information
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#A3A3A3]">•</span>
                                Suspected fraudulent activity
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#171717] mb-4">
                            Repair Services
                        </h2>
                        <p className="text-[#525252] leading-relaxed">
                            Repair services are provided as-is. While we use genuine parts whenever possible,
                            we cannot guarantee that all repairs will restore full functionality. A 90-day
                            warranty is provided on all repair work. Customers are responsible for backing up
                            their data before submitting devices for repair.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#171717] mb-4">
                            Returns and Refunds
                        </h2>
                        <p className="text-[#525252] leading-relaxed">
                            Please refer to our Returns Policy for detailed information on returns and refunds.
                            Generally, products may be returned within 14 days of delivery in their original
                            condition and packaging.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#171717] mb-4">
                            Limitation of Liability
                        </h2>
                        <p className="text-[#525252] leading-relaxed">
                            Hercles Computers shall not be liable for any indirect, incidental, special,
                            consequential, or punitive damages arising from your use of our products or
                            services. Our total liability shall not exceed the amount paid for the product
                            or service in question.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#171717] mb-4">
                            Governing Law
                        </h2>
                        <p className="text-[#525252] leading-relaxed">
                            These Terms shall be governed by and construed in accordance with the laws of Kenya,
                            without regard to its conflict of law provisions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#171717] mb-4">
                            Contact Us
                        </h2>
                        <p className="text-[#525252] leading-relaxed">
                            If you have questions about these Terms of Service, please contact us:
                        </p>
                        <div className="mt-4 p-6 bg-white border border-[#E5E5E5] rounded-xl">
                            <p className="text-[#171717] font-medium">Hercles Computers</p>
                            <p className="text-[#525252] text-sm mt-1">legal@hercles.com</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
