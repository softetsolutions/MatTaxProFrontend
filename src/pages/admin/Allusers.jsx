import { useState, useEffect } from "react";
import { ArrowUpDown, UserCheck, Info, Clock } from "lucide-react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { handleUnauthoriz } from "../../utils/helperFunction";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../components/ConfirmationModal";

export default function AllUsers() {
  const [users, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const decoded = jwtDecode(token);
        console.log(decoded);
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/user/user-details`,
          {
            method: "GET",
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (response.status !== 200) {
          const errorData = await response.json();
          if (response.status === 401) {
            handleUnauthoriz(navigate);
          }
          throw new Error(errorData.error || "Failed to fetch accountants");
        }

        const data = await response.json();

        console.log("all user data is", data);

        setAllUsers(data)
        setLoading(false);
      } catch (err) {
        console.error("API Error:", err);
        setError(
          err.message || "Failed to fetch accountants. Please try again later."
        );
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, []);





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
            All Users
          </h1>
          <p className="text-sm text-gray-500">
            View and manage user acess
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm font-medium text-gray-500 border-b border-gray-200">
                {[
                  { field: "userId", label: "user ID" },
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
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.user_id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {user.user_id
                      }
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {user.user_fname +  user.user_lname}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {user.user_email}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {user.user_address}
                    </td>
                   
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAbout(user)}
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
    </div>
  );
}
