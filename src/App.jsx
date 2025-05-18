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
import VerifyEmail from "./pages/VerifyEmail";
import AllUsers from "./pages/admin/AllUsers";
import AllAccountants from "./pages/admin/AllAccountants";
import RenderAllUserOrTransactions from "./pages/user/RenderAllUsersOrTransactions";
import VerifyByGoogle from "./pages/VerifyByGoogle";
import ForgotPassword from "./pages/ForgotPassword";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import ResetPassword from "./pages/ResetPassword";


function App() {
  
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<RoleSelection />} />
        <Route path="/register/:role" element={<UserSignup />} />
        <Route path="/verifyEmail/:token" element={<VerifyEmail />} />
        <Route path="/verifyByGoogle/" element={<VerifyByGoogle />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/resetPassword/:token" element={<ResetPassword />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsAndConditions />} />
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
            element={
              <ProtectRouteComp routeName={"transactions"}>
                <RenderTransactionOrTransactionLog />
              </ProtectRouteComp>
            }
          />
          <Route
            index
            element={
              <RenderAllUserOrTransactions/>
            }
          />
          <Route
            path="addaccountant"
            element={
              <ProtectRouteComp routeName={"addaccountant"}>
                <AccountantPage />
              </ProtectRouteComp>
            }
          />
          <Route
            path="users"
            element={
              <ProtectRouteComp routeName={"users"}>
                <Users />
              </ProtectRouteComp>
            }
          />
          <Route
            path="bin"
            element={
              <ProtectRouteComp routeName={"bin"}>
                <Bin />
              </ProtectRouteComp>
            }
          />
          <Route
            path="invitations"
            element={
              <ProtectRouteComp routeName={"invitations"}>
                <Invitation />
              </ProtectRouteComp>
            }
          />
          {/* Below accounts route is for user profile Page*/}
          <Route
            path="accounts"
            element={
              <ProtectRouteComp routeName={"accounts"}>
                <Accounts />
              </ProtectRouteComp>
            }
          />

          {/* Admin Routes */}
          <Route
            path="allUsers"
            element={
              <ProtectRouteComp routeName={"allUsers"}>
                <AllUsers />
              </ProtectRouteComp>
            }
          />
          <Route
            path="allAccountants"
            element={
              <ProtectRouteComp routeName={"allAccountants"}>
                <AllAccountants />
              </ProtectRouteComp>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
