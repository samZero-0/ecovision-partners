"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    HeartHandshake, Globe, School, PawPrint, 
    Calendar, Repeat, Gift, ShieldCheck, 
    BadgeCheck, Leaf, Activity, Zap,
    Users, MessageSquare, User
  } from 'lucide-react';

interface Organization {
  id: string;
  name: string;
  description: string;
  image: string;
  causes: string[];
  impact: string;
  rating: number;
}

interface DonationAmount {
  value: number;
  label: string;
  popular?: boolean;
}

const DonateNow: React.FC = () => {
  const organizations: Organization[] = [
    {
      id: '1',
      name: 'Global Relief Foundation',
      description: 'Providing emergency relief to disaster-affected communities worldwide.',
      image: '/api/placeholder/180/100',
      causes: ['Disaster Relief', 'Humanitarian Aid', 'Medical Support'],
      impact: 'Helped 1.2M people last year',
      rating: 4.9
    },
    {
      id: '2',
      name: 'Children Education Fund',
      description: 'Supporting education for underprivileged children globally.',
      image: '/api/placeholder/180/100',
      causes: ['Education', 'Child Welfare', 'Community Development'],
      impact: 'Built 42 schools last year',
      rating: 4.8
    },
    {
      id: '3',
      name: 'Wildlife Conservation',
      description: 'Protecting endangered species and preserving natural habitats.',
      image: '/api/placeholder/180/100',
      causes: ['Environment', 'Animal Welfare', 'Research'],
      impact: 'Protected 15 endangered species',
      rating: 4.7
    }
  ];
  
  const predefinedAmounts: DonationAmount[] = [
    { value: 25, label: '$25' },
    { value: 50, label: '$50' },
    { value: 100, label: '$100', popular: true },
    { value: 250, label: '$250' },
    { value: 500, label: '$500' },
    { value: 1000, label: '$1,000' }
  ];
  
  const [selectedOrg, setSelectedOrg] = useState<string>('');
  const [amount, setAmount] = useState<number | ''>('');
  const [customAmount, setCustomAmount] = useState<boolean>(false);
  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  
  const handleAmountSelect = (value: number) => {
    setAmount(value);
    setCustomAmount(false);
  };
  
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
      setAmount(value === '' ? '' : parseFloat(value));
    }
  };
  
  const handleDonate = () => {
    // Handle donation logic here
    console.log({
      organization: selectedOrg,
      amount,
      frequency
    });
    
    // Reset form or show confirmation
    alert(`Thank you for your ${frequency} donation of $${amount} to ${organizations.find(org => org.id === selectedOrg)?.name}`);
  };
  
  const getOrgIcon = (causes: string[]) => {
    if (causes.includes('Disaster Relief')) return <Globe className="h-5 w-5" />;
    if (causes.includes('Education')) return <School className="h-5 w-5" />;
    if (causes.includes('Animal Welfare')) return <PawPrint className="h-5 w-5" />;
    return <HeartHandshake className="h-5 w-5" />;
  };

  return (
    <div className="space-y-8 mx-auto px-4 py-8">
      <div className=" space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Donate Now</h1>
        <p className="text-lg text-gray-600 max-w-2xl ">
        Make a Difference Today
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Organizations List */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <HeartHandshake className="h-5 w-5 text-pink-500" />
                <span>Select Organization</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {organizations.map(org => (
                <div 
                  key={org.id}
                  className={`p-5 border rounded-xl cursor-pointer transition-all ${
                    selectedOrg === org.id 
                      ? 'border-blue-500 bg-blue-50 shadow-sm' 
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                  }`}
                  onClick={() => setSelectedOrg(org.id)}
                >
                  <div className="flex gap-4">
                    <div className="shrink-0 relative">
                      <img 
                        src={org.image} 
                        alt={org.name} 
                        className="w-16 h-16 object-cover rounded-lg border" 
                      />
                      <div className="absolute -bottom-2 -right-2 bg-white p-1 rounded-full border">
                        {getOrgIcon(org.causes)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg">{org.name}</h3>
                        <div className="flex items-center bg-green-50 px-2 py-1 rounded-full text-sm">
                          <BadgeCheck className="h-4 w-4 text-green-600 mr-1" />
                          {org.rating}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{org.description}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {org.causes.map(cause => (
                          <span 
                            key={cause} 
                            className="px-2.5 py-1 bg-gray-100 text-xs rounded-full flex items-center gap-1"
                          >
                            {cause === 'Environment' && <Leaf className="h-3 w-3" />}
                            {cause === 'Education' && <School className="h-3 w-3" />}
                            {cause === 'Animal Welfare' && <PawPrint className="h-3 w-3" />}
                            {cause}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                        <Activity className="h-4 w-4 text-blue-500" />
                        <span>{org.impact}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Impact Stats Section */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                <span>Your Impact</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-6 py-6">
              <div className="text-center">
                <div className="mx-auto bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-2">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <h4 className="font-bold text-xl">1,250+</h4>
                <p className="text-sm text-gray-500">Lives impacted</p>
              </div>
              <div className="text-center">
                <div className="mx-auto bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-2">
                  <School className="h-5 w-5 text-green-600" />
                </div>
                <h4 className="font-bold text-xl">42</h4>
                <p className="text-sm text-gray-500">Schools built</p>
              </div>
              <div className="text-center">
                <div className="mx-auto bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-2">
                  <Leaf className="h-5 w-5 text-purple-600" />
                </div>
                <h4 className="font-bold text-xl">15K+</h4>
                <p className="text-sm text-gray-500">Acres protected</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Donation Form */}
        <div className="space-y-6">
          <Card className="border-0 shadow-sm sticky top-6">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-blue-500" />
                <span>Donation Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <div>
                <label className="block text-sm font-medium mb-3">Donation Frequency</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setFrequency('one-time')}
                    className={`p-3 rounded-lg flex items-center justify-center gap-2 ${
                      frequency === 'one-time' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <Calendar className="h-4 w-4" />
                    One-time
                  </button>
                  <button
                    onClick={() => setFrequency('monthly')}
                    className={`p-3 rounded-lg flex items-center justify-center gap-2 ${
                      frequency === 'monthly' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <Repeat className="h-4 w-4" />
                    Monthly
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-3">Select Amount</label>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {predefinedAmounts.map(({ value, label, popular }) => (
                    <button
                      key={value}
                      onClick={() => handleAmountSelect(value)}
                      className={`p-3 text-center rounded-lg border relative ${
                        amount === value && !customAmount
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {label}
                      {popular && (
                        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                          POPULAR
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                
                <div className="mt-4">
                  <label className="flex items-center space-x-2 mb-3">
                    <input
                      type="checkbox"
                      checked={customAmount}
                      onChange={() => {
                        setCustomAmount(!customAmount);
                        if (!customAmount) setAmount('');
                      }}
                      className="rounded h-4 w-4"
                    />
                    <span className="text-sm">Custom amount</span>
                  </label>
                  
                  {customAmount && (
                    <div className="relative mt-1">
                      <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">$</span>
                      <input
                        type="text"
                        value={amount === '' ? '' : amount}
                        onChange={handleCustomAmountChange}
                        className="pl-8 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter amount"
                        autoFocus
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <Button
                onClick={handleDonate}
                disabled={!selectedOrg || amount === '' || amount <= 0}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
              >
                {amount ? `Donate $${amount} ${frequency === 'monthly' ? '/month' : ''}` : 'Select an amount'}
              </Button>
              
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <ShieldCheck className="h-5 w-5 text-green-600 shrink-0" />
                <p className="text-xs text-gray-500">
                  Your donation is secure and tax-deductible. We use 256-bit SSL encryption to protect your information.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Testimonials */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-500" />
                <span>Donor Stories</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-4">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Sarah J.</p>
                    <p className="text-sm text-gray-600">"Seeing the impact reports made me realize how much difference my monthly donation makes."</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Michael T.</p>
                    <p className="text-sm text-gray-600">"The transparency of where my money goes gives me confidence in my donations."</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DonateNow;