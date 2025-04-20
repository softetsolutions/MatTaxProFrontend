import { jwtDecode } from "jwt-decode";

export const fetchAuthorizedUsers = async () => {
  try {
    const token = localStorage.getItem("userToken");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const decoded = jwtDecode(token);
    const accountId = decoded.id;

    if (!accountId) {
      throw new Error("No account ID found ");
    }

    const response = await fetch(
      `${
        import.meta.env.VITE_BASE_URL
      }/accountant/get-authorize-user/${accountId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
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
