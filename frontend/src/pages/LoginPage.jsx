
import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";
import axios from "axios";

import { useAuthStore } from "../store/useAuthStore";

const EmployerLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="flex flex-col justify-center items-center w-full max-w-md px-4">
      <div className="w-full space-y-6">
        <div className="text-center mb-6">
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"
            >
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
            <p className="text-base-content/70">Sign in to your account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-base-content/40" />
              </div>
              <input
                type="email"
                className="input input-bordered w-full pl-10"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-base-content/40" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="input input-bordered w-full pl-10"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-base-content/40" />
                ) : (
                  <Eye className="h-5 w-5 text-base-content/40" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2 inline-block" />
                Loading...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p className="text-center text-base-content/70 mt-4 text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="link link-primary">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

const CustomerLoginForm = () => {
  const [custEmail, setCustEmail] = useState("");
  const [custId, setCustId] = useState("");
  const [loginError, setLoginError] = useState("");
  const [customer, setCustomer] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleCustomerLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");
    setCustomer(null);

    if (!custEmail || !custId) {
      setLoginError("Please enter both email and customer ID");
      setIsLoggingIn(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/customers/login", {
        email: custEmail,
        customerId: custId,
      });

      setCustomer(response.data.customer);
      setLoginError("");
    } catch (error) {
      if (error.response) {
        setLoginError(error.response.data.message || "Login failed");
      } else {
        setLoginError("Server error. Please try again later.");
      }
      setCustomer(null);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full max-w-md px-4">
      <h2 className="text-2xl font-bold mb-6 text-primary text-center">Customer Login</h2>

      {!customer ? (
        <form onSubmit={handleCustomerLogin} className="space-y-4 w-full">
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              value={custEmail}
              onChange={(e) => setCustEmail(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Enter customer email"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Customer ID</label>
            <input
              type="text"
              value={custId}
              onChange={(e) => setCustId(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Enter customer ID"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoggingIn}
            className="btn btn-primary w-full"
          >
            {isLoggingIn ? "Logging in..." : "Show Details"}
          </button>
          {loginError && (
            <p className="text-red-600 mt-4 text-center">{loginError}</p>
          )}
        </form>
      ) : (
        <div className="mt-6 p-6 bg-gray-100 rounded shadow-lg overflow-auto" style={{ width: '40vw', height: '50vh' }}>
  <h3 className="text-3xl font-bold mb-6 text-green-700 text-center">
    Welcome, {customer.name}!
  </h3>
  <pre className="text-lg font-mono whitespace-pre-wrap break-words">
    {JSON.stringify(customer, null, 2)}
  </pre>
</div>

      )}
    </div>
  );
};

const CombinedLoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-12
          max-w-6xl
          w-full
        "
      >
        {/* Employer Login */}
        <EmployerLoginForm />

        {/* Customer Login */}
        <CustomerLoginForm />
      </div>
    </div>
  );
};

export default CombinedLoginPage;
