import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { confirmDeleteAccount } from "../../utils/user";
import { getAuthInfo } from "../../utils/auth";

export default function ConfirmDeleteAccount() {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Invalid or missing confirmation token");
      navigate("/login");
      return;
    }

    if (!feedback.trim()) {
      toast.error("Please provide a valid reason for deleting your account");
      return;
    }

    try {
      setIsSubmitting(true);
      const { token: authToken } = getAuthInfo();
      await confirmDeleteAccount(authToken);
      toast.success("Your account has been permanently deleted");
      navigate("/login");
    } catch (error) {
      console.error("Delete account error:", error);
      toast.error(error.message || "Failed to delete account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = () => {
    if (!feedback.trim()) {
      toast.error("Please provide a valid reason for deleting your account");
      return;
    }
    setShowConfirmation(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-red-900/50 p-4 rounded-full">
              <Trash2 className="h-10 w-10 text-red-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-100 mb-2">
            Confirm Account Deletion
          </h2>
          <p className="text-gray-400">
            Please provide a reason for deleting your account. This helps us improve our service.
          </p>
        </div>

        <div className="bg-gray-800 py-8 px-6 shadow-lg rounded-xl sm:px-10 border border-gray-700">
          <div className="mb-6 p-4 bg-red-900/30 rounded-lg border border-red-800">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-300">
                  Warning: This action cannot be undone
                </h3>
                <div className="mt-2 text-sm text-red-200">
                  <p>
                    Once you confirm the deletion:
                  </p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li className="hover:text-red-100 transition-colors duration-200">Your account will be permanently deleted</li>
                    <li className="hover:text-red-100 transition-colors duration-200">All your data will be removed</li>
                    <li className="hover:text-red-100 transition-colors duration-200">You will be logged out immediately</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="feedback"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Reason for Deletion <span className="text-red-400">*</span>
              </label>
              <textarea
                id="feedback"
                name="feedback"
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-100 placeholder-gray-400 transition-all duration-200"
                placeholder="Please tell us why you're leaving..."
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => navigate("/accounts")}
                className="flex-1 px-3 py-1.5 text-sm border border-gray-600 rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-gray-500 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleDeleteClick}
                className="flex-1 px-3 py-1.5 text-sm border border-transparent rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Deleting Account...
                  </div>
                ) : (
                  "Confirm Delete Account"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-100">Final Confirmation</h3>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="text-gray-400 hover:text-gray-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-gray-300 mb-6">
                Are you absolutely sure you want to delete your account? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-3 py-1.5 text-sm text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-3 py-1.5 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-200"
                >
                  Yes, Delete My Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 