'use client';

import React, { useContext, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DollarSign, HeartHandshake, Target, ArrowUp } from 'lucide-react';
import { AuthContext } from '@/providers/AuthProvider';
interface Donation {
  id: string;
  organization: string;
  cause: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'recurring';
  impact?: string;
}

const MyDonations: React.FC = () => {

const {user} = useContext(AuthContext)



  const [donations, setDonations] = useState<Donation[]>([
    {
      id: '1',
      organization: 'Global Relief Foundation',
      cause: 'Disaster Relief',
      amount: 150,
      date: '2025-02-15',
      status: 'completed',
      impact: 'Provided emergency supplies to 3 families'
    },
    {
      id: '2',
      organization: 'Children Education Fund',
      cause: 'Education',
      amount: 75,
      date: '2025-03-01',
      status: 'recurring',
      impact: "Supporting 1 child's education for a month"
    },
    {
      id: '3',
      organization: 'Wildlife Conservation',
      cause: 'Environment',
      amount: 100,
      date: '2025-03-20',
      status: 'pending'
    },
   
  ]);
  
  const [activeFilter, setActiveFilter] = useState('all');
  
  const totalDonated = donations.reduce((sum, donation) => 
    donation.status !== 'pending' ? sum + donation.amount : sum, 0);
  
  const filteredDonations = activeFilter === 'all' 
    ? donations 
    : donations.filter(donation => donation.status === activeFilter);
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'recurring':
        return <Badge className="bg-blue-500">Recurring</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className='flex flex-col gap-3'>
        <h1 className="text-2xl font-bold">My Donations</h1>
        <h3>Welcom back, {user?.displayName}</h3>
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
            onClick={() => setActiveFilter('recurring')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              activeFilter === 'recurring' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Recurring
          </button>
          <button 
            onClick={() => setActiveFilter('pending')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              activeFilter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200'
            }`}
          >
            Pending
          </button>
        </div>
      </div>
      
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
          12.5%
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
          <p className="text-center text-gray-500 py-8">No donations found.</p>
        ) : (
          filteredDonations.map(donation => (
            <Card key={donation.id} className="overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{donation.organization}</h3>
                    <p className="text-gray-500">{donation.cause}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl">${donation.amount}</p>
                    <p className="text-gray-500 text-sm">{new Date(donation.date).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  {getStatusBadge(donation.status)}
                  
                  {donation.impact && (
                    <p className="text-sm text-gray-600 font-medium">
                      Impact: {donation.impact}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MyDonations;