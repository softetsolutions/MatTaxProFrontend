import { useState, useEffect } from "react"
import { ArrowUpDown, UserCheck, Info } from "lucide-react"

export default function AccountantPage() {
  const [accountants, setAccountants] = useState([]);
  const [sortField, setSortField] = useState("accountantId");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [selectedAccountant, setSelectedAccountant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccountants = async () => {
      try {
        setTimeout(() => {
          setAccountants([
            {
              id: 1,
              accountantId: "ACC001",
              name: "John Smith",
              email: "john.smith@accounting.com",
              isAuthorized: false,
              phone: "+1 (555) 123-4567",
            },
            {
              id: 2,
              accountantId: "ACC002",
              name: "Emily Johnson",
              email: "emily.johnson@accounting.com",
              isAuthorized: true,
              phone: "+1 (555) 234-5678",
            },
            {
              id: 3,
              accountantId: "ACC003",
              name: "Michael Brown",
              email: "michael.brown@accounting.com",
              isAuthorized: false,
              phone: "+1 (555) 345-6789",
            },
            {
              id: 4,
              accountantId: "ACC004",
              name: "Sarah Davis",
              email: "sarah.davis@accounting.com",
              isAuthorized: false,
              phone: "+1 (555) 456-7890",
            },
            {
              id: 5,
              accountantId: "ACC005",
              name: "Robert Wilson",
              email: "robert.wilson@accounting.com",
              isAuthorized: true,
              phone: "+1 (555) 567-8901",
            },
          ]);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Failed to fetch accountants. Please try again later.");
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

  const handleAuthorize = async (id) => {
    try {
      setAccountants(
        accountants.map((accountant) =>
          accountant.id === id ? { ...accountant, isAuthorized: !accountant.isAuthorized } : accountant
        )
      );

      if (selectedAccountant && selectedAccountant.id === id) {
        setSelectedAccountant({
          ...selectedAccountant,
          isAuthorized: !selectedAccountant.isAuthorized,
        });
      }
    } catch (err) {
      console.error("Authorization failed:", err);
      alert("Authorization failed. Please try again.");
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
                  { field: "email", label: "Email" },
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
                    <td className="px-4 py-3 text-sm text-gray-900">{accountant.email}</td>
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
                <p className=" text-gray-500">Email</p>
                <p className="font-medium text-black/60">{selectedAccountant.email}</p>
              </div>

              <div className="border-b pb-2">
                <p className=" text-gray-500">Phone</p>
                <p className="font-medium text-black/60">{selectedAccountant.phone}</p>
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
