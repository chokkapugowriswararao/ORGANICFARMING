import React, { useState } from 'react';
import axios from 'axios';

const LoanStatusPage = () => {
  const [customerId, setCustomerId] = useState('');
  const [loanStatus, setLoanStatus] = useState('');
  const [loanAmountWithInterest, setLoanAmountWithInterest] = useState('');
  const [monthsPassed, setMonthsPassed] = useState(0);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setCustomerId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`/api/customers/loan-status/${customerId}`, {
        withCredentials: true,
      });
      // Check the loan status and details returned from backend
      setLoanStatus(response.data.loanStatus);
      setLoanAmountWithInterest(response.data.loanAmountWithInterest);
      setMonthsPassed(response.data.monthsPassed);
      setMessage('Loan status fetched successfully!');
    } catch (error) {
      setLoanStatus('');
      setLoanAmountWithInterest('');
      setMessage(error.response?.data?.message || 'Error fetching loan status');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-3xl font-semibold text-center mb-6 text-purple-700">Check Loan Status</h2>
        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="customerId"
            placeholder="Customer ID"
            value={customerId}
            onChange={handleChange}
            className="input input-bordered w-full text-lg p-4 border-2 border-indigo-400 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <button
            type="submit"
            className="btn btn-primary w-full py-4 text-lg bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-md hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Check Loan Status
          </button>
        </form>

        {loanStatus && (
          <div className="mt-4 text-center">
            <h3 className="text-xl font-semibold">Loan Status:</h3>
            <p className="text-lg">{loanStatus}</p>
            {loanStatus === 'Pending Loan' && (
              <>
                <p className="text-lg">Loan Amount (with interest): ${loanAmountWithInterest}</p>
                <p className="text-lg">Months Passed: {monthsPassed} months</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanStatusPage;
