import { getAuthInfo } from "./auth";
import { handleUnauthoriz } from "./helperFunction";

export const fetchReceipt = async (receiptId, navigate) => {
  try {
    const { token } = getAuthInfo();

    const url = `${import.meta.env.VITE_BASE_URL}/receipt/${receiptId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleUnauthoriz(navigate);
        throw new Error("Unauthorized: Please check your authentication");
      }
      throw new Error("Failed to fetch receipt");
    }

    const data = await response.json();
    return data.data;
  } catch (err) {
    console.error("Error fetching receipt:", err);
    throw err;
  }
};
