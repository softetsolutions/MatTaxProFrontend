import PropTypes from "prop-types";
import { useEffect } from "react";
import { X, Lock, Unlock, AlertTriangle, Trash2 } from "lucide-react";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  action,
  title,
  message,
  confirmText,
  cancelText = "Cancel",
  confirmButtonClass,
}) => {
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

  if (!isOpen) return null;
  
  // icons
  let Icon = AlertTriangle;
  let iconColor = "text-yellow-500";
  let buttonClass = "bg-red-600 hover:bg-red-700 focus:ring-red-300";
  
  if (action === "lock") {
    Icon = Lock;
    iconColor = "text-red-500";
  } else if (action === "unlock") {
    Icon = Unlock;
    iconColor = "text-green-600";
    buttonClass = "bg-green-600 hover:bg-green-700 focus:ring-green-300";
  } else if (action === "delete") {
    Icon = Trash2;
    iconColor = "text-red-500";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 min-h-screen w-screen overflow-y-auto">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-xl border border-gray-200">
        <div className="flex justify-between items-center mb-2 w-full">
          <div className="flex items-center gap-2">
            <Icon className={`w-5 h-5 ${iconColor}`} />
            <h3 className="text-[1.35rem] font-bold text-gray-900 tracking-tight">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors duration-150 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-300 text-lg"
            style={{ lineHeight: 0 }}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="w-full border-b border-gray-200 mb-4"></div>
        <p className="text-gray-700 mb-6 text-base font-medium text-center w-full">
          {message}
        </p>
        <div className="flex justify-end gap-2 w-full">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-1.5 text-white rounded-lg font-semibold shadow transition-colors focus:outline-none focus:ring-2 ${confirmButtonClass || buttonClass}`}
          >
            {confirmText || (action ? action.charAt(0).toUpperCase() + action.slice(1) : "Confirm")}
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
  action: PropTypes.oneOf(["lock", "unlock", "delete"]),
  title: PropTypes.string.isRequired,
  message: PropTypes.node.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  confirmButtonClass: PropTypes.string,
};

export default ConfirmationModal;
