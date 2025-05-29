import { Link } from "react-router-dom";
import { Receipt } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-zinc-900 border-t border-zinc-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 animate-gradient-x"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute -bottom-24 -left-24 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg blur opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <Receipt className="w-8 h-8 text-yellow-400 transform transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 relative z-10" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white group-hover:text-yellow-500 transition-colors duration-300">
                  MatTax Pro
                </h3>
                <p className="text-yellow-500/70 text-sm">
                  Invoice Management Simplified
                </p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Streamlining invoice management for businesses and accountants.
              Making invoice processing and tracking simple and efficient.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-lg relative inline-block group">
              Quick Links
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-300 group-hover:w-full"></span>
            </h4>
            <ul className="space-y-4">
              {["Home", "Login", "Sign Up", "Forgot Password"].map(
                (item, index) => (
                  <li key={index}>
                    <Link
                      to={
                        item === "Home"
                          ? "/"
                          : item === "Sign Up"
                          ? "/signup"
                          : `/${item.toLowerCase().replace(" ", "-")}`
                      }
                      className="text-gray-400 hover:text-yellow-500 text-sm transition duration-300 flex items-center group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-150"></span>
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-lg relative inline-block group">
              Resources
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-300 group-hover:w-full"></span>
            </h4>
            <ul className="space-y-4">
              {["Terms & Conditions", "Privacy Policy"].map((item, index) => (
                <li key={index}>
                  <a
                    href={`/${item
                      .toLowerCase()
                      .replace(" & ", "-")
                      .replace(" ", "-")}`}
                    className="text-gray-400 hover:text-yellow-500 text-sm transition duration-300 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-150"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-lg relative inline-block group">
              Contact Us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-300 group-hover:w-full"></span>
            </h4>
            <ul className="space-y-4">
              <li className="text-gray-400 text-sm flex items-center group">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center mr-3 group-hover:bg-yellow-500/20 transition-colors duration-300">
                  <svg
                    className="w-4 h-4 text-yellow-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <a
                  href="mailto:support@mattaxpro.com"
                  className="group-hover:text-yellow-500 transition-colors duration-300 hover:underline"
                >
                  support@mattaxpro.com
                </a>
              </li>
              <li className="text-gray-400 text-sm flex items-center group">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center mr-3 group-hover:bg-yellow-500/20 transition-colors duration-300">
                  <svg
                    className="w-4 h-4 text-yellow-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <span className="group-hover:text-yellow-500 transition-colors duration-300">
                  +1 (555) 123-4567
                </span>
              </li>
              <li className="text-gray-400 text-sm flex items-center group">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center mr-3 group-hover:bg-yellow-500/20 transition-colors duration-300">
                  <svg
                    className="w-4 h-4 text-yellow-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <span className="group-hover:text-yellow-500 transition-colors duration-300">
                  123 Financial District, NY 10004
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-zinc-800">
          <div className="flex flex-col items-center space-y-3">
            <div className="relative w-24 h-0.5">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500 to-orange-500/0 animate-pulse"></div>
              <div
                className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500 to-yellow-500/0 animate-pulse"
                style={{ animationDelay: "0.5s" }}
              ></div>
            </div>
            <p className="text-gray-300 text-base font-medium hover:text-yellow-500 transition-colors duration-300 cursor-default">
              © {new Date().getFullYear()} MatTax Pro
            </p>
            <p className="text-gray-400 text-sm">All rights reserved</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
