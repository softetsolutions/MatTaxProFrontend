import { useState, useEffect } from "react"
import { ArrowUpDown, UserCheck, Info } from "lucide-react"
import { toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode";

export default function AccountantPage() {
  const [accountants, setAccountants] = useState([]);
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [selectedAccountant, setSelectedAccountant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);

  useEffect(() => {
    const fetchAccountants = async () => {
      try {
        const token = localStorage.getItem("userToken");

        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/accountants`, {
          method: 'GET',
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch accountants');
        }

        const data = await response.json();
        
        const transformedData = data.map(accountant => ({
          id: accountant.id,
          accountantId: `ACC${String(accountant.id).padStart(3, '0')}`,
          name: `${accountant.fname} ${accountant.lname}`,
          isAuthorized: false, 
        }));

        setAccountants(transformedData);
        setLoading(false);
      } catch (err) {
        console.error("API Error:", err);
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
      const isCurrentlyAuthorized = accountant.isAuthorized;

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/accountant/${isCurrentlyAuthorized ? 'remove-auth' : 'auth'}`, {
        method: isCurrentlyAuthorized ? 'DELETE' : 'POST',
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
        throw new Error(data.error || `Failed to ${isCurrentlyAuthorized ? 'remove' : 'add'} authorization`);
      }

      // Update the local state
      setAccountants(
        accountants.map((accountant) =>
          accountant.id === accountantId ? { ...accountant, isAuthorized: !isCurrentlyAuthorized } : accountant
        )
      );  
      if (selectedAccountant && selectedAccountant.id === accountantId) {
        setSelectedAccountant({
          ...selectedAccountant,
          isAuthorized: !isCurrentlyAuthorized,
        });
      }

      toast.success(isCurrentlyAuthorized ? 
        "Successfully removed authorization" : 
        "Successfully authorized accountant"
      );
    } catch (err) {
      console.error("Authorization failed:", err);
      toast.error(err.message || "Failed to update authorization. Please try again.");
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
          <h1 className="text-2xl font-bold text-gray-900">Accountant Management</h1>
          <p className="text-sm text-gray-500">View and manage accountant access</p>
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
                  { field: "status", label: "Status" },
                  { field: "actions", label: "Actions" },
                ].map((header) => (
                  <th key={header.field} className="px-4 py-3 hover:bg-gray-50">
                    <div className="flex items-center gap-1">
                      {header.label}
                      {header.field !== "actions" && header.field !== "status" && (
                        <>
                          <ArrowUpDown className="w-4 h-4 cursor-pointer" onClick={() => handleSort(header.field)} />
                          {sortField === header.field && (
                            <span className="text-xs">(actions{sortDirection === "asc" ? "↑" : "↓"})</span>
                          )}
                        </>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedAccountants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                    No accountants found
                  </td>
                </tr>
              ) : (
                sortedAccountants.map((accountant) => (
                  <tr key={accountant.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900">{accountant.accountantId}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{accountant.name}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          accountant.isAuthorized ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {accountant.isAuthorized ? "Authorized" : "Unauthorized"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAuthorize(accountant.id)}
                          className={`p-1 ${
                            accountant.isAuthorized
                              ? "text-red-600 hover:text-red-800 hover:bg-red-50"
                              : "text-green-600 hover:text-green-800 hover:bg-green-50"
                          } rounded`}
                          title={accountant.isAuthorized ? "Revoke Access" : "Authorize"}
                        >
                          <UserCheck className="w-4 h-4 hover:cursor-pointer" />
                        </button>
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
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-xl border border-gray-200 transition-all animate-in fade-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Accountant Details</h3>
              <button onClick={closeModal} className="text-gray-500 hover:cursor-pointer hover:text-red-500">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="pb-2 text-gray-500">
                <p className="text-sm text-gray-500">Accountant ID</p>
                <p className="font-medium text-black/60">{selectedAccountant.accountantId}</p>
              </div>

              <div className="border-b pb-2">
                <p className=" text-gray-500">Name</p>
                <p className="font-medium text-black/60">{selectedAccountant.name}</p>
              </div>

              <div className="border-b pb-2">
                <p className=" text-gray-500">Status</p>
                <p className={`font-medium ${selectedAccountant.isAuthorized ? "text-green-600" : "text-red-600"}`}>
                  {selectedAccountant.isAuthorized ? "Authorized" : "Unauthorized"}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 border-2 bg-red-100 border-red-300 rounded hover:bg-red-200 transition-colors hover:cursor-pointer hover:text-red-600"
              >
                Close
              </button>
              <button
                onClick={() => handleAuthorize(selectedAccountant.id)}
                className={`px-4 py-2 text-white rounded transition-colors hover:cursor-pointer ${
                  selectedAccountant.isAuthorized ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {selectedAccountant.isAuthorized ? "Revoke Access" : "Authorize Access"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
