import { getAuthInfo } from "./auth";

export const fetchAuthorizedUsers = async () => {
  try {
    const { token, userId: accountId } = getAuthInfo();

    const response = await fetch(
      `${
        import.meta.env.VITE_BASE_URL
      }/accountant/get-authorize-user/${accountId}`,
      {
        method: "GET",
        headers: {
          Authorization: token,
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
    const { token, userId } = getAuthInfo();

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/accountant/auth`,
      {
        method: "POST",
        headers: {
          Authorization: token,
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
    const { token, userId } = getAuthInfo();

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/accountant/remove-auth`,
      {
        method: "DELETE",
        headers: {
          Authorization: token,
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
    const { token, userId } = getAuthInfo();

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/user/accountants/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: token,
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
    const { token, userId } = getAuthInfo();

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/user/accountants/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: token,
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
    throw err;
  }
};
