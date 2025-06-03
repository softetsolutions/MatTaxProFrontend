import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";

function RenderAllUserOrTransactions() {
  const token = localStorage.getItem("userToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    if (decoded.role === "admin") {
      return <Navigate to="allUsers" replace />;
    }else if (decoded.role === "accountant"){
      return <Navigate to="users" replace/>
    }

    return <Navigate to="transactions" replace />;
  } catch (err) {
    // If decoding fails, navigate to login (invalid token)
    return <Navigate to="/login" replace />;
  }
}

export default RenderAllUserOrTransactions;
