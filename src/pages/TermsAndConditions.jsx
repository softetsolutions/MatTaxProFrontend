import { Link } from "react-router-dom";
import Header from "../components/Header";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link
            to="/"
            className="text-yellow-500 hover:text-yellow-400 transition-colors duration-300"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
            <p className="text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-yellow-500 mb-3">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-300 leading-relaxed">
                By accessing and using MatTax Pro, you agree to be bound by
                these Terms and Conditions. If you do not agree to these terms,
                please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-yellow-500 mb-3">
                2. Services Description
              </h2>
              <p className="text-gray-300 leading-relaxed">
                MatTax Pro provides tax management and accounting services,
                including:
              </p>
              <ul className="list-disc list-inside text-gray-300 mt-2 space-y-2">
                <li>Tax document management</li>
                <li>Financial record keeping</li>
                <li>Tax compliance assistance</li>
                <li>Professional accounting services</li>
                <li>Financial reporting</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-yellow-500 mb-3">
                3. User Responsibilities
              </h2>
              <p className="text-gray-300 leading-relaxed">
                As a user of MatTax Pro, you agree to:
              </p>
              <ul className="list-disc list-inside text-gray-300 mt-2 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Use the service for lawful purposes only</li>
                <li>Not share your account credentials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-yellow-500 mb-3">
                4. Payment Terms
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Payment terms and conditions:
              </p>
              <ul className="list-disc list-inside text-gray-300 mt-2 space-y-2">
                <li>All fees are due in advance of service</li>
                <li>Payments are non-refundable unless otherwise specified</li>
                <li>We reserve the right to modify our pricing with notice</li>
                <li>Late payments may result in service suspension</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-yellow-500 mb-3">
                5. Limitation of Liability
              </h2>
              <p className="text-gray-300 leading-relaxed">
                MatTax Pro shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages resulting from your
                use of or inability to use the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-yellow-500 mb-3">
                6. Changes to Terms
              </h2>
              <p className="text-gray-300 leading-relaxed">
                We reserve the right to modify these terms at any time. We will
                notify users of any material changes via email or through the
                platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-yellow-500 mb-3">
                7. Contact Information
              </h2>
              <p className="text-gray-300 leading-relaxed">
                For any questions regarding these Terms and Conditions, please
                contact us at:
              </p>
              <p className="text-gray-300 mt-2">
                Email:{" "}
                <a
                  href="mailto:support@mattaxpro.com"
                  className="text-yellow-500 hover:text-yellow-400"
                >
                  support@mattaxpro.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
