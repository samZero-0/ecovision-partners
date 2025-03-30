'use client';

import React, { useContext, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DollarSign, HeartHandshake, Target, ArrowUp } from 'lucide-react';
import { AuthContext } from '@/providers/AuthProvider';


interface Donation {
  _id: string;
  paymentIntentId: string;
  amount: number;
  organizationId: string;
  frequency: string;
  donorEmail: string;
  donorName: string;
  createdAt: string;
  status: 'completed' | 'pending' | 'failed';
}

const MyDonations: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch('https://ecovision-backend-five.vercel.app/donations');
        const data = await response.json();
        
        if (data.success) {
          // Filter donations to only show those from the current user
          const userDonations = data.donations.filter(
            (donation: Donation) => donation.donorEmail === user?.email
          );
          setDonations(userDonations);
        } else {
          setError('Failed to fetch donations');
        }
      } catch (err) {
        setError('Error fetching donations');
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchDonations();
    }
  }, [user?.email]);

  const totalDonated = donations.reduce((sum, donation) => 
    donation.status === 'completed' ? sum + donation.amount : sum, 0);
  
  const filteredDonations = activeFilter === 'all' 
    ? donations 
    : donations.filter(donation => donation.status === activeFilter);
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return null;
    }
  };

  const getOrganizationName = (id: string) => {
    // You might want to replace this with actual organization names
    switch(id) {
      case '1': return 'Global Relief Foundation';
      case '2': return 'Children Education Fund';
      case '3': return 'Wildlife Conservation';
      default: return `Organization ${id}`;
    }
  };

  const getCauseFromOrganization = (id: string) => {
    switch(id) {
      case '1': return 'Disaster Relief';
      case '2': return 'Education';
      case '3': return 'Environment';
      default: return 'General Cause';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className='flex flex-col gap-3'>
          <h1 className="text-2xl font-bold">My Donations</h1>
          <h3>Welcome back, {user?.displayName || user?.email}</h3>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              activeFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setActiveFilter('completed')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              activeFilter === 'completed' ? 'bg-green-600 text-white' : 'bg-gray-200'
            }`}
          >
            Completed
          </button>
          <button 
            onClick={() => setActiveFilter('pending')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              activeFilter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200'
            }`}
          >
            Pending
          </button>
          <button 
            onClick={() => setActiveFilter('failed')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              activeFilter === 'failed' ? 'bg-red-600 text-white' : 'bg-gray-200'
            }`}
          >
            Failed
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Donated Card */}
            <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Total Donated
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-green-50">
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-semibold">${totalDonated.toLocaleString()}</p>
                  <p className="text-sm text-green-600 font-medium flex items-center">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    {donations.length > 0 ? '12.5%' : '0%'}
                  </p>
                </div>
                <p className="text-xs text-gray-400 mt-1">All-time contributions</p>
              </CardContent>
            </Card>

            {/* Donations Made Card */}
            <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Donations Made
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-blue-50">
                    <HeartHandshake className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-semibold">
                    {donations.filter(d => d.status === 'completed').length}
                  </p>
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="h-6 w-6 rounded-full bg-blue-100 border-2 border-white" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">Successful transactions</p>
              </CardContent>
            </Card>

            {/* Goal Progress Card */}
            <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Yearly Goal
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-purple-50">
                    <Target className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-3xl font-semibold">
                      {Math.round((totalDonated / 1000) * 100)}%
                    </p>
                    <p className="text-sm text-gray-500">
                      ${totalDonated.toLocaleString()}/$1,000
                    </p>
                  </div>
                  <Progress 
                    value={(totalDonated / 1000) * 100} 
                    className="h-2.5 bg-gray-100"
                    indicatorColor="bg-purple-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Annual target</span>
                    <span>{Math.round((1000 - totalDonated) / 100)} months remaining</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-4 md:grid md:grid-cols-2 grid-cols-1 gap-4">
            {filteredDonations.length === 0 ? (
              <p className="text-center text-gray-500 py-8 col-span-2">
                {donations.length === 0 ? 'You have no donations yet.' : 'No donations match the current filter.'}
              </p>
            ) : (
              filteredDonations.map(donation => (
                <Card key={donation._id} className="overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{getOrganizationName(donation.organizationId)}</h3>
                        <p className="text-gray-500">{getCauseFromOrganization(donation.organizationId)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl">${donation.amount}</p>
                        <p className="text-gray-500 text-sm">
                          {new Date(donation.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      {getStatusBadge(donation.status)}
                      
                      <p className="text-sm text-gray-600 font-medium">
                        {donation.frequency === 'one-time' ? 'One-time donation' : 'Recurring donation'}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MyDonations;