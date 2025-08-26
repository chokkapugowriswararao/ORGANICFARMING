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
    loanProvided: '', // optional
  });

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loanBlocked, setLoanBlocked] = useState(false);
  const navigate = useNavigate();

  // Check if previous customer has loan to block new loan input
  useEffect(() => {
    const checkPreviousLoan = async () => {
      if (!formData.email) return;
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get(`/api/customers/search?customerId=${formData.email}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.loanProvided > 0) setLoanBlocked(true);
        else setLoanBlocked(false);
      } catch (err) {
        setLoanBlocked(false);
      }
    };
    checkPreviousLoan();
  }, [formData.email]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/customers/add', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log(response.data);
      const customerId = response.data._id;
      if (customerId) {
        toast.success(`Customer added successfully. Customer ID: ${customerId}`);
        navigate('/');
      } else {
        toast.error('Failed to create customer.');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error adding customer');
      toast.error(error.response?.data?.message || 'Error adding customer');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-3xl font-semibold text-center mb-6 text-purple-700">Add Customer</h2>
        {message && <p className="text-red-500 text-center mb-4">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="input input-bordered w-full text-lg p-4 border-2 border-indigo-400 rounded-md"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="input input-bordered w-full text-lg p-4 border-2 border-indigo-400 rounded-md"
            required
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="input input-bordered w-full text-lg p-4 border-2 border-indigo-400 rounded-md"
            required
          />
          <input
            type="number"
            name="henwaste"
            placeholder="Hen Waste (kg)"
            value={formData.henwaste}
            onChange={handleChange}
            className="input input-bordered w-full text-lg p-4 border-2 border-indigo-400 rounded-md"
          
          />
          <input
            type="number"
            name="cattlewaste"
            placeholder="Cattle Waste (kg)"
            value={formData.cattlewaste}
            onChange={handleChange}
            className="input input-bordered w-full text-lg p-4 border-2 border-indigo-400 rounded-md"
          
          />
          <input
            type="number"
            name="sheepwaste"
            placeholder="Sheep Waste (kg)"
            value={formData.sheepwaste}
            onChange={handleChange}
            className="input input-bordered w-full text-lg p-4 border-2 border-indigo-400 rounded-md"
            
          />
          <input
            type="number"
            name="neemPlantation"
            placeholder="Neem Plantation (units)"
            value={formData.neemPlantation}
            onChange={handleChange}
            className="input input-bordered w-full text-lg p-4 border-2 border-indigo-400 rounded-md"
          />

          {/* Loan Input */}
          <input
            type="number"
            name="loanProvided"
            placeholder="Loan Amount (Optional)"
            value={formData.loanProvided}
            onChange={handleChange}
            className={`input input-bordered w-full text-lg p-4 border-2 rounded-md ${loanBlocked ? 'bg-gray-200' : 'border-indigo-400'}`}
            disabled={loanBlocked}
          />
          {loanBlocked && <p className="text-red-500 text-sm mt-1">Previous loan exists. New loan cannot be provided.</p>}

          <button
            type="submit"
            className="btn btn-primary w-full py-4 text-lg bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-md"
            disabled={isLoading}
          >
            {isLoading ? 'Adding Customer...' : 'Add Customer'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerPage;
