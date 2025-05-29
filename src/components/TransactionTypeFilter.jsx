import PropTypes from "prop-types";

const TransactionTypeFilter = ({ value, onChange }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="block w-40 px-3 py-2 pr-8 text-sm rounded-md border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 shadow-sm appearance-none cursor-pointer"
    >
      <option value="all">All Transactions</option>
      <option value="moneyIn">Money In</option>
      <option value="moneyOut">Money Out</option>
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
      <svg
        className="w-4 h-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
);

TransactionTypeFilter.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default TransactionTypeFilter;
