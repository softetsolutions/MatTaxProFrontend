import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DateRangeFilter from "../../components/DateRangeFilter";
import { fetchTransactions } from "../../utils/transactionsApi";

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
        console.log("Transaction dates:", data.map(txn => txn.date));
        console.log("Sample transaction:", data[0]);


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

  // ✅ Filter by date range
const parseToISO = (input) => {
  if (!input) return null;
  const parts = input.split("-");
  if (parts[0].length === 2) {
   
    return `20${parts[0]}-${parts[1]}-${parts[2]}`;
  } else if (parts[2].length === 4) {
   
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return input;
};

const filteredTransactions = allTransaction.filter((txn) => {
  const txnDateStr = txn.Date; 
  if (!txnDateStr) return true;

  const txnDate = new Date(parseToISO(txnDateStr));
  const start = startDate ? new Date(parseToISO(startDate)) : null;
  const end = endDate ? new Date(parseToISO(endDate)) : null;

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
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
        <div className="text-sm text-gray-500">
          {filteredTransactions.length} transaction(s) found
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-green-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold text-green-700">Total Money In</h2>
          <p className="text-2xl font-bold">₹{totalIn.toFixed(2)}</p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold text-red-700">Total Money Out</h2>
          <p className="text-2xl font-bold">₹{totalOut.toFixed(2)}</p>
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
