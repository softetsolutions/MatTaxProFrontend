import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowUpDown, User, Clock, FileText } from "lucide-react";

export default function TransactionLog() {
  const [transactionLogs, setTransactionLogs] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const mockLogs = [
    {
      id: 1,
      timestamp: "2023-08-20T14:30:00Z",
      userName: "Harsh",
      transactionId: 1,
      action: "edited",
      changes: {
        amount: { from: "$100.00", to: "$125.00" },
        category: { from: "Utilities", to: "Shopping" }
      }
    },
    {
      id: 2,
      timestamp: "2023-08-20T15:45:00Z",
      userName: "Jane",
      transactionId: 2,
      action: "deleted",
      changes: null
    }
  ];

  useEffect(() => {
    if (transactionLogs.length === 0) {
      setTransactionLogs(mockLogs);
      localStorage.setItem("transactionLogs", JSON.stringify(mockLogs));
    }
  }, []);

  const getActionColor = (action) => {
    switch (action) {
      case "edited": return "text-blue-600";
      case "created": return "text-green-600";
      case "deleted": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const sortLogs = (key) => {
    if (key === "action") return;
    
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedLogs = [...transactionLogs].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setTransactionLogs(sortedLogs);
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Transaction Logs
          </h1>
          <p className="text-sm text-gray-500 mt-1">Audit trail of all transaction modifications</p>
        </div>
        <Link to="/dashboard/transactions" className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-md transition-colors">
          Back to Transactions
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm font-medium text-gray-500 border-b border-gray-200">
                {[ 
                  { field: "timestamp", label: "Timestamp" },
                  { field: "userName", label: "User" },
                  { field: "transactionId", label: "Transaction ID" }
                ].map((header) => (
                  <th key={header.field} className="px-4 py-3 cursor-pointer" onClick={() => sortLogs(header.field)}>
                    <div className="flex items-center gap-1">
                      {header.label}
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactionLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-center text-gray-500">No activity logs found</td>
                </tr>
              ) : (
                transactionLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span className="font-medium">{log.userName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-blue-600 font-mono">#{log.transactionId}</td>
                    <td className={`px-4 py-3 text-sm font-medium ${getActionColor(log.action)}`}>{log.action.charAt(0).toUpperCase() + log.action.slice(1)}</td>
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
