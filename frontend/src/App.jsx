import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { Loader } from "lucide-react";
import Navbar from "./components/Navbar";
import { Navigate, Routes, Route, BrowserRouter as Router } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import { Toaster } from "react-hot-toast";
import AddCustomerPage from "./pages/AddCustomerPage";
import TopSellersPage from "./pages/TopSellersPAge";
import PaidCustomers from "./pages/TopSellersPAge";
import LoanStatusPage from "./pages/LoanStatusPAge";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <Router>
      <div data-theme={theme}>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route path="/settings" element={<SettingsPage />} />
          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
         <Route
  path="/add-customer"
  element={authUser ? <AddCustomerPage /> : <Navigate to="/login" />}
/>
<Route
  path="/paid"
  element={authUser ? <PaidCustomers /> : <Navigate to="/login" />}
/>
<Route
  path="/check-loan-status" 
  element={authUser ? <LoanStatusPage /> : <Navigate to="/login" />}
/>

        </Routes>

        <Toaster />
      </div>
    </Router>
  );
};

export default App;
