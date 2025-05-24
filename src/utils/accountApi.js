import { handleUnauthoriz } from "./helperFunction";
import { getAuthInfo } from "./auth";

export const fetchAllAccounts = async (userId) => {
  try {
    const url = `${import.meta.env.VITE_BASE_URL}/accountNo/gets?userId=${userId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleUnauthoriz();
        throw new Error("Unauthorized: Please check your authentication");
      }
      throw new Error("Failed to fetch accounts");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching accounts:", err);
    throw err;
  }
};

export const createAccount = async (accountData, userId) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/accountNo/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userId,
          accountNo: accountData
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        handleUnauthoriz();
        throw new Error("Unauthorized: Please check your authentication");
      }
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create account");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error creating account:", err);
    throw err;
  }
};

export const updateAccount = async (accountId, number) => {
  try {
    const { userId } = getAuthInfo();

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/accountNo/update/${accountId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userId,
          name: number,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        handleUnauthoriz();
        throw new Error("Unauthorized: Please check your authentication");
      }
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update account");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error updating account:", err);
    throw err;
  }
}; 