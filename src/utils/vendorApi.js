import { handleUnauthoriz } from "./helperFunction";
import { getAuthInfo } from "./auth";

export const fetchAllVendors = async (userId) => {
  try {
    const url = `${import.meta.env.VITE_BASE_URL}/vendor/gets?userId=${userId}`;

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
      throw new Error("Failed to fetch vendors");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching vendors:", err);
    throw err;
  }
};

export const updateVendor = async (vendorId, name) => {
  try {
    const { userId } = getAuthInfo();

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/vendor/update/${vendorId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userId,
          name,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        handleUnauthoriz();
        throw new Error("Unauthorized: Please check your authentication");
      }
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update vendor");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error updating vendor:", err);
    throw err;
  }
};

export const createVendor = async (name, userId) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/vendor/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userId,
          name,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        handleUnauthoriz();
        throw new Error("Unauthorized: Please check your authentication");
      }
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create vendor");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error creating vendor:", err);
    throw err;
  }
};
