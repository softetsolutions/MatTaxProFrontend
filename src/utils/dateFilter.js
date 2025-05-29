export const filterTransactionsByDate = (transactions, startDate, endDate) => {
  if (!startDate && !endDate) return transactions;

  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.created_at);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && end) {
      return transactionDate >= start && transactionDate <= end;
    } else if (start) {
      return transactionDate >= start;
    } else if (end) {
      return transactionDate <= end;
    }
    return true;
  });
};
