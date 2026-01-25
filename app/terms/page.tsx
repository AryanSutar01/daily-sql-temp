export default function TermsOfService() {
    return (
        <main className="min-h-screen pt-24 pb-20 bg-[#080c16]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>

                <div className="prose prose-invert max-w-none text-[#7b8ca3]">
                    <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

                    <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
                    <p>
                        By accessing and using DailySQL, you accept and agree to be bound by the terms and provision of this agreement.
                        In addition, when using this websites particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                    </p>

                    <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Use License</h2>
                    <p>
                        Permission is granted to temporarily view the materials (information or software) on DailySQL's website for personal,
                        non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li>modify or copy the materials;</li>
                        <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                        <li>attempt to decompile or reverse engineer any software contained on DailySQL's website;</li>
                        <li>remove any copyright or other proprietary notations from the materials; or</li>
                        <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Disclaimer</h2>
                    <p>
                        The materials on DailySQL's website are provided on an 'as is' basis. DailySQL makes no warranties, expressed or implied,
                        and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability,
                        fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                    </p>

                    <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. Limitations</h2>
                    <p>
                        In no event shall DailySQL or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit,
                        or due to business interruption) arising out of the use or inability to use the materials on DailySQL's website.
                    </p>
                </div>
            </div>
        </main>
    );
}
