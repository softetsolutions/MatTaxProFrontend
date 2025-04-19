import { useState } from "react";
import TransactionLog from "./TransactionLog";
import TransactionsPage from "./Transactions";

function RenderTransactionOrTransactionLog() {
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
    />
  );
}

export default RenderTransactionOrTransactionLog;
