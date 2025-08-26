import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import RecentCustomers from './RecentPage';
import PaidCustomers from './TopSellersPAge';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Static waste costs
  const [wasteCosts] = useState({
    henwasteCost: 300,      // ₹
    cattlewasteCost: 600,   // ₹
    sheepwasteCost: 800,    // ₹
    neemPlantationCost: 900 // ₹
  });

  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    setIsSearching(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('No token found. Please log in.');
        setSearchResults(null);
        setIsSearching(false);
        return;
      }

      const response = await axios.get(
        `/api/customers/search/${searchQuery}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSearchResults(response.data);
      setErrorMessage('');
    } catch (error) {
      if (error.response?.status === 404) {
        setErrorMessage('Customer not found');
      } else if (error.response?.status === 401) {
        setErrorMessage('Unauthorized. Please log in.');
      } else {
        setErrorMessage('Something went wrong. Please try again later.');
      }
      setSearchResults(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLoanClick = (loanType) => {
    navigate(`/loan/${loanType}`);
  };

  const loans = [
    { type: 'Sheep Loan', icon: '/download.jpg' },
    { type: 'Poultry Loan', icon: '/images.jpg' },
    { type: 'Cattle Loan', icon: '/images (1).jpg' },
    { type: 'Crop Loan', icon: '/images (2).jpg' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-start p-8">
      {isSearching && (
        <div className="absolute inset-0 bg-gray-800 opacity-50 z-10"></div>
      )}

      {/* Add Customer and Search */}
      <div className="w-full flex justify-center space-x-4 mb-8 mt-10">
        <Link to="/add-customer">
          <button className="btn btn-accent w-full md:w-48 text-white rounded-lg shadow-lg hover:bg-accent-focus transition-all ease-in-out duration-200">
            Add Customer
          </button>
        </Link>
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="Search by phone or email"
            className="input input-bordered w-full py-3 px-4 rounded-lg text-black focus:ring-2 focus:ring-indigo-300 transition-all"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setIsSearching(true)}
          />
          <button
            className="absolute top-0 right-0 btn btn-primary text-white rounded-lg px-4 py-2"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      {/* Search Results */}
      {isSearching && searchResults && (
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl p-6 mt-8 z-20 relative">
          <h3 className="text-2xl font-semibold text-center text-primary mb-4">
            Search Results
          </h3>
          <div className="p-4 bg-white shadow-lg rounded-lg">
            <h4 className="text-xl font-bold text-primary">{searchResults.name}</h4>
            <p className="text-gray-700">Email: {searchResults.email}</p>
            <p className="text-gray-700">Phone: {searchResults.phoneNumber}</p>
            <p className="text-gray-700">
              Pending Payment: {searchResults.pendingPayment ? 'Yes' : 'No'}
            </p>
          </div>
        </div>
      )}

      {/* Static Waste Costs Boxes */}
      <div className="w-full flex flex-wrap justify-center gap-6 mt-8 mb-8">
        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md w-48 h-32">
          <h5 className="text-lg font-semibold text-gray-700">Hen Waste</h5>
          <p className="text-2xl font-bold text-indigo-600 mt-2">{wasteCosts.henwasteCost} ₹/kg</p>
        </div>
        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md w-48 h-32">
          <h5 className="text-lg font-semibold text-gray-700">Cattle Waste</h5>
          <p className="text-2xl font-bold text-indigo-600 mt-2">{wasteCosts.cattlewasteCost} ₹/kg</p>
        </div>
        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md w-48 h-32">
          <h5 className="text-lg font-semibold text-gray-700">Sheep Waste</h5>
          <p className="text-2xl font-bold text-indigo-600 mt-2">{wasteCosts.sheepwasteCost} ₹/kg</p>
        </div>
        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md w-48 h-32">
          <h5 className="text-lg font-semibold text-gray-700">Neem Plantation</h5>
          <p className="text-2xl font-bold text-indigo-600 mt-2">{wasteCosts.neemPlantationCost} ₹/kg</p>
        </div>
      </div>

      {/* Recent and Paid Customers */}
      {!isSearching && !searchResults && (
        <div className="w-full flex flex-col items-center space-y-8 mt-12">
          <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg">
            <RecentCustomers />
          </div>

          <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg">
            <PaidCustomers />
          </div>
        </div>
      )}

      {/* Loan Options */}
      <div className="w-full flex flex-wrap justify-center gap-8 mt-12 mb-8">
        {loans.map((loan) => (
          <div
            key={loan.type}
            className="flex flex-col items-center p-6 bg-white rounded-lg shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 w-60 h-72"
          >
            <img
              src={loan.icon}
              alt={`${loan.type} icon`}
              className="w-24 h-24 mb-4 rounded-full shadow-md"
            />
            <h4 className="text-xl font-semibold text-center text-primary">
              {loan.type}
            </h4>
            <button
              onClick={() => handleLoanClick(loan.type)}
              className="btn btn-accent text-white mt-6 px-6 py-2 rounded-lg hover:bg-accent-focus transition-all duration-200"
            >
              Need Loan
            </button>
          </div>
        ))}
      </div>

      <div className="w-full max-w-xs mt-8 flex justify-center">
        <Link to="/check-loan-status">
          <button className="btn btn-primary w-full text-white rounded-lg shadow-lg hover:bg-primary-focus transition-all">
            Check Loan Status
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
