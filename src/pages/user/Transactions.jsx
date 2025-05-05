import { useState, useEffect, useRef } from "react";
import {
  ArrowUpDown,
  Edit,
  Trash2,
  ChevronDown,
  X,
  Logs,
  Check,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { handleUnauthoriz } from "../../utils/helperFunction";
import { fetchAuthorizedUsers } from "../../utils/authorizedUsers";
import {
  fetchTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../../utils/transactionsApi";
import { fetchAllVendors, updateVendor } from "../../utils/vendorApi";
import { downloadCSV } from "../../utils/convertAndDownloadCsv";
import UploadCsv from "./UploadCsv";

export default function TransactionsPage({ setIsTransasctionLog }) {
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    type: "moneyIn",
    vendor: "",
    desc3: "",
  });
  const [transactions, setTransactions] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTableList, setRefreshTableList] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [vendorSearch, setVendorSearch] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showVendorDropdown, setShowVendorDropdown] = useState(false);
  const [searchQuery] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [vendorOptions, setVendorOptions] = useState([]);
  const userRef = useRef(null);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingVendorId, setEditingVendorId] = useState(null);
  const [editingVendorName, setEditingVendorName] = useState("");
  const [isUploadModalCsvOpen, setIsUploadModalCsvOpen] = useState(false);

  // dropdown options
  const categoryOptions = [
    "Shopping",
    "Entertainment",
    "Groceries",
    "Utilities",
    "Transport",
    "Other",
  ];
  const categoryRef = useRef(null);
  const vendorRef = useRef(null);

  // Initialize userRole once when component mounts
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const decoded = jwtDecode(token);
    setUserRole(decoded.role);
  }, []);

  // Fetch transaction data when selectedUserId changes
  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("userToken");
        const decoded = jwtDecode(token);
        const userId = decoded.id;

        // For accountants -> fetch vendors if user  selected
        if (userRole === "accountant" && !selectedUserId) {
          setTransactions([]);
          setVendorOptions([]);
          setLoading(false);
          return;
        }

        const data = await Promise.allSettled([
          fetchTransactions(selectedUserId, navigate),
          fetchAllVendors(userRole === "accountant" ? selectedUserId : userId),
        ]);

        const vendors = data[1].value.reduce((acc, vendor) => {
          let vendorData = {
            id: vendor.id,
            name: vendor.name,
          };
          acc.push(vendorData);
          return acc;
        }, []);
        setVendorOptions(vendors);
        setTransactions(data[0].value);
      } catch (err) {
        setError(err.message || "Failed to fetch transactions");
        console.error("API Error:", err);
        if (err.message.includes("Unauthorized")) {
          handleUnauthoriz(navigate);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionData();
  }, [refreshTableList, selectedUserId, navigate]); // Removed userRole from dependencies

  // Handle clicks outside of dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
      if (vendorRef.current && !vendorRef.current.contains(event.target)) {
        setShowVendorDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const isEveryDataPresent = Object.values(formData).reduce((acc, value) => {
      if (acc) {
        acc = Boolean(value);
      }
      return acc;
    }, true);

    if (!isEveryDataPresent) {
      toast.warning("Pls fill all the field");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        // Update existing transaction
        const transactionData = {
          newAmount: formData.amount || null,
          newCategory: formData.category || null,
          newType: formData.type || null,
        };

        await toast.promise(
          updateTransaction(editingId, transactionData, selectedUserId),
          {
            pending: "Updating transaction...",
            success: "Transaction updated successfully 👌",
            error: "Failed to update transaction 🤯",
          }
        );
        setShowModal(false);
        setEditingId(null);
        setRefreshTableList((prev) => !prev);
      } else {
        // Create new transaction
        const token = localStorage.getItem("userToken");
        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const transactionData = {
          amount: parseFloat(formData.amount),
          category: formData.category,
          type: formData.type,
          vendorId: formData.vendor,
          desc3: formData.desc3,
          isdeleted: false,
          userid: userRole === "accountant" ? selectedUserId : userId,
        };

        if (files.length > 0) {
          const formDataObj = new FormData();
          Object.entries(transactionData).forEach(([key, value]) => {
            formDataObj.append(key, value);
          });
          files.forEach((file) => {
            formDataObj.append("file", file);
          });

          await toast.promise(createTransaction(formDataObj, selectedUserId), {
            pending: "Creating transaction with receipts...",
            success: "Transaction created successfully 👌",
            error: "Failed to create transaction 🤯",
          });
        } else {
          await toast.promise(
            createTransaction(transactionData, selectedUserId),
            {
              pending: "Creating transaction...",
              success: "Transaction created successfully 👌",
              error: "Failed to create transaction 🤯",
            }
          );
        }

        setFormData({
          amount: "",
          category: "",
          type: "moneyIn",
          vendor: "",
          desc3: "",
        });
        setFiles([]);
        setVendorSearch("");
      }
    } catch (err) {
      console.error("Operation failed:", err);
      toast.error(err.message || "Operation failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      amount: "",
      category: "",
      type: "moneyIn",
      vendor: "",
      desc3: "",
    });
    setFiles([]);
    setRefreshTableList((prev) => !prev);
  };

  // Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Add event listener for Enter key
  useEffect(() => {
    if (showModal) {
      document.addEventListener("keydown", handleKeyPress);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [showModal, formData, editingId]);

  const handleEdit = (id) => {
    const transactionToEdit = transactions.find((txn) => txn.id === id);
    if (transactionToEdit) {
      setFormData({
        amount: transactionToEdit.amount.replace("$", ""),
        category: transactionToEdit.category,
        type: transactionToEdit.type,
        vendorId: transactionToEdit.vendorid,
      });
      setEditingId(id);
      setShowModal(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      await toast.promise(deleteTransaction(id, selectedUserId), {
        pending: "Deleting Transaction",
        success: "Successfully Deleted Transaction 👌",
        error: "Got Error Deleting transaction, Try again 🤯",
      });
      setRefreshTableList((prev) => !prev);
    } catch (e) {
      console.error(e);
    }
  };

  // Filter functions dropdowns
  const filteredCategories = categoryOptions.filter((category) =>
    category.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const filteredVendors = vendorOptions.filter((vendor) =>
    vendor.name.toLowerCase().includes(vendorSearch.toLowerCase())
  );

  const handleSelect = (type, value) => {
    if (type === "vendor") {
      setFormData((prev) => ({
        ...prev,
        vendor: value.id,
      }));
      setVendorSearch(value.name);
      setShowVendorDropdown(false);
    } else {
      setFormData((prev) => ({
        ...prev,
        [type]: value,
      }));

      if (type === "category") {
        setShowCategoryDropdown(false);
      } else {
        setShowVendorDropdown(false);
      }
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    const modifier = sortDirection === "asc" ? 1 : -1;

    if (sortField === "amount") {
      const amountA = Number.parseFloat(a.amount.replace("$", ""));
      const amountB = Number.parseFloat(b.amount.replace("$", ""));
      return (amountA - amountB) * modifier;
    }
    return String(a[sortField]).localeCompare(String(b[sortField])) * modifier;
  });

  const filteredTransactions = sortedTransactions.filter((transaction) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      transaction.category?.toLowerCase().includes(query) ||
      transaction.type?.toLowerCase().includes(query) ||
      transaction.vendorid?.toLowerCase().includes(query) ||
      transaction.amount?.toLowerCase().includes(query) ||
      transaction.created_at?.toLowerCase().includes(query)
    );
  });

  // Filter users based on search
  const filteredUsers = users.filter((user) =>
    `${user.fname} ${user.lname}`
      .toLowerCase()
      .includes(userSearch.toLowerCase())
  );

  // to get authorized users
  const fetchAuthorizedUsersList = async () => {
    try {
      const data = await fetchAuthorizedUsers();
      // Transform the data to match the expected format
      const transformedUsers = data.map((user) => ({
        id: user.userid,
        fname: user.fname,
        lname: user.lname,
      }));
      setUsers(transformedUsers);
    } catch (err) {
      console.error("Error fetching authorized users:", err);
      toast.error(err.message || "Failed to fetch authorized users");
    }
  };

  useEffect(() => {
    if (userRole === "accountant") {
      fetchAuthorizedUsersList();
    }
  }, [userRole]);

  const handleVendorNameUpdate = async (vendorId, newName, e) => {
    if (e) e.preventDefault(); // Prevent form submission
    try {
      await updateVendor(vendorId, newName);
      setVendorOptions((prev) =>
        prev.map((vendor) =>
          vendor.id === vendorId ? { ...vendor, name: newName } : vendor
        )
      );
      setEditingVendorId(null);
      setEditingVendorName("");
      toast.success("Vendor updated successfully");
    } catch (err) {
      console.error("Error updating vendor:", err);
      toast.error(err.message || "Failed to update vendor");
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-sm text-gray-500">
            View and manage your transactions
          </p>
        </div>
        <div className="flex items-center gap-4">
          {userRole === "accountant" && (
            <div className="relative" ref={userRef}>
              <div
                className="flex items-center w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black cursor-pointer"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              >
                <span className="flex-grow">
                  {selectedUserId
                    ? users.find((u) => u.id === selectedUserId)?.fname +
                      " " +
                      users.find((u) => u.id === selectedUserId)?.lname
                    : "Select a user"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>

              {showUserDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
                  <div className="p-2 border-b">
                    <div className="flex items-center border rounded bg-gray-50 text-black">
                      <input
                        type="text"
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="w-full p-2 bg-transparent focus:outline-none text-sm"
                        placeholder="Search users..."
                        autoFocus
                      />
                      {userSearch && (
                        <button
                          onClick={() => setUserSearch("")}
                          className="mr-2"
                        >
                          <X className="w-4 h-4 text-gray-400" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          onClick={() => {
                            setSelectedUserId(user.id);
                            setShowUserDropdown(false);
                            setUserSearch("");
                          }}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-black"
                        >
                          {user.fname} {user.lname}
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-gray-500 text-center">
                        No users found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {userRole !== "accountant" ||
          (userRole === "accountant" && selectedUserId) ? (
            <>
              <button
                onClick={() => {
                  setEditingId(null);
                  setShowModal(true);
                }}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors hover:cursor-pointer"
              >
                Add Transaction
              </button>

              <button
                onClick={() => {
                  setIsUploadModalCsvOpen(true);
                }}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors hover:cursor-pointer"
              >
                Add Transaction(via Csv)
              </button>

              <button
                onClick={() => {
                  downloadCSV(transactions);
                }}
                disabled={transactions.length === 0}
                className={`inline-flex items-center px-4 py-2 ${
                  transactions.length === 0
                    ? `bg-blue-200`
                    : `bg-blue-600 hover:bg-blue-700`
                } text-white text-sm font-medium rounded-md transition-colors hover:cursor-pointer`}
              >
                Export Trasnsaction
              </button>
            </>
          ) : null}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        {userRole === "accountant" && !selectedUserId ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              Please select a user to view their transactions
            </div>
            <div className="text-gray-400 text-sm">
              Click on the user dropdown above to select a user
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm font-medium text-gray-500 border-b border-gray-200">
                    {[
                      { field: "created_at", label: "Date" },
                      { field: "Desc3", label: "Transaction Detail" },
                      { field: "Desc2", label: "SortCode" },
                      { field: "Desc1", label: "Account" },
                      { field: "amount", label: "Amount" },
                      { field: "category", label: "Category" },
                      { field: "type", label: "Type" },
                      { field: "vendorname", label: "Vendor Name" },
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
                                onClick={() => handleSort(header.field)}
                              />
                              {sortField === header.field && (
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
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-6 text-center text-gray-500"
                      >
                        {searchQuery
                          ? "No matching transactions found"
                          : "No transactions found"}
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((txn) => (
                      <tr
                        key={txn.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {txn.created_at}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {txn.desc3 ?? " - "}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {txn.desc2 ?? " - "}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {txn.desc1 ?? " - "}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {txn.amount}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {txn.category}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 capitalize">
                          {txn.type}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {txn.vendorname}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setIsTransasctionLog(txn.id)}
                              className="p-1 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50"
                              title="Log"
                            >
                              <Logs className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(txn.id)}
                              className="p-1 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(txn.id)}
                              className="p-1 text-red-600 hover:text-red-800 rounded hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
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
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-xl border border-gray-200 transition-all animate-in fade-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingId ? "Edit Transaction" : "Add Transaction"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:cursor-pointer hover:text-red-500"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col md:flex-row gap-6"
            >
              <div className="flex-1">
                {/* <h4 className="font-medium text-gray-700 mb-3">
                  Transaction Details
                </h4> */}

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="amount"
                  >
                    Transaction Details
                  </label>
                  <input
                    type="text"
                    id="desc3"
                    name="desc3"
                    value={formData.desc3}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Enter Detail"
                    required
                    step="0.01"
                    min="0"
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="amount"
                  >
                    Amount
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Enter amount"
                    required
                    step="0.01"
                    min="0"
                  />
                </div>

                <div className="mb-4" ref={categoryRef}>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="category"
                  >
                    Category
                  </label>
                  <div className="relative">
                    <div
                      className="flex items-center w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white"
                      onClick={() =>
                        setShowCategoryDropdown(!showCategoryDropdown)
                      }
                    >
                      <span className="flex-grow text-gray-700">
                        {formData.category || "Select a category"}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>

                    {showCategoryDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
                        <div className="p-2 border-b">
                          <div className="flex items-center border rounded bg-gray-50 text-black">
                            <input
                              type="text"
                              value={categorySearch}
                              onChange={(e) =>
                                setCategorySearch(e.target.value)
                              }
                              className="w-full p-2 bg-transparent focus:outline-none text-sm"
                              placeholder="Search categories..."
                              autoFocus
                            />
                            {categorySearch && (
                              <button
                                onClick={() => setCategorySearch("")}
                                className="mr-2"
                              >
                                <X className="w-4 h-4 text-gray-400" />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {filteredCategories.length > 0 ? (
                            filteredCategories.map((category) => (
                              <div
                                key={category}
                                onClick={() =>
                                  handleSelect("category", category)
                                }
                                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-black"
                              >
                                {category}
                              </div>
                            ))
                          ) : (
                            <div className="p-2 text-gray-500 text-center">
                              No results found
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-4" ref={vendorRef}>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Vendor
                  </label>
                  <div className="relative">
                    <div
                      className="flex items-center w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white"
                      onClick={() => setShowVendorDropdown(true)}
                    >
                      <input
                        type="text"
                        value={vendorSearch}
                        onChange={(e) => {
                          setVendorSearch(e.target.value);
                          setShowVendorDropdown(true);
                          if (
                            !filteredVendors.some(
                              (v) =>
                                v.name.toLowerCase() ===
                                e.target.value.toLowerCase()
                            )
                          ) {
                            setFormData((prev) => ({
                              ...prev,
                              vendor: e.target.value,
                            }));
                          }
                        }}
                        className="w-full bg-transparent focus:outline-none text-sm text-black"
                        placeholder="Search or type vendor name"
                        autoComplete="off"
                      />
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>

                    {showVendorDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg">
                        <div className="p-2 border-b">
                          {/* <div className="flex items-center border rounded bg-gray-50">
                            <input
                              type="text"
                              value={vendorSearch}
                              onChange={(e) => {
                                setVendorSearch(e.target.value);
                                if (
                                  !filteredVendors.some(
                                    (v) =>
                                      v.name.toLowerCase() ===
                                      e.target.value.toLowerCase()
                                  )
                                ) {
                                  setFormData((prev) => ({
                                    ...prev,
                                    vendor: e.target.value,
                                  }));
                                }
                              }}
                              onChange={(e) => {
                                setVendorSearch(e.target.value);
                                if (
                                  !filteredVendors.some(
                                    (v) =>
                                      v.name.toLowerCase() ===
                                      e.target.value.toLowerCase()
                                  )
                                ) {
                                  setFormData((prev) => ({
                                    ...prev,
                                    vendor: e.target.value,
                                  }));
                                }
                              }}
                              className="w-full p-2 bg-transparent focus:outline-none text-sm text-black"
                              placeholder="Search vendors..."
                              autoFocus
                            />
                            {vendorSearch && (
                              <button
                                onClick={() => setVendorSearch("")}
                                className="p-2"
                              >
                                <X className="w-4 h-4 text-gray-400" />
                              </button>
                            )}
                          </div> */}
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {filteredVendors.length > 0 ? (
                            filteredVendors.map((vendor) => (
                              <div
                                key={vendor.id}
                                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-black flex justify-between items-center"
                              >
                                {editingVendorId === vendor.id ? (
                                  <div className="flex items-center gap-2 w-full">
                                    <input
                                      type="text"
                                      value={editingVendorName}
                                      onChange={(e) =>
                                        setEditingVendorName(e.target.value)
                                      }
                                      className="flex-grow p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          handleVendorNameUpdate(
                                            vendor.id,
                                            editingVendorName
                                          );
                                        } else if (e.key === "Escape") {
                                          setEditingVendorId(null);
                                          setEditingVendorName("");
                                        }
                                      }}
                                      autoFocus
                                    />
                                    <button
                                      onClick={() =>
                                        handleVendorNameUpdate(
                                          vendor.id,
                                          editingVendorName
                                        )
                                      }
                                      className="p-1 text-green-600 hover:text-green-800 rounded hover:bg-green-50"
                                      title="Save changes"
                                      type="button"
                                    >
                                      <Check className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingVendorId(null);
                                        setEditingVendorName("");
                                      }}
                                      className="p-1 text-red-600 hover:text-red-800 rounded hover:bg-red-50"
                                      title="Cancel"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <>
                                    <span
                                      onClick={() =>
                                        handleSelect("vendor", vendor)
                                      }
                                      className="flex-grow"
                                    >
                                      {vendor.name}
                                    </span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingVendorId(vendor.id);
                                        setEditingVendorName(vendor.name);
                                      }}
                                      className="p-1 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50"
                                      title="Edit vendor name"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="p-2 text-gray-500 text-center">
                              {vendorSearch
                                ? "No vendors found"
                                : "No vendors available"}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Transaction Type
                  </label>
                  <div className="flex gap-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="type"
                        value="moneyIn"
                        checked={formData.type === "moneyIn"}
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-gray-700">Money In</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="type"
                        value="moneyOut"
                        checked={formData.type === "moneyOut"}
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-gray-700">Money Out</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex-1 border-l pl-6">
                <h4 className="font-medium text-gray-700 mb-3">
                  Upload Receipt
                </h4>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center h-64 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                  onDragOver={handleDragOver}
                  onDrop={handleFileDrop}
                >
                  <div className="w-16 h-16 mb-4 text-blue-500 flex items-center justify-center rounded-full bg-blue-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                  </div>
                  {files.length > 0 ? (
                    <div className="w-full">
                      <p className="mb-2 text-sm font-medium text-gray-700">
                        Selected Files:
                      </p>
                      <ul className="text-xs text-gray-600 mb-4 max-h-20 overflow-y-auto">
                        {files.map((file, index) => (
                          <li key={index} className="truncate">
                            {file.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <>
                      <p className="mb-2 text-sm font-medium text-gray-700">
                        Drag & Drop files here
                      </p>
                      <p className="text-xs text-gray-500 mb-4">or</p>
                    </>
                  )}
                  <label className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors cursor-pointer">
                    Browse Files
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      multiple
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Supported formats: JPG, PNG, PDF
                  </p>
                </div>
              </div>
            </form>

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-600 border-2 bg-red-100 border-red-300 rounded hover:bg-red-200 transition-colors hover:cursor-pointer hover:text-red-600"
              >
                Close
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-4 py-2 bg-blue-600 text-white rounded transition-colors hover:cursor-pointer ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-700"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {editingId ? "Updating..." : "Saving..."}
                  </div>
                ) : editingId ? (
                  "Update Transaction"
                ) : (
                  "Save and Add New Transaction"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {isUploadModalCsvOpen && (
        <UploadCsv
          closeUploadModalCsvOpen={() => setIsUploadModalCsvOpen(false)}
        />
      )}
    </div>
  );
}
