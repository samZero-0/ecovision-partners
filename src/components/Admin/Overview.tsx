"use client"
import React, { useContext, useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '@/providers/AuthProvider';

const data = [
  { name: 'Jan', users: 400, donations: 2400, events: 8 },
  { name: 'Feb', users: 300, donations: 1398, events: 12 },
  { name: 'Mar', users: 200, donations: 9800, events: 10 },
  { name: 'Apr', users: 278, donations: 3908, events: 5 },
  { name: 'May', users: 189, donations: 4800, events: 7 },
  { name: 'Jun', users: 239, donations: 3800, events: 9 },
];

const Overview = () => {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [donations, setDonations] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    axios.get('https://ecovision-backend-five.vercel.app/users')
      .then(res => setUsers(res.data))
      .catch(error => console.error('Error fetching users:', error));

    axios.get('https://ecovision-backend-five.vercel.app/events')
      .then(res => setEvents(res.data))
      .catch(error => console.error('Error fetching events:', error));

    axios.get('https://ecovision-backend-five.vercel.app/donations')
      .then(res => {
        const donationsData = res.data.donations;
        setDonations(donationsData);
        const sum = donationsData.reduce((acc, donation) => acc + donation.amount, 0);
        setTotal(sum);
      })
      .catch(error => console.error('Error fetching donations:', error));
  }, []);

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <Card className="w-full">
          <CardContent className="p-4 sm:p-6 flex items-center space-x-3 sm:space-x-4">
            <div className="p-2 bg-blue-100 rounded-full">
              <User className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Total Users</p>
              <h3 className="text-xl sm:text-2xl font-bold">{users.length}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="w-full">
          <CardContent className="p-4 sm:p-6 flex items-center space-x-3 sm:space-x-4">
            <div className="p-2 bg-green-100 rounded-full">
              <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Total Donations</p>
              <h3 className="text-xl sm:text-2xl font-bold">{total}$</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="w-full">
          <CardContent className="p-4 sm:p-6 flex items-center space-x-3 sm:space-x-4">
            <div className="p-2 bg-purple-100 rounded-full">
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Total Events</p>
              <h3 className="text-xl sm:text-2xl font-bold">{events.length}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="w-full">
          <CardContent className="p-4 sm:p-6 flex items-center space-x-3 sm:space-x-4">
            <div className="p-2 bg-amber-100 rounded-full">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Growth Rate</p>
              <h3 className="text-xl sm:text-2xl font-bold">+12.5%</h3>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Activity Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#3b82f6" name="Users" />
                  <Bar dataKey="donations" fill="#10b981" name="Donations ($)" />
                  <Bar dataKey="events" fill="#8b5cf6" name="Events" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center p-2 border-b border-gray-100">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center mr-2 sm:mr-3">
                    {item % 3 === 0 ? (
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                    ) : item % 3 === 1 ? (
                      <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                    ) : (
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-medium">
                      {item % 3 === 0
                        ? 'New user registered'
                        : item % 3 === 1
                        ? 'New donation received'
                        : 'Event updated'}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">5 min ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;