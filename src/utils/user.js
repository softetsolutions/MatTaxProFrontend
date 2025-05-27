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
      addressLine1: data.address_line1,
      city: data.city,
      postcode: data.postcode,
      country: data.country,
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
          address_line1: userData.addressLine1,
          city: userData.city,
          postcode: userData.postcode,
          country: userData.country,
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
      addressLine1: data.address_line1,
      city: data.city,
      postcode: data.postcode,
      country: data.country,
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

export const sendDeleteEmail = async () => {
  const { token } = getAuthInfo();

  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/user/sendmail-for-delete-user`,
    {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to send deletion email");
  }

  return data;
};

export const confirmDeleteAccount = async (token) => {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/user/confirm-delete?token=${token}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to delete account");
  }

  return true;
};

export const resetPassword = async (token, password) => {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/auth/reset-password?token=${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    }
  );
  
  if (response.status !== 200) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error resetting password");
  }
  
  return response.json();
};

export const adminResetPassword = async (userId, password) => {
  const { token } = getAuthInfo();

  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/auth/reset-password?id=${userId}`,
    {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ password }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to reset password");
  }

  return response.json();
}; 