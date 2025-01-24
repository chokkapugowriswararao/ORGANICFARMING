import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaidCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/customers/paid', {
        withCredentials: true,
      });
      setCustomers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching customers sorted by totalAmountPaid');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleLoadMore = () => {
    const remainingCustomers = customers.length - visibleCount;
    if (visibleCount >= customers.length) {
      setVisibleCount(5);
    } else {
      setVisibleCount((prev) => prev + Math.min(5, remainingCustomers));
    }
  };

  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-4xl mx-auto my-8">
      <h2 className="text-4xl font-bold text-center mb-6">Paid Customers</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {customers.slice(0, visibleCount).map((customer) => (
          <div key={customer._id} className="card w-full bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body">
              <h3 className="card-title text-xl font-semibold text-red-800">{customer.name}</h3>
              <p className="text-red-700">Email: {customer.email}</p>
              <p className="text-red-700">Phone: {customer.phoneNumber}</p>
              <button onClick={() => handleViewDetails(customer)} className="btn btn-primary mt-2">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
      {customers.length > 5 && (
        <div className="text-center mt-6">
          <button onClick={handleLoadMore} className="btn btn-secondary">
            {visibleCount >= customers.length ? 'View Less' : 'Load More'}
          </button>
        </div>
      )}
      {isModalOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-yellow-50 p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">{selectedCustomer.name}'s Details</h3>
            <p className="text-gray-800"><strong>Email:</strong> {selectedCustomer.email}</p>
            <p className="text-gray-800"><strong>Phone:</strong> {selectedCustomer.phoneNumber}</p>
            <p className="text-gray-800"><strong>Pending Payment:</strong> {selectedCustomer.pendingPayment ? 'Yes' : 'No'}</p>
            <p className="text-gray-800"><strong>Pending Amount:</strong> ₹{selectedCustomer.pendingPaymentAmount}</p>
            <p className="text-gray-800"><strong>Total Amount Paid:</strong> ₹{selectedCustomer.totalAmountPaid}</p>
            <p className="text-gray-800"><strong>Loan Provided:</strong> ₹{selectedCustomer.loanProvided}</p>
            <p className="text-gray-800"><strong>Loan Approved Date:</strong> {selectedCustomer.loanApprovedDate ? new Date(selectedCustomer.loanApprovedDate).toLocaleString() : 'N/A'}</p>
            <p className="text-gray-800"><strong>Waste Records:</strong></p>
            <ul className="list-disc list-inside text-gray-800">
              {selectedCustomer.wasteRecords.map((record, index) => (
                <li key={index}>
                  Hen Waste: {record.henwaste}, Cattle Waste: {record.cattlewaste}, Sheep Waste: {record.sheepwaste}, Neem Plantation: {record.neemPlantation}, Date: {new Date(record.dateAdded).toLocaleDateString()}
                </li>
              ))}
            </ul>
            <div className="text-right mt-4">
              <button onClick={closeModal} className="btn btn-error">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaidCustomers;
