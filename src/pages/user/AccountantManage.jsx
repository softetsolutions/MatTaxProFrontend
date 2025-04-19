import { useState, useEffect } from "react"
import { ArrowUpDown, UserCheck, Info, Clock } from "lucide-react"
import { toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode";
import { handleUnauthoriz } from "../../utils/helperFunction";

export default function AccountantPage() {
  const [accountants, setAccountants] = useState([]);
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [selectedAccountant, setSelectedAccountant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccountants = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const decoded = jwtDecode(token);
        console.log(decoded);
        const userId = decoded.id;

        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/accountants/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (response.status !== 200) {
          const errorData = await response.json();
          if (response.status === 401) {
            handleUnauthoriz(navigate);
          }
          throw new Error(errorData.error || "Failed to fetch accountants");
        }

        const data = await response.json();
        
        // Transform the data to match our component's structure
        const transformedData = data.map(accountant => ({
          id: accountant.id,
          accountantId: `ACC${String(accountant.id).padStart(3, "0")}`,
          name: `${accountant.fname} ${accountant.lname}`,
          email: accountant.email,
          address: accountant.address || 'N/A',
          status: accountant.is_authorized === 'approved' ? 'authorized' : 
                 accountant.is_authorized === 'pending' ? 'pending' : 
                 accountant.is_authorized === 'rejected' ? 'rejected' : 'unauthorized',
          createdAt: new Date(accountant.created_at).toLocaleDateString()
        }));

        setAccountants(transformedData);
        setLoading(false);
      } catch (err) {
        console.error("API Error:", err);
        setError(err.message || "Failed to fetch accountants. Please try again later.");
        setLoading(false);
      }
    };

    fetchAccountants();
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleAuthorize = async (accountantId) => {
    try {
      const token = localStorage.getItem("userToken");
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const accountant = accountants.find(acc => acc.id === accountantId);
      const isCurrentlyAuthorized = accountant.status === 'authorized';

      if (isCurrentlyAuthorized) {
        // Deauthorize - immediate action
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/accountant/remove-auth`, {
          method: 'DELETE',
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            userId: userId,
            accountId: accountantId
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to remove authorization');
        }

        // Update the local state
        setAccountants(
          accountants.map((accountant) =>
            accountant.id === accountantId ? { ...accountant, status: 'unauthorized' } : accountant
          )
        );

        toast.success("Successfully removed authorization");
      } else {
        // Request authorization (pending)
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/accountant/auth`, {
          method: 'POST',
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            userId: userId,
            accountId: accountantId,
            status: 'pending'
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to request authorization');
        }

        // Update the local state to show pending status
        setAccountants(
          accountants.map((accountant) =>
            accountant.id === accountantId ? { ...accountant, status: 'pending' } : accountant
          )
        );

        toast.success("Authorization request sent. Waiting for accountant approval.");
      }

      // Update modal state if needed
      if (selectedAccountant && selectedAccountant.id === accountantId) {
        setSelectedAccountant({
          ...selectedAccountant,
          status: isCurrentlyAuthorized ? 'unauthorized' : 'pending'
        });
      }
    } catch (err) {
      console.error("Authorization failed:", err);
      toast.error(err.message || "Failed to update authorization. Please try again.");
    }
  };

  // Update the fetchAuthorizationStatus function
  const fetchAuthorizationStatus = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/accountants/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch authorization status');
      }

      const data = await response.json();
      
      // Update the accountants state with the latest authorization status
      setAccountants(prevAccountants => 
        prevAccountants.map(accountant => {
          const authData = data.find(auth => auth.accountId === accountant.id);
          if (!authData) {
            return accountant; // Keep the existing status if no data found
          }
          return {
            ...accountant,
            status: authData.status || accountant.status 
          };
        })
      );
    } catch (err) {
      console.error("Failed to fetch authorization status:", err);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchAuthorizationStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const renderActionButton = (accountant) => {
    const isPending = accountant.status === 'pending';
    const isAuthorized = accountant.status === 'authorized';

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
        onClick={() => handleAuthorize(accountant.id)}
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
      case 'authorized':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Authorized</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'unauthorized':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Unauthorized</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Rejected</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Unauthorized</span>;
    }
  };

  const handleAbout = (accountant) => {
    setSelectedAccountant(accountant);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAccountant(null);
  };

  const sortedAccountants = [...accountants].sort((a, b) => {
    const modifier = sortDirection === "asc" ? 1 : -1;

    if (sortField === "accountantId") {
      return a.accountantId.localeCompare(b.accountantId) * modifier;
    } else if (sortField === "name") {
      return a.name.localeCompare(b.name) * modifier;
    } else if (sortField === "email") {
      return a.email.localeCompare(b.email) * modifier;
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
    return (
      <div className="p-6 text-center text-red-500">
        {error}
        <button
          onClick={() => window.location.reload()}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
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
      </div>

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
                      {header.field !== "actions" && header.field !== "status" && (
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
              {sortedAccountants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                    No accountants found
                  </td>
                </tr>
              ) : (
                sortedAccountants.map((accountant) => (
                  <tr key={accountant.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900">{accountant.accountantId}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{accountant.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{accountant.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{accountant.address}</td>
                    <td className="px-4 py-3 text-sm">{getStatusBadge(accountant.status)}</td>
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
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedAccountant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Accountant Details</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-red-500">✕</button>
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
                <p className="font-medium text-black/60">{selectedAccountant.name}</p>
              </div>

              <div className="border-b pb-2">
                <p className="text-gray-500">Email</p>
                <p className="font-medium text-black/60">{selectedAccountant.email}</p>
              </div>

              <div className="border-b pb-2">
                <p className="text-gray-500">Address</p>
                <p className="font-medium text-black/60">{selectedAccountant.address}</p>
              </div>

              <div className="border-b pb-2">
                <p className="text-gray-500">Status</p>
                <p className={`font-medium ${
                  selectedAccountant.status === 'authorized' 
                    ? "text-green-600" 
                    : selectedAccountant.status === 'pending'
                      ? "text-yellow-600"
                      : selectedAccountant.status === 'rejected'
                        ? "text-red-600"
                        : "text-gray-600"
                }`}>
                  {selectedAccountant.status === 'authorized' 
                    ? "Authorized" 
                    : selectedAccountant.status === 'pending'
                      ? "Pending"
                      : selectedAccountant.status === 'rejected'
                        ? "Rejected"
                        : "Unauthorized"}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 border-2 bg-red-100 border-red-300 rounded hover:bg-red-200"
              >
                Close
              </button>
              {selectedAccountant.status !== 'pending' && (
                <button
                  onClick={() => handleAuthorize(selectedAccountant.id)}
                  className={`px-4 py-2 text-white rounded ${
                    selectedAccountant.status === 'authorized' 
                      ? "bg-red-600 hover:bg-red-700" 
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {selectedAccountant.status === 'authorized' ? "Revoke Access" : "Request Authorization"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
