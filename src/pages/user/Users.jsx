import { useState, useEffect } from "react";
import { ArrowUpDown } from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [sortField, setSortField] = useState("lastName");
  const [sortDirection, setSortDirection] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setTimeout(() => {
          setUsers([
            {
              id: 1,
              firstName: "John",
              lastName: "Smith",
              email: "john.smith@example.com",
              phone: "+1 (555) 123-4567",
              joinDate: "2023-01-15",
              status: "active",
            },
            {
              id: 2,
              firstName: "Emily",
              lastName: "Johnson",
              email: "emily.johnson@accounting.com",
              phone: "+1 (555) 234-5678",
              joinDate: "2023-02-20",
              status: "active",
            },
            {
              id: 3,
              firstName: "Michael",
              lastName: "Brown",
              email: "michael.brown@accounting.com",
              phone: "+1 (555) 345-6789",
              joinDate: "2023-03-10",
              status: "inactive",
            },
            {
              id: 4,
              firstName: "Sarah",
              lastName: "Davis",
              email: "sarah.davis@example.com",
              phone: "+1 (555) 456-7890",
              joinDate: "2023-04-05",
              status: "active",
            },
            {
              id: 5,
              firstName: "Robert",
              lastName: "Wilson",
              email: "robert.wilson@accounting.com",
              phone: "+1 (555) 567-8901",
              joinDate: "2023-05-12",
              status: "active",
            },
            {
              id: 6,
              firstName: "Jennifer",
              lastName: "Taylor",
              email: "jennifer.taylor@example.com",
              phone: "+1 (555) 678-9012",
              joinDate: "2023-06-18",
              status: "active",
            },
            {
              id: 7,
              firstName: "David",
              lastName: "Anderson",
              email: "david.anderson@example.com",
              phone: "+1 (555) 789-0123",
              joinDate: "2023-07-22",
              status: "inactive",
            },
            {
              id: 8,
              firstName: "Lisa",
              lastName: "Martinez",
              email: "lisa.martinez@accounting.com",
              phone: "+1 (555) 890-1234",
              joinDate: "2023-08-30",
              status: "active",
            },
          ]);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Failed to fetch users");
        console.error("API Error:", err);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Sort users
  const sortedUsers = [...users].sort((a, b) => {
    const modifier = sortDirection === "asc" ? 1 : -1;

    if (
      sortField === "firstName" ||
      sortField === "lastName" ||
      sortField === "email" ||
      sortField === "phone"
    ) {
      return a[sortField].localeCompare(b[sortField]) * modifier;
    }
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
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm font-medium text-gray-500 border-b border-gray-200">
                {[
                  { field: "firstName", label: "First Name" },
                  { field: "lastName", label: "Last Name" },
                  { field: "email", label: "Email" },
                  { field: "phone", label: "Phone Number" },
                ].map((header) => (
                  <th key={header.field} className="px-4 py-3 hover:bg-gray-50">
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
                    No users found
                  </td>
                </tr>
              ) : (
                sortedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {user.firstName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {user.lastName}
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
  );
}
