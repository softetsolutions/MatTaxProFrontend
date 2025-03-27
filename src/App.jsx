import LandingPage from "./pages/LandingPage";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import RoleSelection from "./pages/RoleSelection";
import UserSignup from "./pages/UserSignup";
import AccountantSignup from "./pages/AccountantSignup";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<RoleSelection/>} />
        <Route path="/register/user" element={<UserSignup />} />
        <Route path="/register/accountant" element={<AccountantSignup />} />
      </Routes>
    </>
  );
}

export default App;
