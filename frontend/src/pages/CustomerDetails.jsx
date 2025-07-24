import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";

const CustomerDetails = () => {
  const { customerId } = useParams();
  const location = useLocation();

  // Parse email query param from URL
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      if (!customerId || !email) {
        setError("Missing customer ID or email");
        setLoading(false);
        return;
      }

      try {
        // Make authenticated request to your backend API
        const response = await axios.get(
          `api/customers/details/${customerId}?email=${encodeURIComponent(email)}`,
          {
            // Include auth token if needed (adjust according to your auth setup)
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, 
            },
          }
        );

        setCustomer(response.data.customer);
        setError("");
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch customer details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerDetails();
  }, [customerId, email]);

  if (loading) return <p>Loading customer details...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!customer) return <p>No customer data found.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Customer Details</h1>
      {/* Display customer details here */}
      <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(customer, null, 2)}</pre>
    </div>
  );
};

export default CustomerDetails;
