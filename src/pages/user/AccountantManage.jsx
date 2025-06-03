import { useState, useEffect } from "react";
import { ArrowUpDown, UserCheck, Info, Clock, Search } from "lucide-react";
import { toast } from "react-toastify";
import { handleUnauthoriz } from "../../utils/helperFunction";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../components/ConfirmationModal";
import {
  requestAuthorization,
  removeAuthorization,
  fetchAuthorizationStatus,
  fetchAccountants,
  searchAccountantByEmail,
} from "../../utils/authorizedUsers";
import { searchAccountants } from "../../utils/searchUtils";

export default function AccountantPage() {
  const [accountants, setAccountants] = useState([]);
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [selectedAccountant, setSelectedAccountant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [accountantToDeauthorize, setAccountantToDeauthorize] = useState(null);
  const [accountantToAuthorize, setAccountantToAuthorize] = useState(null);
  const [isAuthorizeModal, setIsAuthorizeModal] = useState(false);
  const [searchType,] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAccountants, setFilteredAccountants] = useState([]);
  const [emailSearchLoading, setEmailSearchLoading] = useState(false);
  const [searchedAccountant,] = useState(null);
  const [emailSearchedAccountant, setEmailSearchedAccountant] = useState(null);
  const [loadingAccountantId, setLoadingAccountantId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadAccountants = async () => {
      try {
        const data = await fetchAccountants();

        // Transform the data to match our component's structure
        const transformedData = data.map((accountant) => ({
          id: accountant.id,
          accountantId: `ACC${String(accountant.id).padStart(3, "0")}`,
          name: `${accountant.fname} ${accountant.lname}`,
          email: accountant.email,
          address: accountant.address || "N/A",
          status:
            accountant.is_authorized === "approved"
              ? "authorized"
              : accountant.is_authorized === "pending"
              ? "pending"
              : accountant.is_authorized === "rejected"
              ? "rejected"
              : "unauthorized",
          createdAt: new Date(accountant.created_at).toLocaleDateString(),
        }));
        setAccountants(transformedData);
        setLoading(false);
      } catch (err) {
        console.error("API Error:", err);
        setError(
          err.message || "Failed to fetch accountants. Please try again later."
        );
        setLoading(false);
        if (err.message.includes("Unauthorized")) {
          handleUnauthoriz(navigate);
        }
      }
    };

    loadAccountants();
  }, [navigate]);

  useEffect(() => {
    if (searchType === "name") {
      setFilteredAccountants(searchAccountants(accountants, searchTerm));
    }
  }, [searchTerm, accountants, searchType]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleAuthorize = (accountant) => {
    if (loadingAccountantId) return; // Prevent multiple clicks
    const isCurrentlyAuthorized = accountant.status === "authorized";
    const isPending = accountant.status === "pending";

    if (isPending) {
      toast.info("Authorization request is already pending");
      return;
    }

    if (isCurrentlyAuthorized) {
      // If already authorized, show deauthorization confirmation
      setAccountantToDeauthorize(accountant);
      setShowConfirmationModal(true);
    } else {
      // If not authorized, show authorization confirmation
      setAccountantToAuthorize(accountant);
      setIsAuthorizeModal(true);
    }
  };

  const handleConfirmAuthorize = async () => {
    if (loadingAccountantId) return; // Prevent multiple clicks
    try {
      setLoadingAccountantId(accountantToAuthorize.id);
      await requestAuthorization(accountantToAuthorize.id);
      setAccountants(
        accountants.map((accountant) =>
          accountant.id === accountantToAuthorize.id
            ? { ...accountant, status: "pending" }
            : accountant
        )
      );
      toast.success(
        "Authorization request sent. Waiting for accountant approval."
      );
      setIsAuthorizeModal(false);
      setAccountantToAuthorize(null);
    } catch (err) {
      console.error("Authorization failed:", err);
      toast.error(
        err.message || "Failed to update authorization. Please try again."
      );
    } finally {
      setLoadingAccountantId(null);
    }
  };

  const handleDeauthorize = async () => {
    if (loadingAccountantId) return; // Prevent multiple clicks
    try {
      setLoadingAccountantId(accountantToDeauthorize.id);
      await removeAuthorization(accountantToDeauthorize.id);
      setAccountants(
        accountants.map((accountant) =>
          accountant.id === accountantToDeauthorize.id
            ? { ...accountant, status: "unauthorized" }
            : accountant
        )
      );
      toast.success("Successfully removed authorization");
      setShowConfirmationModal(false);
      setAccountantToDeauthorize(null);
    } catch (err) {
      console.error("Deauthorization failed:", err);
      toast.error(
        err.message || "Failed to remove authorization. Please try again."
      );
    } finally {
      setLoadingAccountantId(null);
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const data = await fetchAuthorizationStatus();
        const transformedData = data.map((accountant) => ({
          id: accountant.id,
          accountantId: `ACC${String(accountant.id).padStart(3, "0")}`,
          name: `${accountant.fname} ${accountant.lname}`,
          email: accountant.email,
          address: accountant.address || "N/A",
          status:
            accountant.is_authorized === "approved"
              ? "authorized"
              : accountant.is_authorized === "pending"
              ? "pending"
              : accountant.is_authorized === "rejected"
              ? "rejected"
              : "unauthorized",
          createdAt: new Date(accountant.created_at).toLocaleDateString(),
        }));

        setAccountants(transformedData);
      } catch (err) {
        console.error("Failed to fetch authorization status:", err);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleUnifiedSearch = async (e) => {
    if (e) e.preventDefault();
    if (loadingAccountantId) return;
    if (!searchTerm.trim()) {
      toast.warning("Please enter an email address");
      return;
    }
    setEmailSearchLoading(true);
    try {
      const accountant = await searchAccountantByEmail(searchTerm);
      if (accountant) {
        // Check if accountant already exists in the list
        const existing = accountants.find(a => a.id === accountant.id);
        const accountantData = {
          id: accountant.id,
          accountantId: `ACC${String(accountant.id).padStart(3, "0")}`,
          name: `${accountant.fname} ${accountant.lname}`,
          email: accountant.email,
          address: accountant.address_line1 || "N/A",
          status: existing ? existing.status : "unauthorized",
        };
        setEmailSearchedAccountant(accountantData);
      } else {
        toast.info("No accountant found with this email");
        setEmailSearchedAccountant(null);
      }
    } catch (err) {
      console.error("Search failed:", err);
      toast.error(err.message || "Failed to search accountant");
      setEmailSearchedAccountant(null);
    } finally {
      setEmailSearchLoading(false);
    }
  };

  const renderActionButton = (accountant) => {
    const isPending = accountant.status === "pending";
    const isAuthorized = accountant.status === "authorized";

    if (isPending) {
      return (
        <button
          disabled
          className="p-1 text-yellow-600 rounded cursor-not-allowed"
          title="Request Pending"
        >
          <Clock className="w-4 h-4" />
        </button>
      );
    }

    return (
      <button
        onClick={() => handleAuthorize(accountant)}
        className={`p-1 ${
          isAuthorized
            ? "text-red-600 hover:text-red-800 hover:bg-red-50"
            : "text-green-600 hover:text-green-800 hover:bg-green-50"
        } rounded`}
        title={isAuthorized ? "Revoke Access" : "Request Authorization"}
      >
        <UserCheck className="w-4 h-4 hover:cursor-pointer" />
      </button>
    );
  };
  const getStatusBadge = (status) => {
    switch (status) {
      case "authorized":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Authorized
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case "unauthorized":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
            Unauthorized
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
            Unauthorized
          </span>
        );
    }
  };

  const handleAbout = (accountant) => {
    if (loadingAccountantId) return; 
    setSelectedAccountant(accountant);
    setShowModal(true);
  };

  const closeModal = () => {
    if (loadingAccountantId) return; 
    setShowModal(false);
    setSelectedAccountant(null);
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-white">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 flex flex-col items-center shadow-md">
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
            </svg>
          </div>
          <div className="text-lg font-semibold text-red-600 mb-2">Failed to load Accountants</div>
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
            Accountant Management
          </h1>
          <p className="text-sm text-gray-500">
            View and manage accountant access
          </p>
        </div>
        <form onSubmit={handleUnifiedSearch} className="flex gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name or address..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={emailSearchLoading}
          >
            {emailSearchLoading ? "Searching..." : "Search"}
          </button>
        </form>
      </div>

      {emailSearchedAccountant && (
        <button
          onClick={async () => {
            setEmailSearchedAccountant(null);
            setSearchTerm("");
            setLoading(true);
            try {
              const data = await fetchAccountants();
              const transformedData = data.map((accountant) => ({
                id: accountant.id,
                accountantId: `ACC${String(accountant.id).padStart(3, "0")}`,
                name: `${accountant.fname} ${accountant.lname}`,
                email: accountant.email,
                address: accountant.address || "N/A",
                status:
                  accountant.is_authorized === "approved"
                    ? "authorized"
                    : accountant.is_authorized === "pending"
                    ? "pending"
                    : accountant.is_authorized === "rejected"
                    ? "rejected"
                    : "unauthorized",
                createdAt: new Date(accountant.created_at).toLocaleDateString(),
              }));
              setAccountants(transformedData);
            } catch (err) {
              console.error(err);
            }
            setLoading(false);
          }}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
        >
          <span>Clear Search</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm font-medium text-gray-500 border-b border-gray-200">
                {[
                  { field: "accountantId", label: "Accountant ID" },
                  { field: "name", label: "Name" },
                  { field: "email", label: "Email" },
                  { field: "address", label: "Address" },
                  { field: "status", label: "Status" },
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
              {emailSearchedAccountant ? (
                <tr key={emailSearchedAccountant.id}>
                  <td className="px-4 py-3 text-sm text-gray-900">{emailSearchedAccountant.accountantId}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{emailSearchedAccountant.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{emailSearchedAccountant.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{emailSearchedAccountant.address}</td>
                  <td className="px-4 py-3 text-sm">{getStatusBadge(emailSearchedAccountant.status)}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      {renderActionButton(emailSearchedAccountant)}
                      <button
                        onClick={() => handleAbout(emailSearchedAccountant)}
                        className="p-1 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50"
                        title="About"
                      >
                        <Info className="w-4 h-4 hover:cursor-pointer" />
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAccountants.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                      {searchTerm
                        ? "No matching accountants found"
                        : "No accountants found"}
                    </td>
                  </tr>
                ) : (
                  filteredAccountants.map((accountant) => (
                    <tr
                      key={accountant.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {accountant.accountantId}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {accountant.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {accountant.email}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {accountant.address}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {getStatusBadge(accountant.status)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          {renderActionButton(accountant)}
                          <button
                            onClick={() => handleAbout(accountant)}
                            className="p-1 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50"
                            title="About"
                          >
                            <Info className="w-4 h-4 hover:cursor-pointer" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedAccountant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Accountant Details
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-red-500"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="pb-2">
                <p className="text-sm text-gray-500">Accountant ID</p>
                <p className="font-medium text-black/60">
                  {selectedAccountant.accountantId}
                </p>
              </div>

              <div className="border-b pb-2">
                <p className="text-gray-500">Name</p>
                <p className="font-medium text-black/60">
                  {selectedAccountant.name}
                </p>
              </div>

              <div className="border-b pb-2">
                <p className="text-gray-500">Email</p>
                <p className="font-medium text-black/60">
                  {selectedAccountant.email}
                </p>
              </div>

              <div className="border-b pb-2">
                <p className="text-gray-500">Address</p>
                <p className="font-medium text-black/60">
                  {selectedAccountant.address}
                </p>
              </div>

              <div className="border-b pb-2">
                <p className="text-gray-500">Status</p>
                <p
                  className={`font-medium ${
                    selectedAccountant.status === "authorized"
                      ? "text-green-600"
                      : selectedAccountant.status === "pending"
                      ? "text-yellow-600"
                      : selectedAccountant.status === "rejected"
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {selectedAccountant.status === "authorized"
                    ? "Authorized"
                    : selectedAccountant.status === "pending"
                    ? "Pending"
                    : selectedAccountant.status === "rejected"
                    ? "Rejected"
                    : "Unauthorized"}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={closeModal}
                disabled={loadingAccountantId === selectedAccountant?.id}
                className={`px-4 py-2 text-gray-600 border-2 bg-red-100 border-red-300 rounded hover:bg-red-200 ${
                  loadingAccountantId === selectedAccountant?.id ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Close
              </button>
              {selectedAccountant.status !== "pending" && (
                <button
                  onClick={searchedAccountant ? handleUnifiedSearch : () => handleAuthorize(selectedAccountant)}
                  disabled={loadingAccountantId === selectedAccountant.id}
                  className={`px-4 py-2 text-white rounded ${
                    selectedAccountant.status === "authorized"
                      ? loadingAccountantId === selectedAccountant.id
                        ? "bg-red-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                      : loadingAccountantId === selectedAccountant.id
                      ? "bg-green-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {loadingAccountantId === selectedAccountant.id ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>
                        {selectedAccountant.status === "authorized"
                          ? "Revoking..."
                          : "Requesting..."}
                      </span>
                    </div>
                  ) : (
                    selectedAccountant.status === "authorized"
                      ? "Revoke Access"
                      : "Request Authorization"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showConfirmationModal && accountantToDeauthorize && (
        <ConfirmationModal
          isOpen={showConfirmationModal}
          onClose={() => {
            if (loadingAccountantId !== accountantToDeauthorize.id) {
              setShowConfirmationModal(false);
              setAccountantToDeauthorize(null);
            }
          }}
          onConfirm={handleDeauthorize}
          title="Revoke Access"
          message="Are you sure you want to revoke this accountant's access?"
          confirmText={loadingAccountantId === accountantToDeauthorize.id ? "Revoking..." : "Revoke"}
          confirmButtonClass={
            loadingAccountantId === accountantToDeauthorize.id
              ? "bg-red-400 hover:bg-red-400 focus:ring-red-300"
              : "bg-red-600 hover:bg-red-700 focus:ring-red-300"
          }
          isLoading={loadingAccountantId === accountantToDeauthorize.id}
          closeButtonDisabled={loadingAccountantId === accountantToDeauthorize.id}
        />
      )}

      {isAuthorizeModal && accountantToAuthorize && (
        <ConfirmationModal
          isOpen={isAuthorizeModal}
          onClose={() => {
            if (loadingAccountantId !== accountantToAuthorize.id) {
              setIsAuthorizeModal(false);
              setAccountantToAuthorize(null);
            }
          }}
          onConfirm={handleConfirmAuthorize}
          title="Request Authorization"
          message="Are you sure you want to request authorization for this accountant?"
          confirmText={loadingAccountantId === accountantToAuthorize.id ? "Requesting..." : "Request"}
          confirmButtonClass={
            loadingAccountantId === accountantToAuthorize.id
              ? "bg-green-400 hover:bg-green-400 focus:ring-green-300"
              : "bg-green-600 hover:bg-green-700 focus:ring-green-300"
          }
          isLoading={loadingAccountantId === accountantToAuthorize.id}
          closeButtonDisabled={loadingAccountantId === accountantToAuthorize.id}
        />
      )}
    </div>
  );
}
