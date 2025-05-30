import { useState, useEffect } from "react";
import { ArrowUpDown, Trash2, RefreshCw } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import Pagination from "../../components/Pagination";

export default function BinPage() {
  const [deletedTransactions, setDeletedTransactions] = useState([]);
  const [sortField, setSortField] = useState("transactionId");
  const [sortDirection, setSortDirection] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem('binCurrentPage');
    return savedPage ? parseInt(savedPage, 10) : 1;
  });
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Update localStorage when currentPage changes
  useEffect(() => {
    localStorage.setItem('binCurrentPage', currentPage.toString());
  }, [currentPage]);

  useEffect(() => {
    const fetchDeletedTransactions = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const queryParams = new URLSearchParams({
          userId: userId,
          page: currentPage,
          limit: pageSize
        }).toString();

        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/transaction/deleted?${queryParams}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (response.status === 404) {
          setDeletedTransactions([]);
          setLoading(false);
          return;
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Failed to fetch deleted transactions"
          );
        }

        const data = await response.json();
        if (data && data.transactions) {
          setDeletedTransactions(data.transactions);
          setTotalPages(data.totalPages || 1);
          setTotalItems(data.totalItems || 0);
          setPageSize(data.limit || 10);
        } else {
          console.error("Unexpected data format:", data);
          throw new Error("Received invalid data format from server");
        }
        setLoading(false);
      } catch (err) {
        console.error("API Error:", err);
        toast.error("Failed to load Deleted Transactions");
        setError(
          err.message ||
            "Failed to fetch deleted transactions. Please try again later."
        );
        setDeletedTransactions([]);
        setLoading(false);
      }
    };

    fetchDeletedTransactions();
  }, [currentPage, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleRestore = async (id) => {
    try {
      const token = localStorage.getItem("userToken");
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const queryParams = new URLSearchParams({
        userId: userId,
      }).toString();

      const response = await toast.promise(
        fetch(
          `${import.meta.env.VITE_BASE_URL}/transaction/restore?${queryParams}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              transactionId: id,
            }),
          }
        ),
        {
          pending: "Restoring Transaction..!!",
          success: "Transaction Restored Successfully 👌",
          error: "Problem in restoring transaction 🤯",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to restore transaction");
      }

      // filtering from local state
      setDeletedTransactions(
        deletedTransactions.filter((transaction) => transaction.id !== id)
      );
      // toast.success(data.message || "Transaction restored successfully");
    } catch (err) {
      console.error("Restore failed:", err);
      // toast.error(
      //   err.message || "Failed to restore transaction. Please try again."
      // );
    }
  };

  const handlePermanentDelete = async (id) => {
    try {
      const token = localStorage.getItem("userToken");
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const queryParams = new URLSearchParams({
        userId: userId,
      }).toString();

      const response = await toast.promise(
        fetch(
          `${
            import.meta.env.VITE_BASE_URL
          }/transaction/deletePermanently?${queryParams}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              transactionId: id,
            }),
          }
        ),
        {
          pending: "Deleting Transaction..!!",
          success: "Transaction Deleted Successfully 👌",
          error: "Problem in deleting transaction 🤯",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to permanently delete transaction"
        );
      }

      setDeletedTransactions(
        deletedTransactions.filter((transaction) => transaction.id !== id)
      );
      // toast.success(data.message || "Transaction deleted permanently");
    } catch (err) {
      console.error("Permanent delete failed:", err);
      // toast.error(
      //   err.message ||
      //     "Failed to delete transaction permanently. Please try again."
      // );
    }
  };

  const sortedTransactions = [...deletedTransactions].sort((a, b) => {
    const modifier = sortDirection === "asc" ? 1 : -1;

    if (sortField === "transactionId") {
      return a?.transactionId?.localeCompare(b.transactionId) * modifier;
    } else if (sortField === "amount") {
      const amountA = Number.parseFloat(a.amount.replace("$", ""));
      const amountB = Number.parseFloat(b.amount.replace("$", ""));
      return (amountA - amountB) * modifier;
    } else if (sortField === "category" || sortField === "type") {
      return a[sortField].localeCompare(b[sortField]) * modifier;
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
      <div className="flex items-center justify-center min-h-[60vh] bg-white">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 flex flex-col items-center shadow-md">
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
            </svg>
          </div>
          <div className="text-lg font-semibold text-red-600 mb-2">Failed to load Deleted Transactions</div>
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
          <h1 className="text-2xl font-bold text-gray-900">Recycle Bin</h1>
          <p className="text-sm text-gray-500">
            Manage your deleted transactions
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm font-medium text-gray-500 border-b border-gray-200">
                  {[
                    // { field: "transactionId", label: "Transaction ID" },
                    { field: "amount", label: "Amount" },
                    { field: "category", label: "Category" },
                    { field: "type", label: "Type" },
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
                {sortedTransactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center justify-center py-8">
                        <div className="bg-gray-100 p-3 rounded-full mb-3">
                          <Trash2 className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-gray-500 mb-1">
                          Recycle bin is empty
                        </p>
                        <p className="text-sm text-gray-400">
                          Deleted transactions will appear here
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {transaction.amount}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {transaction.category}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          {transaction.type === "credit" ? (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-800 rounded-full">
                              <span className="font-medium text-xs">
                                Credit
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-800 rounded-full">
                              <span className="font-medium text-xs">Debit</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRestore(transaction.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md text-xs font-medium hover:cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Restore
                          </button>
                          <button
                            onClick={() =>
                              handlePermanentDelete(transaction.id)
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-md text-xs font-medium hover:cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {deletedTransactions.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              className="mt-4"
            />
          )}
        </div>
      </div>
    </div>
  );
}
