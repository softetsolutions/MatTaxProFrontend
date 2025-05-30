import { toast } from "react-toastify";
import { getAuthInfo } from "./auth";

export const fetchAuthorizedUsers = async () => {
  try {
    const {  userId: accountId } = getAuthInfo();

    const response = await fetch(
      `${
        import.meta.env.VITE_BASE_URL
      }/accountant/get-authorize-user/${accountId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized: Please check your authentication");
      }
      throw new Error("Failed to fetch authorized users");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching authorized users:", err);
    throw err;
  }
};

export const requestAuthorization = async (accountantId) => {
  try {
    const { userId } = getAuthInfo();

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/accountant/auth`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userId: userId,
          accountId: accountantId,
          status: "pending",
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to request authorization");
    }

    return true;
  } catch (err) {
    console.error("Authorization request failed:", err);
    throw err;
  }
};

export const removeAuthorization = async (accountantId) => {
  try {
    const { userId } = getAuthInfo();

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/accountant/remove-auth`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userId: userId,
          accountId: accountantId,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to remove authorization");
    }

    return true;
  } catch (err) {
    console.error("Deauthorization failed:", err);
    throw err;
  }
};

export const fetchAuthorizationStatus = async () => {
  try {
    const { userId } = getAuthInfo();

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/user/accountants/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch authorization status");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch authorization status:", err);
    throw err;
  }
};

export const fetchAccountants = async () => {
  try {
    const { userId } = getAuthInfo();

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/user/accountants/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized: Please check your authentication");
      }
      throw new Error("Failed to fetch accountants");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching accountants:", err);
    toast.error("Failed to load Accountants");
    throw err;
  }
};

export const searchAccountantByEmail = async (email) => {
  try {

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/user/accountant-by-email/${email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      if (response.status === 403) {
        return null; // Accountant not found
      }
      throw new Error("Failed to search accountant");
    }

    return await response.json();
  } catch (error) {
    console.error("Error searching accountant:", error);
    throw error;
  }
};
