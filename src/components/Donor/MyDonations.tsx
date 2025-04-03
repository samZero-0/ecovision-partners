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
    switch(id) {
      case '1': return 'Global Relief';
      case '2': return 'Education Fund';
      case '3': return 'Wildlife';
      default: return `Org ${id}`;
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
    <div className="space-y-4 p-4">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <div className='flex flex-col gap-1'>
          <h1 className="text-xl font-bold">My Donations</h1>
          <h3 className="text-sm text-gray-600">Welcome back, {user?.displayName || user?.email?.split('@')[0]}</h3>
        </div>
        
        {/* Filter Buttons - Now scrollable for small screens */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          <button 
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
              activeFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setActiveFilter('completed')}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
              activeFilter === 'completed' ? 'bg-green-600 text-white' : 'bg-gray-200'
            }`}
          >
            Completed
          </button>
          <button 
            onClick={() => setActiveFilter('pending')}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
              activeFilter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200'
            }`}
          >
            Pending
          </button>
          <button 
            onClick={() => setActiveFilter('failed')}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
              activeFilter === 'failed' ? 'bg-red-600 text-white' : 'bg-gray-200'
            }`}
          >
            Failed
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards - Stacked on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-3  gap-4 mb-6">
            {/* Total Donated Card */}
            <Card className="border border-gray-100 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Donated
                  </CardTitle>
                  <div className="p-1.5 rounded-lg bg-green-50">
                    <DollarSign className="h-3.5 w-3.5 text-green-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-semibold">${totalDonated.toLocaleString()}</p>
                  <p className="text-xs text-green-600 font-medium flex items-center">
                    <ArrowUp className="h-2.5 w-2.5 mr-0.5" />
                    {donations.length > 0 ? '12.5%' : '0%'}
                  </p>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">All-time contributions</p>
              </CardContent>
            </Card>

            {/* Donations Made Card */}
            <Card className="border border-gray-100 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Donations Made
                  </CardTitle>
                  <div className="p-1.5 rounded-lg bg-blue-50">
                    <HeartHandshake className="h-3.5 w-3.5 text-blue-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-semibold">
                    {donations.filter(d => d.status === 'completed').length}
                  </p>
                  <div className="flex -space-x-1.5">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="h-5 w-5 rounded-full bg-blue-100 border-2 border-white" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">Successful transactions</p>
              </CardContent>
            </Card>

            {/* Goal Progress Card */}
            <Card className="border border-gray-100 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Yearly Goal
                  </CardTitle>
                  <div className="p-1.5 rounded-lg bg-purple-50">
                    <Target className="h-3.5 w-3.5 text-purple-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-2xl font-semibold">
                      {Math.round((totalDonated / 1000) * 100)}%
                    </p>
                    <p className="text-xs text-gray-500">
                      ${totalDonated.toLocaleString()}/$1,000
                    </p>
                  </div>
                  <Progress 
                    value={(totalDonated / 1000) * 100} 
                    className="h-1.5 bg-gray-100"
                    indicatorColor="bg-purple-600"
                  />
                  <div className="flex justify-between text-2xs text-gray-400">
                    <span>Annual target</span>
                    <span>{Math.round((1000 - totalDonated) / 100)} months left</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Donation Cards */}
          <div className="space-y-3 md:grid md:grid-cols-3 md:gap-4">
            {filteredDonations.length === 0 ? (
              <p className="text-center text-gray-500 py-8 text-sm">
                {donations.length === 0 ? 'You have no donations yet.' : 'No donations match the current filter.'}
              </p>
            ) : (
              filteredDonations.map(donation => (
                <Card key={donation._id} className="overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base truncate">{getOrganizationName(donation.organizationId)}</h3>
                        <p className="text-xs text-gray-500 truncate">{getCauseFromOrganization(donation.organizationId)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">${donation.amount}</p>
                        <p className="text-gray-500 text-xs">
                          {new Date(donation.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3 gap-2">
                      <div className="flex-shrink-0">
                        {getStatusBadge(donation.status)}
                      </div>
                      
                      <p className="text-xs text-gray-600 font-medium truncate">
                        {donation.frequency === 'one-time' ? 'One-time' : 'Recurring'}
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