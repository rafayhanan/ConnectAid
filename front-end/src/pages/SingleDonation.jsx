import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SingleDonation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appeal, setAppeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [message, setMessage] = useState('');
  const [showDonateForm, setShowDonateForm] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [addFundsAmount, setAddFundsAmount] = useState('');

  useEffect(() => {
    const fetchAppealAndWallet = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const [appealResponse, walletResponse] = await Promise.all([
          axios.get(`/api/users/donation-appeals/${id}`),
          token ? axios.get('/api/users/wallet', {
            headers: { Authorization: `Bearer ${token}` }
          }) : Promise.resolve({ data: { balance: 0 } })
        ]);
        
        setAppeal(appealResponse.data);
        setWalletBalance(walletResponse.data.balance);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchAppealAndWallet();
  }, [id]);

  const handleAddFunds = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post('/api/users/wallet/add', 
        { amount: Number(addFundsAmount) },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setWalletBalance(response.data.balance);
      setAddFundsAmount('');
    } catch (err) {
      setError(err.response?.data?.message);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-image.jpg'; // Replace with your placeholder image
    
    // If the path already starts with http/https, return as is
    if (imagePath.startsWith('http')) return imagePath;
    
    // Remove any leading slashes and combine with your backend URL
    const cleanPath = imagePath.replace(/^\/+/, '');
    // Use your backend URL (adjust if different)
    return `${window.location.origin}/${cleanPath}`;
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    
    if (Number(donationAmount) > walletBalance) {
      setError('Insufficient wallet balance');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.post('/api/users/donate', {
        appealId: id,
        amount: Number(donationAmount),
        message
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAppeal(prev => ({
        ...prev,
        raised: prev.raised + Number(donationAmount)
      }));
      
      setWalletBalance(prev => prev - Number(donationAmount));
      setShowDonateForm(false);
      setDonationAmount('');
      setMessage('');
    } catch (err) {
      setError(err.response?.data?.message || 'Donation failed');
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;
  if (!appeal) return <div className="text-center mt-8">Donation not found</div>;

  const progressPercentage = (appeal.raised / appeal.goal) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {appeal.image && (
        <div className="mb-8 rounded-lg overflow-hidden h-96">
          <img 
            src={getImageUrl(appeal.image)} 
            alt={appeal.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-4">{appeal.title}</h1>
        
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Raised: PKR {appeal.raised}</span>
            <span className="text-gray-600">Goal: PKR {appeal.goal}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {progressPercentage.toFixed(1)}% of goal reached
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">About this cause</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{appeal.description}</p>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Your Wallet Balance: PKR {walletBalance}</h3>
          <form onSubmit={handleAddFunds} className="flex gap-2">
            <input
              type="number"
              value={addFundsAmount}
              onChange={(e) => setAddFundsAmount(e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="Amount to add"
              min="1"
            />
            <button 
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Add Funds
            </button>
          </form>
        </div>

        {!showDonateForm ? (
          <button
            onClick={() => setShowDonateForm(true)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Donate Now
          </button>
        ) : (
          <form onSubmit={handleDonate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Amount (PKR)
              </label>
              <input
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter amount"
                required
                min="1"
                max={walletBalance}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Leave a message of support"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Confirm Donation
              </button>
              <button
                type="button"
                onClick={() => setShowDonateForm(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SingleDonation;