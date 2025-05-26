import { useState } from "react";
import TransactionLog from "./TransactionLog";
import TransactionsPage from "./Transactions";

function RenderTransactionOrTransactionLog({ selectedUserId }) {
  const [isTransasctionLog, setIsTransasctionLog] = useState(null);

  return isTransasctionLog ? (
    <TransactionLog
      setIsTransasctionLog={setIsTransasctionLog}
      isTransasctionLog={isTransasctionLog}
    />
  ) : (
    <TransactionsPage
      setIsTransasctionLog={setIsTransasctionLog}
      isTransasctionLog={isTransasctionLog}
      selectedUserId={selectedUserId}
    />
  );
}

export default RenderTransactionOrTransactionLog;
