"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Download, ChevronDown, DollarSign, TrendingUp, Users, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

// Mock donation data
const donationData = [
  { id: 1, donor: 'John Smith', email: 'john@example.com', amount: 250, date: '2025-03-25', campaign: 'Spring Drive', status: 'Completed' },
  { id: 2, donor: 'Alice Johnson', email: 'alice@example.com', amount: 1000, date: '2025-03-24', campaign: 'Building Fund', status: 'Completed' },
  { id: 3, donor: 'Robert Wilson', email: 'robert@example.com', amount: 75, date: '2025-03-22', campaign: 'Spring Drive', status: 'Completed' },
  { id: 4, donor: 'Emily Davis', email: 'emily@example.com', amount: 500, date: '2025-03-20', campaign: 'General Fund', status: 'Completed' },
  { id: 5, donor: 'Michael Brown', email: 'michael@example.com', amount: 150, date: '2025-03-19', campaign: 'Building Fund', status: 'Completed' },
  { id: 6, donor: 'Sarah Miller', email: 'sarah@example.com', amount: 300, date: '2025-03-18', campaign: 'Spring Drive', status: 'Completed' },
  { id: 7, donor: 'David Garcia', email: 'david@example.com', amount: 450, date: '2025-03-15', campaign: 'General Fund', status: 'Completed' },
];

// Chart data
const monthlyData = [
  { name: 'Jan', amount: 12400 },
  { name: 'Feb', amount: 14800 },
  { name: 'Mar', amount: 18650 },
  { name: 'Apr', amount: 16500 },
  { name: 'May', amount: 20100 },
  { name: 'Jun', amount: 22300 },
];

const campaignData = [
  { name: 'General Fund', amount: 25400 },
  { name: 'Building Fund', amount: 18900 },
  { name: 'Spring Drive', amount: 15600 },
  { name: 'Emergency Relief', amount: 9800 },
  { name: 'Youth Programs', amount: 12300 },
];

const Donations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredDonations = donationData.filter(donation => 
    donation.donor.toLowerCase().includes(searchTerm.toLowerCase()) || 
    donation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donation.campaign.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalDonations = donationData.reduce((sum, donation) => sum + donation.amount, 0);
  const avgDonation = totalDonations / donationData.length;
  const totalDonors = new Set(donationData.map(d => d.email)).size;
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Donations</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-2 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Donations</p>
              <h3 className="text-2xl font-bold">${totalDonations.toLocaleString()}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Donation</p>
              <h3 className="text-2xl font-bold">${avgDonation.toFixed(2)}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-2 bg-purple-100 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Donors</p>
              <h3 className="text-2xl font-bold">{totalDonors}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-2 bg-amber-100 rounded-full">
              <Calendar className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Last 30 Days</p>
              <h3 className="text-2xl font-bold">+${donationData.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}</h3>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Donations by Campaign</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={campaignData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                <Bar dataKey="amount" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
          </Card>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Donations</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search donors, emails, campaigns..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-3 px-4">Donor</th>
                  <th className="pb-3 px-4">Email</th>
                  <th className="pb-3 px-4">Amount</th>
                  <th className="pb-3 px-4">Date</th>
                  <th className="pb-3 px-4">Campaign</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredDonations.map((donation) => (
                  <tr key={donation.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">{donation.donor}</td>
                    <td className="py-4 px-4 text-gray-500">{donation.email}</td>
                    <td className="py-4 px-4 font-medium">${donation.amount.toLocaleString()}</td>
                    <td className="py-4 px-4 text-gray-500">{donation.date}</td>
                    <td className="py-4 px-4">{donation.campaign}</td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {donation.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button className="text-blue-600 hover:text-blue-800">
                        <ChevronDown className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          <Download className="h-4 w-4" />
          <span>Export Data</span>
        </button>
      </div>
    </div>
  );
};

export default Donations;