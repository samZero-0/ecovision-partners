"use client";

import React, { useState, useEffect, useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Download, ChevronDown, DollarSign, TrendingUp, Users, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { AuthContext } from '@/providers/AuthProvider';

const Donations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [donationData, setDonationData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch donation data from the API
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://ecovision-backend-five.vercel.app/donations');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.donations) {
          // Transform API data to match the format expected by the UI
          const formattedDonations = data.donations.map((donation, index) => ({
            id: donation._id || index,
            donor: donation.donorName || 'Anonymous',
            email: donation.donorEmail || 'anonymous',
            amount: donation.amount || 0,
            date: new Date(donation.createdAt).toISOString().split('T')[0],
            campaign: donation.organizationId ? `Campaign ${donation.organizationId}` : 'General Fund',
            status: donation.status || 'Pending',
            frequency: donation.frequency || 'one-time'
          }));
          
          setDonationData(formattedDonations);
        } else {
          throw new Error('No donation data available');
        }
      } catch (err) {
        console.error('Error fetching donation data:', err);
        setError(err.message);
        // Use mock data as fallback if API fails
        setDonationData([
          { id: 1, donor: 'John Smith', email: 'john@example.com', amount: 250, date: '2025-03-25', campaign: 'Spring Drive', status: 'Completed' },
          { id: 2, donor: 'Alice Johnson', email: 'alice@example.com', amount: 1000, date: '2025-03-24', campaign: 'Building Fund', status: 'Completed' },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonations();
  }, []);

  // Filter donations based on search term
  const filteredDonations = donationData.filter(donation => 
    donation.donor.toLowerCase().includes(searchTerm.toLowerCase()) || 
    donation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donation.campaign.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calculate statistics based on the actual donation data
  const totalDonations = donationData.reduce((sum, donation) => sum + donation.amount, 0);
  const avgDonation = donationData.length > 0 ? totalDonations / donationData.length : 0;
  const totalDonors = new Set(donationData.map(d => d.email)).size;
  

  // Calculate donations in the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentDonations = donationData.filter(d => new Date(d.date) >= thirtyDaysAgo);
  const recentTotal = recentDonations.reduce((sum, d) => sum + d.amount, 0);

  // Generate monthly data based on actual donations
  const generateMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTotals = Array(12).fill(0);
    
    donationData.forEach(donation => {
      const date = new Date(donation.date);
      const monthIndex = date.getMonth();
      monthlyTotals[monthIndex] += donation.amount;
    });
    
    return months.map((name, index) => ({
      name,
      amount: monthlyTotals[index]
    }));
  };

  // Generate campaign data based on actual donations
  const generateCampaignData = () => {
    const campaigns = {};
    
    donationData.forEach(donation => {
      const campaign = donation.campaign;
      if (!campaigns[campaign]) {
        campaigns[campaign] = 0;
      }
      campaigns[campaign] += donation.amount;
    });
    
    return Object.entries(campaigns).map(([name, amount]) => ({
      name,
      amount
    }));
  };

  const monthlyData = generateMonthlyData();
  const campaignData = generateCampaignData();
  
  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 flex justify-center items-center h-screen">
        <p>Loading donation data...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Donations</h1>
      
      {error && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-100 text-red-700 rounded-lg text-sm sm:text-base">
          <p>Error loading donation data: {error}</p>
          <p>Showing fallback data.</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <Card className="w-full">
          <CardContent className="p-4 sm:p-6 flex items-center space-x-3 sm:space-x-4">
            <div className="p-2 bg-green-100 rounded-full">
              <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Total Donations</p>
              <h3 className="text-xl sm:text-2xl font-bold">${totalDonations.toLocaleString()}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="w-full">
          <CardContent className="p-4 sm:p-6 flex items-center space-x-3 sm:space-x-4">
            <div className="p-2 bg-blue-100 rounded-full">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Average Donation</p>
              <h3 className="text-xl sm:text-2xl font-bold">${avgDonation.toFixed(2)}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="w-full">
          <CardContent className="p-4 sm:p-6 flex items-center space-x-3 sm:space-x-4">
            <div className="p-2 bg-purple-100 rounded-full">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Total Donors</p>
              <h3 className="text-xl sm:text-2xl font-bold">{totalDonors}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="w-full">
          <CardContent className="p-4 sm:p-6 flex items-center space-x-3 sm:space-x-4">
            <div className="p-2 bg-amber-100 rounded-full">
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Last 30 Days</p>
              <h3 className="text-xl sm:text-2xl font-bold">+${recentTotal.toLocaleString()}</h3>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Monthly Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Donations by Campaign</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaignData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  <Bar dataKey="amount" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <CardTitle className="text-lg sm:text-xl">Recent Donations</CardTitle>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search donors, emails, campaigns..."
              className="w-full sm:w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 border-b text-sm sm:text-base">
                  <th className="pb-3 px-2 sm:px-4">Donor</th>
                  <th className="pb-3 px-2 sm:px-4 hidden sm:table-cell">Email</th>
                  <th className="pb-3 px-2 sm:px-4">Amount</th>
                  <th className="pb-3 px-2 sm:px-4 hidden md:table-cell">Date</th>
                  <th className="pb-3 px-2 sm:px-4 hidden lg:table-cell">Campaign</th>
                  <th className="pb-3 px-2 sm:px-4">Status</th>
                  <th className="pb-3 px-2 sm:px-4 hidden xl:table-cell">Frequency</th>
                  <th className="pb-3 px-2 sm:px-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredDonations.length > 0 ? (
                  filteredDonations.map((donation) => (
                    <tr key={donation.id} className="border-b hover:bg-gray-50 text-sm sm:text-base">
                      <td className="py-3 px-2 sm:px-4">{donation.donor}</td>
                      <td className="py-3 px-2 sm:px-4 text-gray-500 hidden sm:table-cell">{donation.email}</td>
                      <td className="py-3 px-2 sm:px-4 font-medium">${donation.amount.toLocaleString()}</td>
                      <td className="py-3 px-2 sm:px-4 text-gray-500 hidden md:table-cell">{donation.date}</td>
                      <td className="py-3 px-2 sm:px-4 hidden lg:table-cell">{donation.campaign}</td>
                      <td className="py-3 px-2 sm:px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          donation.status.toLowerCase() === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {donation.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 sm:px-4 hidden xl:table-cell">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {donation.frequency}
                        </span>
                      </td>
                      <td className="py-3 px-2 sm:px-4">
                        <button className="text-blue-600 hover:text-blue-800">
                          <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="py-4 px-4 text-center text-gray-500 text-sm sm:text-base">
                      No donations found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base">
          <Download className="h-4 w-4" />
          <span>Export Data</span>
        </button>
      </div>
    </div>
  );
};

export default Donations;