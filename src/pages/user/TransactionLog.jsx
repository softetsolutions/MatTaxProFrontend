import { useState, useEffect } from "react";
import { ArrowUpDown, ArrowRight, User, Clock, FileText } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import Pagination from "../../components/Pagination";

export default function TransactionLog({
  setIsTransasctionLog,
  isTransasctionLog,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transactionLogs, setTransactionLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem('transactionLogCurrentPage');
    return savedPage ? parseInt(savedPage, 10) : 1;
  });
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    localStorage.setItem('transactionLogCurrentPage', currentPage.toString());
  }, [currentPage]);

  useEffect(() => {
    const fetchData = async () => {
      const user = jwtDecode(localStorage.getItem("userToken"));
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          userId: user.id,
          transactionId: isTransasctionLog,
          page: currentPage,
          limit: pageSize
        }).toString();
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/transaction/transactionLog/?${queryParams}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch transaction logs");
        }
        const data = await response.json();
        if (data && Array.isArray(data.logs)) {
          setTransactionLogs(data.logs);
          setTotalPages(data.totalPages || 1);
          setTotalItems(data.totalItems || 0);
          setPageSize(data.limit || 10);
        } else {
          console.error("Unexpected data format:", data);
          throw new Error("Received invalid data format from server");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch transactions");
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isTransasctionLog, currentPage, pageSize]);

  const formatFieldName = (fieldName) => {
    if (!fieldName || typeof fieldName !== "string") return "";
    if (fieldName === "transaction_type") return "Transaction Type";
    return fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
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
      <div className="flex items-center justify-center min-h-[60vh] bg-white">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 flex flex-col items-center shadow-md">
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
            </svg>
          </div>
          <div className="text-lg font-semibold text-red-600 mb-2">Failed to load Transaction Logs</div>
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
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Transaction Logs
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Audit trail of all transaction modifications
          </p>
        </div>
        <button
          onClick={() => setIsTransasctionLog(null)}
          className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-md transition-colors"
        >
          Back to Transactions
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm font-medium text-gray-500 border-b border-gray-200">
                  {[
                    { field: "transaction_id", label: "Transaction ID" },
                    { field: "changes", label: "Changes" },
                    { field: "edited_by", label: "Edited By" },
                    { field: "timestamp", label: "Timestamp" },
                  ].map((header) => (
                    <th
                      key={header.field}
                      className="px-4 py-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-1">
                        {header.label}
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactionLogs.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No activity logs found
                    </td>
                  </tr>
                ) : (
                  transactionLogs.map((log, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-blue-600 font-mono">
                        #
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex flex-col gap-2">
                          {Array.isArray(log.changes) && log.changes.map((change, idx) => (
                            <div
                              key={idx}
                              className={idx !== 0 ? "pt-2 border-t border-gray-100" : ""}
                            >
                              <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full mr-2">
                                {change.field_changed ? formatFieldName(change.field_changed) : "-"}
                              </span>
                              <span>
                                {change.old_value ?? "-"}
                              </span>
                              <ArrowRight className="inline w-4 h-4 text-gray-400 mx-1" />
                              <span className="text-green-600">
                                {change.new_value ?? "-"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span className="font-medium">{log.edited_by}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {transactionLogs.length > 0 && (
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
