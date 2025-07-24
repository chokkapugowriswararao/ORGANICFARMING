import { useEffect, useState } from "react";
import axios from "axios";
import { Loader, Pencil, Save } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

const AdminCustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCustomerId, setEditCustomerId] = useState(null);
  const [editedCustomer, setEditedCustomer] = useState({});

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get("/api/customers/all", {
          withCredentials: true,
        });

        // Extract latest waste values
        const enriched = res.data.map((c) => {
          const lastWaste = c.wasteRecords?.[c.wasteRecords.length - 1] || {};
          return {
            ...c,
            henwaste: lastWaste.henwaste || 0,
            cattlewaste: lastWaste.cattlewaste || 0,
            sheepwaste: lastWaste.sheepwaste || 0,
            neemPlantation: lastWaste.neemPlantation || 0,
          };
        });

        setCustomers(enriched);
      } catch (error) {
        toast.error("Failed to load customers");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleEdit = (customer) => {
    setEditCustomerId(customer._id);
    setEditedCustomer({ ...customer });
  };

  const handleChange = (e) => {
    setEditedCustomer({ ...editedCustomer, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(
        `/api/customers/update/${editCustomerId}`,
        {
          ...editedCustomer,
          addWasteRecord: true, // ✅ Important to push to wasteRecords
        },
        {
          withCredentials: true,
        }
      );
      const updated = customers.map((c) =>
        c._id === editCustomerId ? {
          ...res.data.customer,
          henwaste: editedCustomer.henwaste,
          cattlewaste: editedCustomer.cattlewaste,
          sheepwaste: editedCustomer.sheepwaste,
          neemPlantation: editedCustomer.neemPlantation,
        } : c
      );
      setCustomers(updated);
      toast.success("Customer updated");
      setEditCustomerId(null);
    } catch (err) {
      toast.error("Failed to update customer");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin size-10" />
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Manage Customers</h1>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="bg-base-200">
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Hen</th>
              <th>Cattle</th>
              <th>Sheep</th>
              <th>Neem</th>
              <th>Loan</th>
              <th>Pending</th>
              <th>Pending Amount</th>
              <th>Loan Approved</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id}>
                <td>
                  {editCustomerId === customer._id ? (
                    <input
                      name="name"
                      value={editedCustomer.name || ""}
                      onChange={handleChange}
                      className="input input-sm"
                    />
                  ) : (
                    customer.name
                  )}
                </td>
                <td>
                  {editCustomerId === customer._id ? (
                    <input
                      name="email"
                      value={editedCustomer.email || ""}
                      onChange={handleChange}
                      className="input input-sm"
                    />
                  ) : (
                    customer.email
                  )}
                </td>
                <td>
                  {editCustomerId === customer._id ? (
                    <input
                      name="phoneNumber"
                      value={editedCustomer.phoneNumber || ""}
                      onChange={handleChange}
                      className="input input-sm"
                    />
                  ) : (
                    customer.phoneNumber
                  )}
                </td>

                {/* ✅ Show waste values from latest wasteRecord */}
                <td>
                  {editCustomerId === customer._id ? (
                    <input
                      name="henwaste"
                      value={editedCustomer.henwaste || 0}
                      onChange={handleChange}
                      type="number"
                      className="input input-sm"
                    />
                  ) : (
                    customer.henwaste
                  )}
                </td>
                <td>
                  {editCustomerId === customer._id ? (
                    <input
                      name="cattlewaste"
                      value={editedCustomer.cattlewaste || 0}
                      onChange={handleChange}
                      type="number"
                      className="input input-sm"
                    />
                  ) : (
                    customer.cattlewaste
                  )}
                </td>
                <td>
                  {editCustomerId === customer._id ? (
                    <input
                      name="sheepwaste"
                      value={editedCustomer.sheepwaste || 0}
                      onChange={handleChange}
                      type="number"
                      className="input input-sm"
                    />
                  ) : (
                    customer.sheepwaste
                  )}
                </td>
                <td>
                  {editCustomerId === customer._id ? (
                    <input
                      name="neemPlantation"
                      value={editedCustomer.neemPlantation || 0}
                      onChange={handleChange}
                      type="number"
                      className="input input-sm"
                    />
                  ) : (
                    customer.neemPlantation
                  )}
                </td>

                <td>
                  {editCustomerId === customer._id ? (
                    <input
                      name="loanProvided"
                      value={editedCustomer.loanProvided || 0}
                      onChange={handleChange}
                      type="number"
                      className="input input-sm"
                    />
                  ) : (
                    customer.loanProvided
                  )}
                </td>
                <td>
                  {editCustomerId === customer._id ? (
                    <select
                      name="pendingPayment"
                      value={editedCustomer.pendingPayment}
                      onChange={(e) =>
                        setEditedCustomer({
                          ...editedCustomer,
                          pendingPayment: e.target.value === "true",
                        })
                      }
                      className="select select-sm"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  ) : customer.pendingPayment ? (
                    "Yes"
                  ) : (
                    "No"
                  )}
                </td>
                <td>
                  {editCustomerId === customer._id ? (
                    <input
                      name="pendingPaymentAmount"
                      value={editedCustomer.pendingPaymentAmount || 0}
                      onChange={handleChange}
                      type="number"
                      className="input input-sm"
                    />
                  ) : (
                    customer.pendingPaymentAmount || 0
                  )}
                </td>
                <td>
                  {editCustomerId === customer._id ? (
                    <input
                      name="loanApprovedDate"
                      value={
                        editedCustomer.loanApprovedDate?.slice(0, 10) || ""
                      }
                      onChange={handleChange}
                      type="date"
                      className="input input-sm"
                    />
                  ) : (
                    customer.loanApprovedDate?.slice(0, 10) || "-"
                  )}
                </td>

                <td>
                  {editCustomerId === customer._id ? (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={handleSave}
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm btn-accent"
                      onClick={() => handleEdit(customer)}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Toaster />
    </div>
  );
};

export default AdminCustomerPage;
