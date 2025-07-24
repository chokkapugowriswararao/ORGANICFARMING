import { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const AdminUsersPage = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const pendingRes = await axios.get("http://localhost:5000/api/auth/pending-users", {
          withCredentials: true,
        });
        const approvedRes = await axios.get("http://localhost:5000/api/auth/approved-users", {
          withCredentials: true,
        });

        setPendingUsers(pendingRes.data);
        setApprovedUsers(approvedRes.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        toast.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleApprove = async (userId) => {
  try {
    await axios.put(
      `http://localhost:5000/api/auth/approve-user/${userId}`,
      { approve: true }, // ✅ SEND approve: true here
      { withCredentials: true }
    );

    toast.success("User approved successfully");
    setPendingUsers((prev) => prev.filter((u) => u._id !== userId));

    const approvedUser = pendingUsers.find((u) => u._id === userId);
    if (approvedUser) {
      setApprovedUsers((prev) => [...prev, { ...approvedUser, isApproved: true }]);
    }
  } catch (err) {
    toast.error("Approval failed");
    console.error("Approval error:", err?.response?.data || err);
  }
};
  if (loading) return <div className="p-6">Loading users...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Pending Approvals</h2>
      {pendingUsers.length === 0 ? (
        <p>No pending users.</p>
      ) : (
        <ul className="mb-8">
          {pendingUsers.map((user) => (
            <li key={user._id} className="mb-2 border p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p><strong>Name:</strong> {user.fullName}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                </div>
                <button
                  onClick={() => handleApprove(user._id)}
                  className="btn btn-success"
                >
                  Approve
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <h2 className="text-2xl font-bold mb-4">Approved Users</h2>
      {approvedUsers.length === 0 ? (
        <p>No approved users.</p>
      ) : (
        <ul>
          {approvedUsers.map((user) => (
            <li key={user._id} className="mb-2 border p-4 rounded-lg shadow-sm">
              <p><strong>Name:</strong> {user.fullName}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Admin:</strong> {user.isAdmin ? "Yes" : "No"}</p>
            </li>
          ))}
        </ul>
      )}
      <Toaster />
    </div>
  );
};

export default AdminUsersPage;
