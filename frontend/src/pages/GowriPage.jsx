import React from "react";
import { useNavigate } from "react-router-dom";

const GowriPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-6">
      <div className="bg-base-100 p-8 rounded-2xl shadow-xl flex flex-col md:flex-row gap-8 max-w-3xl w-full">
        
        {/* Customer Section */}
        <div className="flex-1 flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-4">Login as Customer</h2>
          <button
            onClick={() => navigate("/customer-login")}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md transition-all"
          >
            Customer Login
          </button>
        </div>

        <div className="divider md:divider-horizontal">OR</div>

        {/* Employee Section */}
        <div className="flex-1 flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-4">Login as Employee</h2>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-md transition-all"
          >
            Employee Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default GowriPage;
