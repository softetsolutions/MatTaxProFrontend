import { handleUnauthoriz } from "./helperFunction";
import { getAuthInfo } from "./auth";

export const fetchAllCategories = async (userId) => {
  try {
    const url = `${import.meta.env.VITE_BASE_URL}/category/gets?userId=${userId}`;

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
      throw new Error("Failed to fetch categories");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching categories:", err);
    throw err;
  }
};

export const createCategory = async (name, userId) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/category/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          userId,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        handleUnauthoriz();
        throw new Error("Unauthorized: Please check your authentication");
      }
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create category");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error creating category:", err);
    throw err;
  }
};

export const updateCategory = async (categoryId, name) => {
  try {
    const { userId } = getAuthInfo();

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/category/update/${categoryId}`,
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
      throw new Error(errorData.message || "Failed to update category");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error updating category:", err);
    throw err;
  }
}; 