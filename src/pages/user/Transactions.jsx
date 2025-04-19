import { useState, useEffect } from "react";
import { ArrowUpDown, Edit, Logs, Trash2 } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { handleUnauthoriz } from "../../utils/helperFunction";
import { useNavigate } from "react-router-dom";

export default function TransactionsPage({setIsTransasctionLog}) {
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    type: "debit",
    vendor: "",
  });
  const [transactions, setTransactions] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [refreshTableList, setRefreshTableList] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const userId = jwtDecode(localStorage.getItem("userToken")).id;

        setUserId(userId);
        let response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/transaction?userId=${userId}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status !== 200) {
          if (response.status === 401) {
            handleUnauthoriz(navigate);
          }
          throw new Error("Error logging in");
        }
        response = await response.json();
        setTransactions(response);

        let transactionLogs = await fetch(
          `${
            import.meta.env.VITE_BASE_URL
          }/transaction/transactionLog?userId=${userId}&transactionId=${64}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("transactionLogs", transactionLogs);

        // setError(null);
      } catch (err) {
        setError("Failed to fetch transactions. Please try again later.");
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [refreshTableList]);

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

    try {
      if (editingId) {
        // Update existing transaction
        const transactionData = {
          transactionId: editingId,
          newAmount: formData.amount || null,
          newCategory: formData.category || null,
          newType: formData.type || null,
          updatedByUserId: userId,
        };

        let transaction = await toast.promise(
          fetch(
            `${
              import.meta.env.VITE_BASE_URL
            }/transaction/update?userId=${userId}`,
            {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ ...transactionData }),
            }
          ),
          {
            pending: "Updating Transaction..!!",
            success: "Transaction Updated Successfully 👌",
            error: "Problem in saving transaction 🤯",
          }
        );

        if (transaction.status !== 200) {
          throw new Error("Error in api call");
        }
      } else {
        // Create new transaction
        const transactionData = {
          amount: parseFloat(formData.amount),
          category: formData.category,
          type: formData.type,
          vendorId: formData.vendor,
          userId: userId, // Hardcoded user ID from fetch URL
          isdeleted: false,
        };

        let transaction = await toast.promise(
          fetch(
            `${import.meta.env.VITE_BASE_URL}/transaction/?userId=${userId}`,
            {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ ...transactionData }),
            }
          ),
          {
            pending: "Saving Transaction..!!",
            success: "Transaction Saved Successfully 👌",
            error: "Problem in saving transaction 🤯",
          }
        );

        console.log("transaction", await transaction.json());

        if (transaction.status !== 200) {
          throw new Error("Error in api call");
        }
      }
      setRefreshTableList((prev) => !prev);
      setFormData({ amount: "", category: "", type: "debit", vendorId: "" });
      setFiles([]);
      setShowModal(false);
      setEditingId(null);
    } catch (err) {
      console.error("Operation failed:", err);
      alert("Operation failed. Please try again.");
    }
  };

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
      const res = await toast.promise(
        fetch(
          `${
            import.meta.env.VITE_BASE_URL
          }/transaction/?userId=${userId}&transactionId=${id}`,
          {
            method: "DELETE",
            credentials: "include", // Required to send HttpOnly cookie
            headers: {
              "Content-Type": "application/json",
            },
          }
        ),
        {
          pending: "Deleting Transaction",
          success: "Successfully Deleted Transaction 👌",
          error: "Got Error Deleting transaction, Try again 🤯",
        }
      );

      if (res.status !== 200) {
        throw new Error("Got error in api");
      }

      // toast.success("Transaction moved to bin");
      setRefreshTableList((prev) => !prev);
    } catch (e) {
      console.error(e);
      // toast.error("Problem in deleting transaction. Try again");
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
        <button
          onClick={() => {
            setEditingId(null);
            setShowModal(true);
          }}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors hover:cursor-pointer"
        >
          Add Transaction
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm font-medium text-gray-500 border-b border-gray-200">
                {[
                  { field: "created_at", label: "Date" },
                  { field: "amount", label: "Amount" },
                  { field: "category", label: "Category" },
                  { field: "type", label: "Type" },
                  { field: "vendorid", label: "Vendor ID" },
                  { field: "actions", label: "Actions" },
                ].map((header) => (
                  <th key={header.field} className="px-4 py-3 hover:bg-gray-50">
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
              {sortedTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No transactions found
                  </td>
                </tr>
              ) : (
                sortedTransactions.map((txn) => (
                  <tr
                    key={txn.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {txn.created_at}
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
                      {" "}
                      {txn.vendorid}
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-xl border border-gray-200 transition-all animate-in fade-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingId ? "Edit Transaction" : "Add Transaction"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
                  setFormData({
                    amount: "",
                    category: "",
                    type: "debit",
                    vendorId: "",
                  });
                }}
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
                <h4 className="font-medium text-gray-700 mb-3">
                  Transaction Details
                </h4>
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

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="category"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    required
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    <option value="Shopping">Shopping</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Groceries">Groceries</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Transport">Transport</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="vendorId"
                  >
                    Vendor ID
                  </label>
                  <input
                    type="text"
                    id="vendorId"
                    name="vendorId"
                    value={formData.vendorId}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Enter vendor ID"
                    required
                  />
                </div> */}

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="category"
                  >
                    Choose Vendor
                  </label>
                  <select
                    id="vendor"
                    name="vendor"
                    value={formData.vendor}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    required
                  >
                    <option value="" disabled>
                      Select a vendor
                    </option>
                    <option value="5">Dmart</option>
                    <option value="2">Flipkart</option>
                    <option value="8">Chadstone Shopping Centre</option>
                    <option value="34">Westfield Fountain Gate</option>
                  </select>
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
                        value="debit"
                        checked={formData.type === "debit"}
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-gray-700">Debit</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="type"
                        value="credit"
                        checked={formData.type === "credit"}
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-gray-700">Credit</span>
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
                onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
                }}
                className="px-4 py-2 text-gray-600 border-2 bg-red-100 border-red-300 rounded hover:bg-red-200 transition-colors hover:cursor-pointer hover:text-red-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors hover:cursor-pointer"
              >
                {editingId ? "Update Transaction" : "Save Transaction"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
