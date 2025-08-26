// src/pages/LoanProviderForm.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const niceLabel = (slug) => {
  if (slug === "sheep") return "Sheep Loan";
  if (slug === "cattle") return "Cattle Loan";
  if (slug === "poultry") return "Poultry Loan";
  if (slug === "farm") return "Crop/Farm Loan";
  return slug;
};

export default function LoanProviderForm() {
  const { loanType } = useParams(); // sheep | cattle | poultry | farm
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    accountNo: "",
    phone: "",
    customerId: "",
    amount: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");
  const [loanSummary, setLoanSummary] = useState(null); // show per-type amounts after update

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validateBasics = () => {
    if (!form.name || !form.email || !form.accountNo || !form.phone || !form.customerId || !form.amount) {
      setNotice("Please fill all fields.");
      return false;
    }
    if (Number(form.amount) <= 0) {
      setNotice("Amount must be greater than 0.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotice("");
    if (!validateBasics()) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setNotice("Unauthorized. Please log in.");
        setSubmitting(false);
        return;
      }

      // 1) Verify the customer by email (and optionally phone) under this user
      const detailsRes = await axios.get(
        `/api/customers/details/${form.customerId}?email=${encodeURIComponent(form.email)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const customer = detailsRes.data?.customer;
      if (!customer) {
        setNotice("Customer not found for given Email & ID.");
        setSubmitting(false);
        return;
      }
      if (customer.phoneNumber && customer.phoneNumber !== form.phone) {
        setNotice("Phone number does not match this customer.");
        setSubmitting(false);
        return;
      }

      // 2) Block if any loan is already pending
      const statusRes = await axios.get(`/api/customers/loan-status/${form.customerId}`);
      if (statusRes.data?.loanStatus === "Pending Loan") {
        setNotice("Loan denied: You already have a pending loan. Clear it before applying again.");
        setSubmitting(false);
        return;
      }

      // 3) Apply loan (DB updated here)
      const putRes = await axios.put(
        `/api/customers/apply-loan/${form.customerId}`,
        { loanType, loanAmount: Number(form.amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updated = putRes.data?.customer;

      setNotice(`Loan approved! Amount will be sent to your account within a day.`);

      // 4) Build a summary from updated customer amounts
      setLoanSummary({
        totalProvided: updated?.loanProvided ?? 0,
        byType: [
          { label: "Sheep", amount: updated?.sheeploan ?? 0 },
          { label: "Cattle", amount: updated?.cattleloan ?? 0 },
          { label: "Farm", amount: updated?.farmLoan ?? 0 },
          { label: "Poultry", amount: updated?.poultryLoan ?? 0 },
        ],
      });

      // Optional: navigate back home after a delay
      // setTimeout(() => navigate("/"), 1800);
    } catch (err) {
      console.error(err);
      setNotice(err.response?.data?.message || "Failed to apply loan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow">
        <h2 className="text-2xl font-bold text-center mb-6">{niceLabel(loanType)}</h2>

        {notice && (
          <div className="mb-4 p-3 rounded bg-indigo-50 text-indigo-700 text-center">
            {notice}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Account Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
          />
          <input
            name="accountNo"
            placeholder="Account Number"
            value={form.accountNo}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
          />
          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
          />
          <input
            name="customerId"
            placeholder="Customer ID"
            value={form.customerId}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
          />
          <input
            type="number"
            name="amount"
            placeholder="Loan Amount"
            value={form.amount}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            {submitting ? "Submitting..." : "Submit & Approve"}
          </button>
        </form>

        {/* Loan summary (cleared/uncleared) */}
        {loanSummary && (
          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold mb-2">Loan Summary</h3>
            <ul className="space-y-1 text-sm">
              {loanSummary.byType.map(({ label, amount }) => (
                <li key={label}>
                  {label}:{" "}
                  {amount > 0 ? (
                    <span>{amount}/- uncleared</span>
                  ) : (
                    <span>0/- cleared</span>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-2 text-sm">
              <span className="font-medium">Total Outstanding: </span>
              {loanSummary.totalProvided}/-
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
