
export const fetchAllVendors = async () => {
  try {
    const url = `${import.meta.env.VITE_BASE_URL}/vendor/gets`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        // Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized: Please check your authentication");
      }
      throw new Error("Failed to fetch Vendor");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching transactions:", err);
    throw err;
  }
};