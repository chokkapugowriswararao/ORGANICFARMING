import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Loader, Users, UsersRound, LogOut } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/check", {
          withCredentials: true,
        });

        if (res.data && res.data.isAdmin) {
          setAdmin(res.data);
        } else {
          toast.error("Unauthorized. Not an admin.");
          navigate("/admin/login");
        }
      } catch (error) {
        toast.error("Please login as admin first.");
        navigate("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin size-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 to-purple-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-2">
          Welcome, {admin.fullName}
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Admin Dashboard - Manage Users and Customers
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-6 rounded-xl shadow-md cursor-pointer hover:scale-105 transition-all"
            onClick={() => navigate("/admin/users")}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-1">Manage Users</h2>
                <p className="text-sm">View & Approve New Signups</p>
              </div>
              <Users className="w-8 h-8" />
            </div>
          </div>

          <div
            className="bg-gradient-to-r from-green-400 to-teal-500 text-white p-6 rounded-xl shadow-md cursor-pointer hover:scale-105 transition-all"
            onClick={() => navigate("/admin/customers")}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-1">Manage Customers</h2>
                <p className="text-sm">Update Customer Info</p>
              </div>
              <UsersRound className="w-8 h-8" />
            </div>
          </div>

          <div
            className="bg-gradient-to-r from-red-400 to-pink-500 text-white p-6 rounded-xl shadow-md cursor-pointer hover:scale-105 transition-all"
            onClick={async () => {
              await axios.post("http://localhost:5000/api/auth/logout", {}, {
                withCredentials: true,
              });
              toast.success("Logged out successfully");
              navigate("/admin/login");
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-1">Logout</h2>
                <p className="text-sm">End admin session</p>
              </div>
              <LogOut className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default AdminDashboard;
