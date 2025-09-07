import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AddCustomerPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    henwaste: '',
    cattlewaste: '',
    sheepwaste: '',
    neemPlantation: '',
    loanRequested: 'No', // Yes/No
    loanType: '', // hen, cattle, sheep, neem
    loanQuantity: '', // number of items
    loanAmount: 0,
  });

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoanTypeChange = (e) => {
    setFormData((prev) => ({ ...prev, loanType: e.target.value, loanQuantity: '', loanAmount: 0 }));
  };

  const handleLoanQuantityChange = (e) => {
    const quantity = e.target.value;
    setFormData((prev) => ({
      ...prev,
      loanQuantity: quantity,
      loanAmount: calculateLoanAmount(prev.loanType, quantity),
    }));
  };

  const calculateLoanAmount = (type, quantity) => {
    const qty = Number(quantity);
    if (!type || qty <= 0) return 0;
    switch (type) {
      case 'hen':
        return qty * 300;
      case 'cattle':
        return qty * 20000;
      case 'sheep':
        return qty * 9000;
      case 'neem':
        return qty * 10000;
      default:
        return 0;
    }
  };

  const validateLoan = () => {
    if (formData.loanRequested === 'Yes') {
      if (!formData.loanType) {
        toast.error('Please select a loan type');
        return false;
      }
      if (!formData.loanQuantity || Number(formData.loanQuantity) <= 0) {
        toast.error(
          `Invalid quantity for ${formData.loanType}. Employee responsible for verifying actual count!`
        );
        return false;
      }
      if (formData.loanAmount <= 0) {
        toast.error('Loan amount must be greater than 0');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateLoan()) return;

    setIsLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/customers/add', formData, { withCredentials: true });

      const customerId = response.data._id;
      if (customerId) {
        toast.success(
          `Customer added successfully. Loan Amount: ${formData.loanAmount}`,
          { duration: 5000 }
        );
        setTimeout(() => navigate('/'), 5000);
      } else {
        setMessage('Failed to create customer.');
        toast.error('Failed to create customer.');
        setIsLoading(false);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error adding customer');
      toast.error(error.response?.data?.message || 'Error adding customer');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-3xl font-semibold text-center mb-6 text-purple-700">
          Add Customer
        </h2>

        {message && <p className="text-green-500 text-center mb-4">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Details */}
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required className="input input-bordered w-full text-lg p-4 border-2 border-indigo-400 rounded-md"/>
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="input input-bordered w-full text-lg p-4 border-2 border-indigo-400 rounded-md"/>
          <input type="text" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} required className="input input-bordered w-full text-lg p-4 border-2 border-indigo-400 rounded-md"/>
          <input type="number" name="henwaste" placeholder="Hen Waste (kg)" value={formData.henwaste} onChange={handleChange} required className="input input-bordered w-full text-lg p-4 border-2 border-indigo-400 rounded-md"/>
          <input type="number" name="cattlewaste" placeholder="Cattle Waste (kg)" value={formData.cattlewaste} onChange={handleChange} required className="input input-bordered w-full text-lg p-4 border-2 border-indigo-400 rounded-md"/>
          <input type="number" name="sheepwaste" placeholder="Sheep Waste (kg)" value={formData.sheepwaste} onChange={handleChange} required className="input input-bordered w-full text-lg p-4 border-2 border-indigo-400 rounded-md"/>
          <input type="number" name="neemPlantation" placeholder="Neem Plantation (units)" value={formData.neemPlantation} onChange={handleChange} className="input input-bordered w-full text-lg p-4 border-2 border-indigo-400 rounded-md"/>

          {/* Loan Section */}
          <div className="space-y-2">
            <label className="font-semibold">Loan Requested</label>
            <select name="loanRequested" value={formData.loanRequested} onChange={handleChange} className="input input-bordered w-full p-3 border-2 border-indigo-400 rounded-md">
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>

            {formData.loanRequested === 'Yes' && (
              <div className="space-y-2 mt-2">
                <label className="font-semibold">Loan Type (Select One)</label>
                <select value={formData.loanType} onChange={handleLoanTypeChange} className="input input-bordered w-full p-3 border-2 border-indigo-400 rounded-md">
                  <option value="">--Select--</option>
                  <option value="hen">Hen</option>
                  <option value="cattle">Cattle</option>
                  <option value="sheep">Sheep</option>
                  <option value="neem">Neem</option>
                </select>

                {formData.loanType && (
                  <input
                    type="number"
                    name="loanQuantity"
                    placeholder={`Number of ${formData.loanType}`}
                    value={formData.loanQuantity}
                    onChange={handleLoanQuantityChange}
                    required
                    className="input input-bordered w-full p-4 border-2 border-indigo-400 rounded-md"
                  />
                )}

                {formData.loanAmount > 0 && (
                  <p className="text-green-600 font-semibold">Loan Amount: ₹{formData.loanAmount}</p>
                )}

                {formData.loanType && formData.loanQuantity <= 0 && (
                  <p className="text-red-600 text-sm">
                    Warning: No {formData.loanType}s available. Employee responsible!
                  </p>
                )}
              </div>
            )}
          </div>

          <button type="submit" disabled={isLoading} className="btn btn-primary w-full py-4 text-lg bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-md">
            {isLoading ? 'Adding Customer...' : 'Add Customer'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerPage;
