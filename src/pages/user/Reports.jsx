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

  console.log("allTransaction", allTransaction);

  const clearDateFilters = () => {
    setStartDate("");
    setEndDate("");
  };

 useEffect(() => {
  const fetchTransaction = async () => {
    setLoading(true);
    try {
      const data = await fetchTransactions(null, navigate);
      setAllTransaction(data);
    } catch (err) {
      setError(err.message || "Failed to fetch transactions");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchTransaction();
}, []);

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
          <h1 className="text-2xl font-bold text-gray-900">Filters</h1>
          <p className="text-sm text-gray-500">View and manage your reports</p>
        </div>
      </div>
      <div className="flex items-center">
        <div className="flex items-center gap-4 justify-between">
          <DateRangeFilter
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            onClear={clearDateFilters}
          />
        </div>
        <div className="text-sm text-gray-500">
          {/* {filteredTransactions.length} transactions found */}0 transactions
          found
        </div>
      </div>
    </div>
  );
}
