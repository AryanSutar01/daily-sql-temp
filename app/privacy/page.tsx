export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen pt-24 pb-20 bg-[#080c16]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>

                <div className="prose prose-invert max-w-none text-[#7b8ca3]">
                    <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

                    <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Introduction</h2>
                    <p>
                        Welcome to DailySQL. We respect your privacy and are committed to protecting your personal data.
                        This privacy policy will inform you as to how we look after your personal data when you visit our website
                        and tell you about your privacy rights.
                    </p>

                    <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. The Data We Collect</h2>
                    <p>
                        We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                        <li><strong>Contact Data</strong> includes email address.</li>
                        <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
                        <li><strong>Usage Data</strong> includes information about how you use our website and products (e.g., questions solved, streaks).</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. How We Use Your Data</h2>
                    <p>
                        We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li>To register you as a new customer.</li>
                        <li>To process and track your daily progress and streaks.</li>
                        <li>To manage our relationship with you.</li>
                        <li>To improve our website, products/services, marketing and customer relationships.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. Contact Us</h2>
                    <p>
                        If you have any questions about this privacy policy or our privacy practices, please contact us at support@dailysql.in.
                    </p>
                </div>
            </div>
        </main>
    );
}
