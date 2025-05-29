import { useState, useEffect } from "react";
import { ArrowUpDown, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchAuthorizedUsers } from "../../utils/authorizedUsers";
import RenderTransactionOrTransactionLog from "./RenderTransactionOrTransactionLog";

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [sortField, setSortField] = useState("lastName");
  const [sortDirection, setSortDirection] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAuthorizedUsers();
        const transformed = data.map(u => ({
          id: u.userid ?? u.id ?? u.userId ?? u._id,
          fname: u.fname ?? u.firstName ?? u.fname ?? "",
          lname: u.lname ?? u.lastName ?? u.lname ?? "",
          email: u.email || "",
          phone: u.phone || ""
        }));
        setUsers(transformed);
      } catch (err) {
        setError(err.message || "Failed to fetch users");
        console.error("API Error:", err);
        if (err.message.includes("Unauthorized")) {
          setTimeout(() => {
            navigate("/user/login");
          }, 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    const modifier = sortDirection === "asc" ? 1 : -1;
    if (
      sortField === "fname" ||
      sortField === "lname" ||
      sortField === "email" ||
      sortField === "phone"
    ) {
      return a[sortField].localeCompare(b[sortField]) * modifier;
    }
    return 0;
  });

  if (selectedUserId) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedUserId(null)}
          className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-md mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Users
        </button>
        <RenderTransactionOrTransactionLog selectedUserId={selectedUserId} />
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500">
            View and manage all system users
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">
            Showing {sortedUsers.length} users
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm font-medium text-gray-500 border-b border-gray-200">
                  {[
                    { field: "fname", label: "First Name" },
                    { field: "lname", label: "Last Name" },
                    { field: "email", label: "Email" },
                    { field: "phone", label: "Phone Number" },
                  ].map((header) => (
                    <th
                      key={header.field}
                      className="px-4 py-3 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-1">
                        {header.label}
                        <ArrowUpDown
                          className="w-4 h-4 cursor-pointer"
                          onClick={() => handleSort(header.field)}
                        />
                        {sortField === header.field && (
                          <span className="text-xs">
                            ({sortDirection === "asc" ? "↑" : "↓"})
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No users have been authorized yet
                    </td>
                  </tr>
                ) : (
                  sortedUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedUserId(user.id)}
                    >
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {user.fname}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {user.lname}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {user.phone}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
