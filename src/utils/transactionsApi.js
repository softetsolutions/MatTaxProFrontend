import { getAuthInfo } from "./auth";
import { handleUnauthoriz } from "./helperFunction";
import { toast } from "react-toastify";

export const fetchTransactions = async (selectedUserId = null, navigate, page = 1, limit = 10) => {
  try {
    const { userId, role } = getAuthInfo();

    let url;
    if (role === "accountant") {
      if (!selectedUserId) {
        return { transactions: [], totalPages: 0, totalItems: 0, limit };
      }
      url = `${import.meta.env.VITE_BASE_URL}/transaction?userId=${selectedUserId}&accountId=${userId}&page=${page}&limit=${limit}`;
    } else {
      url = `${import.meta.env.VITE_BASE_URL}/transaction?userId=${userId}&page=${page}&limit=${limit}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleUnauthoriz(navigate);
        throw new Error("Unauthorized: Please check your authentication");
      }
      throw new Error("Failed to fetch transactions");
    }

    const data = await response.json();
    // Handle paginated response
    const transactions = data.transactions || [];
    // Ensure vendorname is mapped from vendor if not present
    return {
      ...data,
      transactions: transactions.map(txn => ({
        ...txn,
        vendorname: txn.vendorname || txn.vendor || "Unknown"
      }))
    };
  } catch (err) {
    toast.error("Failed to load Transactions");
    console.error("Error fetching transactions:", err);
    throw err;
  }
};

export const createTransaction = async (transactionData, selectedUserId) => {
  try {
    const { userId, role } = getAuthInfo();

    let url;
    if (role === "accountant") {
      if (!selectedUserId) {
        throw new Error("No user selected for transaction creation");
      }
      url = `${import.meta.env.VITE_BASE_URL}/transaction?userId=${selectedUserId}&accountId=${userId}`;
    } else {
      url = `${import.meta.env.VITE_BASE_URL}/transaction?userId=${userId}`;
    }

    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        ...(transactionData instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
      },
      body:
        transactionData instanceof FormData
          ? transactionData
          : JSON.stringify(transactionData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleUnauthoriz();
      }
      throw new Error("Failed to create transaction");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
};

export const updateTransaction = async (
  transactionData,
  selectedUserId = null
) => {
  try {
    const { userId, role } = getAuthInfo();

    let url;
    if (role === "accountant") {
      if (!selectedUserId) {
        throw new Error("No user selected for transaction update");
      }
      url = `${import.meta.env.VITE_BASE_URL}/transaction/update?userId=${selectedUserId}&accountId=${userId}`;
    } else {
      url = `${import.meta.env.VITE_BASE_URL}/transaction/update?userId=${userId}`;
    }

    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        ...(transactionData instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
      },
      body:
        transactionData instanceof FormData
          ? transactionData
          : JSON.stringify({
              ...transactionData,
              updatedByUserId: userId,
            }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleUnauthoriz();
        throw new Error("Unauthorized: Please check your authentication");
      }
      throw new Error("Failed to update transaction");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error updating transaction:", err);
    throw err;
  }
};

export const deleteTransaction = async (
  transactionId,
  selectedUserId = null
) => {
  try {
    const { userId, role } = getAuthInfo();

    let url;
    if (role === "accountant") {
      if (!selectedUserId) {
        throw new Error("No user selected for transaction deletion");
      }
      url = `${import.meta.env.VITE_BASE_URL}/transaction?userId=${selectedUserId}&accountId=${userId}&transactionId=${transactionId}`;
    } else {
      url = `${import.meta.env.VITE_BASE_URL}/transaction?userId=${userId}&transactionId=${transactionId}`;
    }

    const response = await fetch(url, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleUnauthoriz();
      }
      throw new Error("Failed to delete transaction");
    }

    return true;
  } catch (err) {
    console.error("Error deleting transaction:", err);
    throw err;
  }
};
  

































