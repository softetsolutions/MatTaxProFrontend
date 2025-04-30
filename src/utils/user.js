import { getAuthInfo } from "./auth";

export const fetchUserDetails = async () => {
  try {
    const { token, userId } = getAuthInfo();
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/user/${userId}`,
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
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch user details");
    }

    const data = await response.json();
    return {
      firstName: data.fname,
      lastName: data.lname,
      email: data.email,
      phone: data.phone,
      address: data.address,
    };
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};

export const updateUserDetails = async (userData) => {
  try {
    const { token, userId } = getAuthInfo();
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/user/${userId}`,
      {
        method: "PUT",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          fname: userData.firstName,
          lname: userData.lastName,
          phone: userData.phone,
          address: userData.address,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update user details");
    }

    const data = await response.json();
    return {
      firstName: data.fname,
      lastName: data.lname,
      email: data.email,
      phone: data.phone,
      address: data.address,
    };
  } catch (error) {
    console.error("Error updating user details:", error);
    throw error;
  }
};

export const fetchAllUsers = async () => {
  const { token } = getAuthInfo();

  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/user/user-details`,
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
    throw new Error("Failed to fetch users");
  }

  const data = await response.json();
  return data;
};

export const fetchAllAccountants = async () => {
  const { token } = getAuthInfo();

  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/user/accountant-details`,
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
    throw new Error("Failed to fetch accountants");
  }

  const data = await response.json();
  return data;
};

export const accountLockUnlock = async (userId, isLock) => {
  const { token, userId: adminId } = getAuthInfo();

  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/admin/account-lock-unlock`,
    {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        userId,
        id: adminId,
        isLock: isLock ? "locked" : "unlocked",
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update account status");
  }

  const data = await response.json();
  return data;
};
