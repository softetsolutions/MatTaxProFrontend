import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DateRangeFilter from "../../components/DateRangeFilter";
import { fetchTransactions } from "../../utils/transactionsApi";
import { toast } from "react-toastify";


export default function Reports() {
  const [endDate, setEndDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [allTransaction, setAllTransaction] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const clearDateFilters = () => {
    setStartDate("");
    setEndDate("");
  };

  useEffect(() => {
    const fetchTransaction = async () => {
      setLoading(true);
      try {
        const data = await fetchTransactions(null, navigate);
        
        setAllTransaction(data || []);
      } catch (err) {
        setError(err.message || "Failed to fetch transactions");
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransaction();
  }, []);

  //  Filter by date range
const parseInputDate = (input, isEnd = false) => {
  if (!input) return null;
  const date = new Date(input);
  if (isEnd) {
    date.setHours(23, 59, 59, 999);
  }
  return date;
};

const filteredTransactions = allTransaction.filter((txn) => {
  const txnDate = new Date(txn.created_at);
  const start = parseInputDate(startDate);
  const end = parseInputDate(endDate, true); // include whole day

  console.log("txnDate:", txnDate, "start:", start, "end:", end);

  return (!start || txnDate >= start) && (!end || txnDate <= end);
});

  // ✅ Total In/Out
  const totalIn = filteredTransactions
    .filter((txn) => txn.type === "moneyIn")
    .reduce((sum, txn) => sum + Number(txn.amount || 0), 0);

  const totalOut = filteredTransactions
    .filter((txn) => txn.type === "moneyOut")
    .reduce((sum, txn) => sum + Number(txn.amount || 0), 0);

  // ✅ Vendor Summary 
  const vendorSummary = filteredTransactions.reduce((acc, txn) => {
    const name = txn.vendorname || txn.vendor || "Unknown";
    const type = txn.type === "moneyOut" ? "moneyOut" : "moneyIn";
    if (!acc[name]) acc[name] = { moneyIn: 0, moneyOut: 0 };
    acc[name][type] += Number(txn.amount || 0);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    toast.error("Failed to load Reports");
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-white">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 flex flex-col items-center shadow-md">
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
            </svg>
          </div>
          <div className="text-lg font-semibold text-red-600 mb-2">Failed to load Reports</div>
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


const handleDownloadCSV = () => {
  const lines = [];

  // Header
  lines.push("Filters");
  lines.push("Search,,between,dates");
  lines.push(`${startDate || ""} To ${endDate || ""}`);
  lines.push("Vendor");
  lines.push("transaction description");
  lines.push("");

  // Total summary
  lines.push(`Total money in,${totalIn}`);
  lines.push(`Total money out,${totalOut}`);
  lines.push("");

  // Money In by Vendor
  lines.push("Money In");
  lines.push("Aggregation by vendor");
  Object.entries(vendorSummary).forEach(([vendor, totals]) => {
    if (totals.moneyIn > 0) {
      lines.push(`${vendor},${totals.moneyIn}`);
    }
  });
  lines.push("");

  // Money Out by Vendor
  lines.push("Money Out");
  lines.push("Aggregation by vendor");
  Object.entries(vendorSummary).forEach(([vendor, totals]) => {
    if (totals.moneyOut > 0) {
      lines.push(`${vendor},${totals.moneyOut}`);
    }
  });

  lines.push("");
 

  // Convert to CSV string
  const csvContent = lines.join("\n");

  // Trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "report.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};


  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-500">View and manage your reports</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <DateRangeFilter
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          onClear={clearDateFilters}
        />
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            {filteredTransactions.length} transaction(s) found
          </div>
          <button
            onClick={handleDownloadCSV}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Export as CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg shadow-md border border-green-200">
          <h2 className="text-lg font-semibold text-green-800 mb-2">Total Money In</h2>
          <p className="text-3xl font-bold text-green-700">₹{totalIn.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg shadow-md border border-red-200">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Total Money Out</h2>
          <p className="text-3xl font-bold text-red-700">₹{totalOut.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Vendor Wise Summary</h2>
        <table className="w-full text-sm border bg-white shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-yellow-800 p-2 border">Vendor</th>
              <th className="p-2 border text-green-700">Money In (₹)</th>
              <th className="p-2 border text-red-700">Money Out (₹)</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(vendorSummary).map(([vendor, totals]) => (
              <tr key={vendor}>
                <td className="text-yellow-800 p-2 border">{vendor}</td>
                <td className="p-2 border text-green-700">{totals.moneyIn.toFixed(2)}</td>
                <td className="p-2 border text-red-700">{totals.moneyOut.toFixed(2)}</td>
              </tr>
            ))}
            {Object.keys(vendorSummary).length === 0 && (
              <tr>
                <td colSpan="3" className="text-center p-3 text-gray-500">
                  No transactions to display.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
