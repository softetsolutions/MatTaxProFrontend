import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { X, Eye, EyeOff, Lock } from "lucide-react";

const ChangePasswordModal = ({ isOpen, onClose, onConfirm }) => {
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  // background scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleTogglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (passwords.newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    onConfirm(passwords.newPassword);
    setPasswords({ newPassword: "", confirmPassword: "" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 min-h-screen w-screen overflow-y-auto">
      <div className="w-full max-w-md bg-gradient-to-br from-white via-slate-50 to-slate-100 p-8 rounded-2xl shadow-2xl border border-gray-200 flex flex-col justify-center items-center max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="flex justify-between items-center mb-4 w-full">
          <div className="flex items-center gap-2">
            <Lock className="w-6 h-6 text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
              Change Password
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors duration-150 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-300 text-xl"
            style={{ lineHeight: 0 }}
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="w-full border-b border-gray-200 mb-6"></div>
        <form onSubmit={handleSubmit} className="space-y-5 w-full">
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword.newPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-black pr-12 bg-white/80 transition-all duration-150 shadow-sm hover:border-blue-300"
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => handleTogglePassword("newPassword")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                aria-label={
                  showPassword.newPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword.newPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPassword.confirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-black pr-12 bg-white/80 transition-all duration-150 shadow-sm hover:border-blue-300"
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => handleTogglePassword("confirmPassword")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                aria-label={
                  showPassword.confirmPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword.confirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm font-medium">{error}</div>
          )}

          <div className="flex justify-end gap-2 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ChangePasswordModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default ChangePasswordModal;
