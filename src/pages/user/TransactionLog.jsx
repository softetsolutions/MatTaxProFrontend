import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowUpDown,ArrowRight, User, Clock, FileText } from "lucide-react";

export default function TransactionLog() {
  const [transactionLogs, setTransactionLogs] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'transaction_id', direction: "asc" });

  const mockLogs = [
    {
      log_id: 1,
      transaction_id: 101,
      field_changed: "amount",
      old_value: "$100.00",
      new_value: "$125.00",
      edited_by: "Harsh",
      timestamp: "2023-08-20T14:30:00Z",
    },
    {
      log_id: 2,
      transaction_id: 101,
      field_changed: "category",
      old_value: "Utilities",
      new_value: "Shopping",
      edited_by: "Harsh",
      timestamp: "2023-08-20T14:30:00Z",
    },
    {
      log_id: 3,
      transaction_id: 102,
      field_changed: "description",
      old_value: "Monthly bill",
      new_value: "Quarterly payment",
      edited_by: "Jane",
      timestamp: "2023-08-20T15:45:00Z",
    },
    {
      log_id: 4,
      transaction_id: 103,
      field_changed: "transaction_type",
      old_value: "debit",
      new_value: "credit",
      edited_by: "Jane",
      timestamp: "2023-08-21T09:15:00Z",
    },
    {
      log_id: 5,
      transaction_id: 104,
      field_changed: "transaction_type",
      old_value: "credit",
      new_value: "debit",
      edited_by: "Harsh",
      timestamp: "2023-08-21T10:30:00Z",
    },
  ]

  // Group logs by transaction_id
  const groupLogsByTransaction = (logs) => {
    const groupedLogs = {}

    logs.forEach((log) => {
      const { transaction_id, edited_by, timestamp } = log

      if (!groupedLogs[transaction_id]) {
        groupedLogs[transaction_id] = {
          transaction_id,
          edited_by,
          timestamp,
          changes: [],
        }
      }

      groupedLogs[transaction_id].changes.push({
        field_changed: log.field_changed,
        old_value: log.old_value,
        new_value: log.new_value,
      })
    })

    return Object.values(groupedLogs)
  }

  useEffect(() => {
    // First try to get from localStorage
    const savedLogs = localStorage.getItem("transactionLogs")
    
    if (savedLogs) {
      try {
        setTransactionLogs(JSON.parse(savedLogs))
      } catch (error) {
        console.error("Error parsing saved logs:", error)
        initializeWithMockData()
      }
    } else {
      initializeWithMockData()
    }
  }, []);

  const initializeWithMockData = () => {
    const grouped = groupLogsByTransaction(mockLogs)
    setTransactionLogs(grouped)
    localStorage.setItem("transactionLogs", JSON.stringify(grouped))
  }

  const sortLogs = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })

    const sortedLogs = [...transactionLogs].sort((a, b) => {
      if (key === "transaction_id") {
        return direction === "asc" ? a.transaction_id - b.transaction_id : b.transaction_id - a.transaction_id
      }
      
      if (key === "changes") {
        return direction === "asc" 
          ? a.changes.length - b.changes.length 
          : b.changes.length - a.changes.length
      }
      
      if (key === "timestamp") {
        const dateA = new Date(a[key])
        const dateB = new Date(b[key])
        return direction === "asc" ? dateA - dateB : dateB - dateA
      }

      // For edited By comparison
      const valueA = String(a[key]).toLowerCase()
      const valueB = String(b[key]).toLowerCase()
      return direction === "asc" 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA)
    })

    setTransactionLogs(sortedLogs)
  }

  const formatFieldName = (fieldName) => {
    if (fieldName === "transaction_type") return "Transaction Type"
    return fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
  }

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
        <Link
          to="/dashboard/transactions"
          className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-md transition-colors"
        >
          Back to Transactions
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm font-medium text-gray-500 border-b border-gray-200">
                {[
                  { field: "transaction_id", label: "Transaction ID" },
                  { field: "changes", label: "Changes" },
                  { field: "edited_by", label: "Edited By" },
                  { field: "timestamp", label: "Timestamp" },
                ].map((header) => (
                  <th key={header.field} className="px-4 py-3 cursor-pointer" onClick={() => sortLogs(header.field)}>
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
                  <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                    No activity logs found
                  </td>
                </tr>
              ) : (
                transactionLogs.map((log, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-blue-600 font-mono">#{log.transaction_id}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex flex-col gap-2">
                        {log.changes.map((change, idx) => (
                          <div key={idx} className={idx !== 0 ? "pt-2 border-t border-gray-100" : ""}>
                            <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full mr-2">
                              {formatFieldName(change.field_changed)}
                            </span>
                            <span className="text-red-600">{change.old_value}</span>
                            <ArrowRight className="inline w-4 h-4 text-gray-400 mx-1" />
                            <span className="text-green-600">{change.new_value}</span>
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
      </div>
    </div>
  )
}