import { Link } from "react-router-dom";
import Header from "../components/Header";

export default function PrivacyPolicy() {
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
            <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-gray-400">
              Effective Date: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-yellow-500 mb-3">
                1. Information We Collect
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We collect and process the following types of personal data:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>
                  Contact Information: Name, email address, telephone number and
                  address
                </li>
                <li>
                  Account Information: Username, password, and other credentials
                </li>
                <li>
                  Transaction Data: Details about payments and services
                  purchased
                </li>
                <li>
                  Technical Data: IP address, browser type, operating system
                </li>
                <li>Usage Data: Information about how you use our services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-yellow-500 mb-3">
                2. How We Use Your Information
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We use your personal data for the following purposes:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Service Delivery: To provide and manage your account</li>
                <li>
                  Communication: To contact you regarding your account and
                  services
                </li>
                <li>
                  Improvement: To analyze and improve our software and services
                </li>
                <li>Compliance: To comply with legal obligations</li>
                <li>
                  Marketing: To send updates and promotions (with your consent)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-yellow-500 mb-3">
                3. Legal Basis for Processing
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We process your personal data based on the following legal
                grounds:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>
                  Contractual Necessity: To perform the contract and provide
                  services
                </li>
                <li>Legitimate Interests: To improve our services</li>
                <li>
                  Consent: For marketing communications and sensitive data
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-yellow-500 mb-3">
                4. Data Security
              </h2>
              <p className="text-gray-300 leading-relaxed">
                We implement appropriate technical and organizational measures
                to protect your personal data from unauthorized access, loss, or
                destruction. However, no method of transmission over the
                Internet is 100% secure, and we cannot guarantee absolute
                security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-yellow-500 mb-3">
                5. Your Rights
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Under data protection laws, you have the following rights:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Access: Request access to your personal data</li>
                <li>Rectification: Request correction of inaccurate data</li>
                <li>Erasure: Request deletion of your personal data</li>
                <li>Restriction: Request restriction of processing</li>
                <li>Data Portability: Request transfer of your data</li>
                <li>Objection: Object to processing of your data</li>
                <li>Withdraw Consent: Withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-yellow-500 mb-3">
                6. Changes to This Policy
              </h2>
              <p className="text-gray-300 leading-relaxed">
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new policy on our
                website and updating the "Effective Date" above.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-yellow-500 mb-3">
                7. Contact Us
              </h2>
              <p className="text-gray-300 leading-relaxed">
                If you have any questions about this Privacy Policy or our data
                practices, please contact us at:
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
