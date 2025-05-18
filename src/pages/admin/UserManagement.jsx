import { useState, useEffect } from "react";
import { ArrowUpDown, Lock, Unlock, Search, } from "lucide-react";
import {
  fetchAllUsers,
  fetchAllAccountants,
  accountLockUnlock,
  // changeUserPassword,
} from "../../utils/user";
import { handleUnauthoriz } from "../../utils/helperFunction";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../components/ConfirmationModal";
import ChangePasswordModal from "../../components/ChangePasswordModal";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

export default function UserManagement({ role }) {
  const [users, setUsers] = useState([]);
  const [sortField, setSortField] = useState(
    role === "user" ? "user_lname" : "accountant_lname"
  );
  const [sortDirection, setSortDirection] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data =
          role === "user" ? await fetchAllUsers() : await fetchAllAccountants();
        setUsers(data);
      } catch (err) {
        setError(err.message || `Failed to fetch ${role}s`);
        console.error("API Error:", err);
        if (err.message.includes("Unauthorized")) {
          handleUnauthoriz(navigate);
        }
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [navigate, role]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleToggleClick = (user) => {
    setSelectedUser(user);
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    if (selectedUser) {
      try {
        const userId =
          role === "user" ? selectedUser.user_id : selectedUser.accountant_id;
        const isLock = selectedUser.locked_status === "locked";

        await accountLockUnlock(userId, !isLock);

        setUsers(
          users.map((user) =>
            (role === "user" ? user.user_id : user.accountant_id) === userId
              ? { ...user, locked_status: isLock ? "unlocked" : "locked" }
              : user
          )
        );
      } catch (err) {
        console.error("Error updating account status:", err);
        if (err.message.includes("Unauthorized")) {
          handleUnauthoriz(navigate);
        }
      }
    }
    setShowConfirmation(false);
    setSelectedUser(null);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setSelectedUser(null);
  };

  const handlePasswordChange = async (newPassword) => {
    if (selectedUser) {
      try {
        const userId =
          role === "user" ? selectedUser.user_id : selectedUser.accountant_id;

        // await changeUserPassword(userId, newPassword);
        toast.success("Password changed successfully");
        setShowPasswordModal(false);
        setSelectedUser(null);
      } catch (err) {
        console.error("Error changing password:", err);
        toast.error(err.message || "Failed to change password");
        if (err.message.includes("Unauthorized")) {
          handleUnauthoriz(navigate);
        }
      }
    }
  };

  const handlePasswordClick = (user) => {
    setSelectedUser(user);
    setShowPasswordModal(true);
  };

  const sortedUsers = [...users]
    .filter((user) => {
      if (!searchTerm) return true;
      const lowerSearchTerm = searchTerm.toLowerCase();
      const fname = role === "user" ? user.user_fname : user.accountant_fname;
      const lname = role === "user" ? user.user_lname : user.accountant_lname;
      return (
        fname?.toLowerCase().includes(lowerSearchTerm) ||
        lname?.toLowerCase().includes(lowerSearchTerm)
      );
    })
    .sort((a, b) => {
      const modifier = sortDirection === "asc" ? 1 : -1;
      const fields =
        role === "user"
          ? ["user_fname", "user_lname", "user_email", "user_phone"]
          : [
              "accountant_fname",
              "accountant_lname",
              "accountant_email",
              "accountant_phone",
            ];

      if (fields.includes(sortField)) {
        return (
          String(a[sortField] || "").localeCompare(String(b[sortField] || "")) *
          modifier
        );
      }
      return 0;
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        {error}
        <button
          onClick={() => window.location.reload()}
          className="ml-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {role === "user" ? "User" : "Accountant"} Management
          </h1>
          <p className="text-sm text-gray-500">View and manage all {role}s</p>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={`Search by name...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-black pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        action={selectedUser?.locked_status === "locked" ? "unlock" : "lock"}
        title={`Confirm ${
          selectedUser?.locked_status === "locked" ? "Unlock" : "Lock"
        } Account`}
        message={
          <span>
            Are you sure you want to{" "}
            {selectedUser?.locked_status === "locked" ? "unlock" : "lock"} the
            account for{" "}
            <span className="font-bold">
              {role === "user"
                ? `${selectedUser?.user_fname} ${selectedUser?.user_lname}`
                : `${selectedUser?.accountant_fname} ${selectedUser?.accountant_lname}`}
            </span>
            ?
          </span>
        }
      />

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setSelectedUser(null);
        }}
        onConfirm={handlePasswordChange}
        user={selectedUser}
      />

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">
            Showing {sortedUsers.length} {role}s
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="max-h-[calc(100vh-274px)] overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm font-medium text-gray-500 border-b border-gray-200">
                  {[
                    { field: "name", label: "Name" },
                    { field: "email", label: "Email" },
                    { field: "phone", label: "Phone Number" },
                    { field: "address", label: "Address" },
                    { field: "actions", label: "Actions" },
                  ].map((header) => (
                    <th
                      key={header.field}
                      className="px-4 py-3 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-1">
                        {header.label}
                        {header.field !== "actions" && (
                          <>
                            <ArrowUpDown
                              className="w-4 h-4 cursor-pointer"
                              onClick={() =>
                                handleSort(
                                  role === "user"
                                    ? `user_${header.field}`
                                    : `accountant_${header.field}`
                                )
                              }
                            />
                            {sortField ===
                              (role === "user"
                                ? `user_${header.field}`
                                : `accountant_${header.field}`) && (
                              <span className="text-xs">
                                ({sortDirection === "asc" ? "↑" : "↓"})
                              </span>
                            )}
                          </>
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
                      No {role}s found
                    </td>
                  </tr>
                ) : (
                  sortedUsers.map((user) => (
                    <tr
                      key={role === "user" ? user.user_id : user.accountant_id}
                      className={`hover:bg-gray-50 transition-colors ${
                        user.locked_status === "locked" ? "bg-gray-50" : ""
                      }`}
                    >
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {role === "user"
                          ? `${user.user_fname} ${user.user_lname}`
                          : `${user.accountant_fname} ${user.accountant_lname}`}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {role === "user"
                          ? user.user_email
                          : user.accountant_email}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {role === "user"
                          ? user.user_phone || ""
                          : user.accountant_phone || ""}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {role === "user"
                          ? user.user_address || ""
                          : user.accountant_address || ""}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePasswordClick(user)}
                            className="inline-flex items-center px-2.5 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors cursor-pointer"
                            title="Change Password"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect
                                x="3"
                                y="11"
                                width="18"
                                height="11"
                                rx="2"
                                ry="2"
                              />
                              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            Change Password
                          </button>
                          <div className="relative group">
                            <button
                              onClick={() => handleToggleClick(user)}
                              className={`relative flex items-center justify-between w-24 h-8 rounded-full transition-all duration-300 cursor-pointer ${
                                user.locked_status === "locked"
                                  ? "bg-red-100/80 hover:bg-red-100"
                                  : "bg-green-100/80 hover:bg-green-100"
                              }`}
                              aria-label={
                                user.locked_status === "locked"
                                  ? `Lock ${role}`
                                  : `Unlock ${role}`
                              }
                            >
                              <div
                                className={`absolute left-1 top-1 w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center ${
                                  user.locked_status === "locked"
                                    ? "translate-x-0 bg-red-500"
                                    : "translate-x-16 bg-green-500"
                                }`}
                              >
                                {user.locked_status === "locked" ? (
                                  <Lock className="w-3 h-3 text-white transition-all duration-300 group-hover:-rotate-3" />
                                ) : (
                                  <Unlock className="w-3 h-3 text-white transition-all duration-300 group-hover:rotate-3" />
                                )}
                              </div>

                              <div className="flex items-center justify-center w-full">
                                <span
                                  className={`text-[10px] font-medium transition-all duration-300 whitespace-nowrap ${
                                    user.locked_status === "locked"
                                      ? "text-red-600 ml-8"
                                      : "text-green-600 mr-8"
                                  }`}
                                >
                                  {user.locked_status === "locked"
                                    ? "Locked"
                                    : "Unlocked"}
                                </span>
                              </div>
                            </button>
                          </div>
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
    </div>
  );
}

UserManagement.propTypes = {
  role: PropTypes.oneOf(["user", "accountant"]).isRequired,
};
