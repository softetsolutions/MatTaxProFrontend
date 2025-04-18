import LandingPage from "./pages/LandingPage";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import RoleSelection from "./pages/RoleSelection";
import UserSignup from "./pages/UserSignup";
import DashboardLayout from "./pages/user/DashboardLayout";
import Transactions from "./pages/user/Transactions";
import TransactionLog from "./pages/user/TransactionLog";
import AccountantPage from "./pages/user/AccountantManage";
import Users from "./pages/user/Users";
import Bin from "./pages/user/Bin";
import ProtectRouteComp from "./components/ProtectRouteComp";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<RoleSelection />} />
        <Route path="/register/:role" element={<UserSignup />} />
        {/* user */}
        <Route path="/dashboard" element={<ProtectRouteComp routeName={"dashboard"}><DashboardLayout /></ProtectRouteComp>}>
        {/* /* <Route path="quick-actions" element={<QuickActions />}/> */}

          <Route path="transactions" element={<Transactions />} />
          {/* <Route path="AddTransactions" element={<AddTransactions />} /> */}
          <Route index element={<Navigate to="transactions" replace />} />{" "}
          {/* Default */}
          <Route path="transactionlog" element={<TransactionLog />} />
          <Route path="addaccountant" element={<AccountantPage />} />
          <Route path="users" element={<Users />} />
          <Route path="bin" element={<Bin />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
