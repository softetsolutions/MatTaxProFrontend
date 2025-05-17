import PropTypes from "prop-types";
import { useEffect } from "react";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  action,
  title,
  message,
}) => {
  // Prevent background scroll when modal is open
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 min-h-screen w-screen overflow-y-auto">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            {title || `Confirm ${action}`}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 hover:cursor-pointer"
          >
            ✕
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          {message || `Are you sure you want to ${action}?`}
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 hover:cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded hover:cursor-pointer ${
              action === "unlock"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {action.charAt(0).toUpperCase() + action.slice(1)}
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  action: PropTypes.oneOf(["lock", "unlock"]).isRequired,
  title: PropTypes.string,
  message: PropTypes.node,
};

export default ConfirmationModal;
