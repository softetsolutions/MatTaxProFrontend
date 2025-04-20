import { jwtDecode } from "jwt-decode";

export const getAuthInfo = () => {
  const token = localStorage.getItem("userToken");
  if (!token) {
    throw new Error("No authentication token found");
  }

  const decoded = jwtDecode(token);
  const userId = decoded.id;
  const role = decoded.role;

  if (!userId) {
    throw new Error("No user ID found in token");
  }

  return { token, userId, role };
};
