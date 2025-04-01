import LandingPage from "./pages/LandingPage";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import RoleSelection from "./pages/RoleSelection";
import UserSignup from "./pages/UserSignup";
import AccountantSignup from "./pages/AccountantSignup";
import DashboardLayout from "./pages/user/DashboardLayout";
import Transactions from "./pages/user/Transactions";
// import QuickActions from "./pages/user/QuickActions";
import TransactionLog from "./pages/user/TransactionLog";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<RoleSelection/>} />
        <Route path="/register/user" element={<UserSignup />} />
        <Route path="/register/accountant" element={<AccountantSignup />} />
        {/* user */}
        <Route path="/dashboard" element={<DashboardLayout />}>
        {/* /* <Route path="quick-actions" element={<QuickActions />}/> */}
          <Route path="transactions" element={<Transactions />}/> 
          <Route path="transactionlog" element={<TransactionLog />}/>
        </Route>
      </Routes>
    </>
  );
}

export default App;
