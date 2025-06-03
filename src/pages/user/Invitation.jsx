import { useState, useEffect } from "react";
import { ArrowUpDown, Check, X, Info } from "lucide-react";
import { toast } from "react-toastify";
import { useOutletContext } from "react-router-dom";
import {
  fetchInvitations,
  handleApproveInvitation,
  handleRejectInvitation,
  fetchAndUpdatePendingInvitationsCount,
} from "../../utils/invitationHelper";
import ConfirmationModal from "../../components/ConfirmationModal";

export default function InvitationPage() {
  const { setPendingInvitationsCount } = useOutletContext();
  const [invitations, setInvitations] = useState([]);
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [confirmationInvitationId, setConfirmationInvitationId] =
    useState(null);
  const [loadingInvitationId, setLoadingInvitationId] = useState(null);

  useEffect(() => {
    const loadInvitations = async () => {
      try {
        const data = await fetchInvitations();
        setInvitations(data);
        setLoading(false);
      } catch (err) {
        console.error("API Error:", err);
        setError(
          err.message || "Failed to fetch invitations. Please try again later."
        );
        setLoading(false);
      }
    };

    loadInvitations();

    // periodic refresh
    const interval = setInterval(loadInvitations, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleApprove = async (invitationId) => {
    if (loadingInvitationId) return;
    setConfirmationAction("approve");
    setConfirmationInvitationId(invitationId);
    setShowConfirmationModal(true);
  };

  const handleReject = async (invitationId) => {
    if (loadingInvitationId) return;
    setConfirmationAction("reject");
    setConfirmationInvitationId(invitationId);
    setShowConfirmationModal(true);
  };

  const handleConfirmAction = async () => {
    if (loadingInvitationId) return;
    try {
      setLoadingInvitationId(confirmationInvitationId);
      if (confirmationAction === "approve") {
        await handleApproveInvitation(confirmationInvitationId, invitations);
        setInvitations(
          invitations.map((invitation) =>
            invitation.id === confirmationInvitationId
              ? { ...invitation, status: "approved" }
              : invitation
          )
        );
        setPendingInvitationsCount((prev) => Math.max(0, prev - 1));
        toast.success("Invitation approved successfully");
      } else {
        await handleRejectInvitation(confirmationInvitationId, invitations);
        setInvitations(
          invitations.map((invitation) =>
            invitation.id === confirmationInvitationId
              ? { ...invitation, status: "rejected" }
              : invitation
          )
        );
        setPendingInvitationsCount((prev) => Math.max(0, prev - 1));
        toast.success("Invitation rejected successfully");
      }

      fetchAndUpdatePendingInvitationsCount(setPendingInvitationsCount);

      if (
        selectedInvitation &&
        selectedInvitation.id === confirmationInvitationId
      ) {
        setSelectedInvitation({
          ...selectedInvitation,
          status: confirmationAction === "approve" ? "approved" : "rejected",
        });
      }
    } catch (err) {
      console.error(`${confirmationAction} failed:`, err);
      toast.error(
        err.message ||
          `Failed to ${confirmationAction} invitation. Please try again.`
      );
    } finally {
      setShowConfirmationModal(false);
      setConfirmationAction(null);
      setConfirmationInvitationId(null);
      setLoadingInvitationId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Approved
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case "rejected":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  const renderActionButtons = (invitation) => {
    if (invitation.status !== "pending") {
      return (
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              invitation.status === "approved"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {invitation.status === "approved" ? "Approved" : "Rejected"}
          </span>
        </div>
      );
    }

    return (
      <div className="flex gap-2">
        <button
          onClick={() => handleApprove(invitation.id)}
          className="group p-2 text-green-600 hover:text-white hover:bg-green-600 rounded-lg transition-all duration-200"
          title="Approve Invitation"
        >
          <Check className="w-4 h-4" />
          <span className="sr-only">Approve</span>
        </button>
        <button
          onClick={() => handleReject(invitation.id)}
          className="group p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-200"
          title="Reject Invitation"
        >
          <X className="w-4 h-4" />
          <span className="sr-only">Reject</span>
        </button>
        <button
          onClick={() => handleViewDetails(invitation)}
          className="group p-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-all duration-200"
          title="View Details"
        >
          <Info className="w-4 h-4" />
          <span className="sr-only">View Details</span>
        </button>
      </div>
    );
  };

  const handleViewDetails = (invitation) => {
    if (loadingInvitationId) return;
    setSelectedInvitation(invitation);
    setShowModal(true);
  };

  const closeModal = () => {
    if (loadingInvitationId) return;
    setShowModal(false);
    setSelectedInvitation(null);
  };

  const sortedInvitations = [...invitations].sort((a, b) => {
    const modifier = sortDirection === "asc" ? 1 : -1;

    if (sortField === "invitationId") {
      return a.invitationId.localeCompare(b.invitationId) * modifier;
    } else if (sortField === "userId") {
      return a.userId.localeCompare(b.userId) * modifier;
    } else if (sortField === "date") {
      return new Date(a.date) - new Date(b.date) * modifier;
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    toast.error("Failed to load invitations");
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-white">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 flex flex-col items-center shadow-md">
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
            </svg>
          </div>
          <div className="text-lg font-semibold text-red-600 mb-2">Failed to load Invitations</div>
          <div className="text-sm text-red-500 mb-6">Please check your connection or try again later.</div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors shadow"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Invitation Management
          </h1>
          <p className="text-sm text-gray-500">
            View and manage user invitations
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm font-medium text-gray-500 border-b border-gray-200">
                {[
                  { field: "invitationId", label: "Invitation ID" },
                  { field: "userId", label: "User ID" },
                  { field: "status", label: "Status" },
                  { field: "date", label: "Date" },
                  { field: "actions", label: "Actions" },
                ].map((header) => (
                  <th key={header.field} className="px-4 py-3 hover:bg-gray-50">
                    <div className="flex items-center gap-1">
                      {header.label}
                      {header.field !== "actions" &&
                        header.field !== "status" && (
                          <ArrowUpDown
                            className="w-4 h-4 cursor-pointer"
                            onClick={() => handleSort(header.field)}
                          />
                        )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedInvitations.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No invitations found
                  </td>
                </tr>
              ) : (
                sortedInvitations.map((invitation) => (
                  <tr
                    key={invitation.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {invitation.invitationId}
                    </td>
                    <td className="px-4 py-3 text-sm text-blue-600 font-mono">
                      {invitation.userId}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {getStatusBadge(invitation.status)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(invitation.date).toLocaleString()}
                    </td>
                    <td className="py-3 pl-2 pr-4 text-sm">
                      <div className="flex items-center justify-start">
                        {renderActionButtons(invitation)}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* MODAL INFO */}
      {showModal && selectedInvitation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Invitation Details
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-red-500 hover:cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="pb-2">
                <p className="text-sm text-gray-500">Invitation ID</p>
                <p className="font-medium text-black/60">
                  {selectedInvitation.invitationId}
                </p>
              </div>

              <div className="border-b pb-2">
                <p className="text-gray-500">User ID</p>
                <p className="font-medium text-black/60">
                  {selectedInvitation.userId}
                </p>
              </div>

              <div className="border-b pb-2">
                <p className="text-gray-500">Status</p>
                <p
                  className={`font-medium ${
                    selectedInvitation.status === "approved"
                      ? "text-green-600"
                      : selectedInvitation.status === "pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {selectedInvitation.status.charAt(0).toUpperCase() +
                    selectedInvitation.status.slice(1)}
                </p>
              </div>

              <div className="border-b pb-2">
                <p className="text-gray-500">Date</p>
                <p className="font-medium text-black/60">
                  {new Date(selectedInvitation.date).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={closeModal}
                disabled={loadingInvitationId === selectedInvitation?.id}
                className={`px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 hover:cursor-pointer ${
                  loadingInvitationId === selectedInvitation?.id ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Close
              </button>

              {selectedInvitation.status === "pending" && (
                <>
                  <button
                    onClick={() => {
                      handleReject(selectedInvitation.id);
                      closeModal();
                    }}
                    disabled={loadingInvitationId === selectedInvitation.id}
                    className={`px-4 py-2 text-white rounded hover:cursor-pointer ${
                      loadingInvitationId === selectedInvitation.id
                        ? "bg-red-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {loadingInvitationId === selectedInvitation.id ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Rejecting...</span>
                      </div>
                    ) : (
                      "Reject"
                    )}
                  </button>
                  <button
                    onClick={() => {
                      handleApprove(selectedInvitation.id);
                      closeModal();
                    }}
                    disabled={loadingInvitationId === selectedInvitation.id}
                    className={`px-4 py-2 text-white rounded hover:cursor-pointer ${
                      loadingInvitationId === selectedInvitation.id
                        ? "bg-green-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {loadingInvitationId === selectedInvitation.id ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Approving...</span>
                      </div>
                    ) : (
                      "Approve"
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => {
          if (loadingInvitationId !== confirmationInvitationId) {
            setShowConfirmationModal(false);
            setConfirmationAction(null);
            setConfirmationInvitationId(null);
          }
        }}
        onConfirm={handleConfirmAction}
        action={confirmationAction}
        title={
          confirmationAction === "approve"
            ? "Approve Invitation"
            : confirmationAction === "reject"
            ? "Reject Invitation"
            : "Confirm Action"
        }
        message={
          confirmationAction === "approve"
            ? "Are you sure you want to approve this invitation?"
            : confirmationAction === "reject"
            ? "Are you sure you want to reject this invitation?"
            : "Are you sure you want to proceed?"
        }
        confirmText={
          loadingInvitationId === confirmationInvitationId
            ? confirmationAction === "approve"
              ? "Approving..."
              : "Rejecting..."
            : confirmationAction === "approve"
            ? "Approve"
            : confirmationAction === "reject"
            ? "Reject"
            : "Confirm"
        }
        confirmButtonClass={
          loadingInvitationId === confirmationInvitationId
            ? confirmationAction === "approve"
              ? "bg-green-400 hover:bg-green-400 focus:ring-green-300"
              : "bg-red-400 hover:bg-red-400 focus:ring-red-300"
            : confirmationAction === "approve"
            ? "bg-green-600 hover:bg-green-700 focus:ring-green-300"
            : confirmationAction === "reject"
            ? "bg-red-600 hover:bg-red-700 focus:ring-red-300"
            : undefined
        }
        isLoading={loadingInvitationId === confirmationInvitationId}
        closeButtonDisabled={loadingInvitationId === confirmationInvitationId}
      />
    </div>
  );
}
