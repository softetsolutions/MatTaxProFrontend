import { X, Filter } from "lucide-react";

const DateRangeFilter = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onClear,
}) => {
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm hover:shadow transition-all duration-200">
      <div className="flex items-center gap-2 text-gray-600">
        <Filter className="h-4 w-4" />
        <span className="text-sm font-medium">Filter by date:</span>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="date"
          value={startDate || ""}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-36 px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-gray-800 text-sm bg-white hover:border-gray-400 transition-all"
          placeholder="Start date"
        />

        <div className="flex items-center gap-1 text-gray-400">
          <span className="text-sm">to</span>
        </div>

        <input
          type="date"
          value={endDate || ""}
          onChange={(e) => setEndDate(e.target.value)}
          min={startDate}
          className="w-36 px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-gray-800 text-sm bg-white hover:border-gray-400 transition-all"
          placeholder="End date"
        />
      </div>

      {(startDate || endDate) && (
        <div className="flex items-center gap-2 ml-auto">
          <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
            {startDate && endDate ? (
              <span>
                {formatDate(startDate)} — {formatDate(endDate)}
              </span>
            ) : startDate ? (
              <span>From {formatDate(startDate)}</span>
            ) : (
              <span>Until {formatDate(endDate)}</span>
            )}
          </div>
          <button
            onClick={onClear}
            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            title="Clear date filters"
          >
            <X className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter;
