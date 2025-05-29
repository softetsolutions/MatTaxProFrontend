import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import Header from "../components/Header";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirm: false,
  });

  const handleTogglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!password || !confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!token) {
      setError("Invalid or missing token.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/auth/reset-password?token=${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );
      if (response.status !== 200) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error resetting password");
      }
      toast.success("Password reset successful! Please log in.");
      navigate("/login");
    } catch (e) {
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
                <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
                <p className="text-gray-400">Enter your new password below.</p>
              </div>
              {error && (
                <div className="mb-4 p-3 bg-red-900/30 text-red-400 text-sm rounded-lg border border-red-800 text-center">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.password ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent pr-12"
                      placeholder="Enter new password"
                      required
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => handleTogglePassword("password")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-500 transition-colors"
                      aria-label={
                        showPassword.password
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword.password ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="confirm"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      id="confirm"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent pr-12"
                      placeholder="Confirm new password"
                      required
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => handleTogglePassword("confirm")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-500 transition-colors"
                      aria-label={
                        showPassword.confirm ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword.confirm ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 font-medium rounded-lg transition ${
                    isLoading
                      ? "bg-yellow-600 cursor-not-allowed"
                      : "bg-yellow-500 hover:bg-yellow-400 text-black"
                  }`}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
              <div className="mt-8 text-center text-sm text-gray-400">
                Remembered your password?{" "}
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
