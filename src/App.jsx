import LandingPage from "./pages/LandingPage";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import RoleSelection from "./pages/RoleSelection";
import UserSignup from "./pages/UserSignup";
import DashboardLayout from "./pages/user/DashboardLayout";
import AccountantPage from "./pages/user/AccountantManage";
import Users from "./pages/user/Users";
import Bin from "./pages/user/Bin";
import Invitation from "./pages/user/Invitation";
import ProtectRouteComp from "./components/ProtectRouteComp";
import RenderTransactionOrTransactionLog from "./pages/user/RenderTransactionOrTransactionLog";
import Accounts from "./pages/user/Accounts";
import VerifyEmail from './pages/VerifyEmail'
import AllUsers from "./pages/admin/Allusers";
import AllAccountants from "./pages/admin/Allaccountant";
import { jwtDecode } from "jwt-decode";

function App() {

  const token = localStorage.getItem("userToken");
  const decoded = token && jwtDecode(token);

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<RoleSelection />} />
        <Route path="/register/:role" element={<UserSignup />} />
        <Route path="/verifyEmail/:token" element={<VerifyEmail />} />
        {/* user */}
        <Route
          path="/dashboard"
          element={
            <ProtectRouteComp routeName={"dashboard"}>
              <DashboardLayout />
            </ProtectRouteComp>
          }
        >
          <Route
            path="transactions"
            element={<RenderTransactionOrTransactionLog />}
          />
          <Route index element={<Navigate to={decoded?.role === "admin" ? "allUsers" : "transactions"} replace />} />
          <Route path="addaccountant" element={<AccountantPage />} />
          <Route path="users" element={<Users />} />
          <Route path="bin" element={<Bin />} />
          <Route path="invitations" element={<Invitation />} />
          <Route path="accounts" element={<Accounts />} />

          {/* Admin Routes */}
          <Route path="allUsers" element={<AllUsers />} />
          <Route path="allAccountants" element={<AllAccountants />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
