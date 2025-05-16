import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../components/Header";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.status !== 200) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error processing request");
      }

      toast.success("Password reset instructions sent to your email!");
      navigate("/login");
    } catch (e) {
      console.error("Error:", e.message);
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-lg">
            <div className="h-2 bg-gradient-to-r from-yellow-500 to-orange-500"></div>
            <div className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Forgot Password</h1>
                <p className="text-gray-400">
                  Enter your email address and we'll send you instructions to
                  reset your password
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-900/30 text-red-400 text-sm rounded-lg border border-red-800 text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 font-medium rounded-lg transition ${
                    isLoading
                      ? "bg-yellow-600 cursor-not-allowed"
                      : "bg-yellow-500 hover:bg-yellow-400 text-black"
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send Reset Instructions"
                  )}
                </button>
              </form>

              <div className="mt-8 text-center text-sm text-gray-400">
                Remember your password?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="font-medium text-yellow-400 hover:underline hover:cursor-pointer"
                >
                  Back to login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
