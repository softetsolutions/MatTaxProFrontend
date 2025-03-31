import { useState } from "react";
import { ArrowUpDown } from "lucide-react";

export default function TransactionsPage() {
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("asc");

  const transactions = [
    { 
      id: 1, 
      amount: "$125.00", 
      date: "2023-03-15", 
      merchant: "Amazon",
      category: "Shopping",
      createdBy: "User1",
      account: "Checking",
      reports: "View",
      receipt: "Download"
    },
    { 
      id: 2, 
      amount: "$89.99", 
      date: "2023-03-14", 
      merchant: "Netflix",
      category: "Entertainment",
      createdBy: "User2",
      account: "Savings",
      reports: "View",
      receipt: "Download"
    },
    { 
      id: 3, 
      amount: "$245.50", 
      date: "2023-03-13", 
      merchant: "Whole Foods",
      category: "Groceries",
      createdBy: "User1",
      account: "Credit",
      reports: "View",
      receipt: "Download"
    },
  ];

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    const modifier = sortDirection === "asc" ? 1 : -1;
    
    if (sortField === "date") {
      return (new Date(a.date) - new Date(b.date)) * modifier;
    }
    if (sortField === "amount") {
      const amountA = parseFloat(a.amount.replace('$', ''));
      const amountB = parseFloat(b.amount.replace('$', ''));
      return (amountA - amountB) * modifier;
    }
    return String(a[sortField]).localeCompare(String(b[sortField])) * modifier;
  });

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-sm text-gray-500">View and manage your transactions</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors hover:cursor-pointer">
          Add Transaction
        </button>
      </div>

      {/* Transactions Table */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm font-medium text-gray-500 border-b border-gray-200">
                {[
                  { field: "date", label: "Date" },
                  { field: "merchant", label: "To/From" },
                  { field: "category", label: "Category" },
                  { field: "createdBy", label: "Created By" },
                  { field: "account", label: "Account" },
                  { field: "reports", label: "Reports" },
                  { field: "amount", label: "Amount" },
                  { field: "receipt", label: "Receipt" },
                ].map((header) => (
                  <th 
                    key={header.field}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleSort(header.field)}
                  >
                    <div className="flex items-center gap-1">
                      {header.label}
                      <ArrowUpDown className="w-4 h-4" />
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
              {sortedTransactions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-6 text-center text-gray-500">
                    No records to display
                  </td>
                </tr>
              ) : (
                sortedTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900">{txn.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{txn.merchant}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{txn.category}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{txn.createdBy}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{txn.account}</td>
                    <td className="px-4 py-3 text-sm text-blue-600 hover:underline cursor-pointer">
                      {txn.reports}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {txn.amount}
                    </td>
                    <td className="px-4 py-3 text-sm text-blue-600 hover:underline cursor-pointer">
                      {txn.receipt}
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