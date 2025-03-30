"use client"

import React, { useState, useEffect, useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    HeartHandshake, Globe, School, PawPrint, 
    Calendar, Repeat, Gift, ShieldCheck, 
    BadgeCheck, Leaf, Activity, Zap,
    Users, MessageSquare, User
  } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { AuthContext } from '@/providers/AuthProvider';

// Replace with your Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');


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

// Separate checkout form component to use Stripe hooks
// This is an excerpt that needs to be updated in your CheckoutForm component

const CheckoutForm = ({ 
  selectedOrg, 
  amount, 
  frequency, 
  organizations,
  processing,
  setProcessing,
  setPaymentCompleted
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const {user} = useContext(AuthContext);
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }

    setProcessing(true);
    
    try {
      // First, create a payment intent on the server
      const response = await fetch('https://ecovision-backend-five.vercel.app/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          organizationId: selectedOrg,
          frequency
        }),
      });
      
      const { clientSecret, success, error: paymentIntentError } = await response.json();
      
      if (!success || paymentIntentError) {
        setError(paymentIntentError || 'Failed to create payment');
        setProcessing(false);
        return;
      }
      
      // Confirm the payment with the card element
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user?.displayName // In a real app, collect this from the user
          },
        }
      });

      if (confirmError) {
        setError(confirmError.message);
        setProcessing(false);
        return;
      }

      // Payment succeeded, now record the donation
      const donationResult = await fetch('https://ecovision-backend-five.vercel.app/donation-success', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          amount,
          organizationId: selectedOrg,
          frequency,
          donorName: user?.displayName, // In a real app, collect this from the user
          donorEmail: user?.email // In a real app, collect this from the user
        }),
      });
      
      const { success: donationSuccess } = await donationResult.json();
      
      if (donationSuccess) {
        setProcessing(false);
        setPaymentCompleted(true);
      } else {
        // Payment was successful but recording failed
        setError('Payment successful but there was an issue recording your donation.');
        setProcessing(false);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('An unexpected error occurred. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border rounded-lg p-4">
        <CardElement 
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      
      <Button
        type="submit"
        className="w-full"
        disabled={!stripe || !selectedOrg || !amount || processing}
      >
        {processing ? 'Processing...' : `Donate ${frequency === 'monthly' ? 'Monthly' : 'Now'}`}
      </Button>
    </form>
  );
};

const DonateNow: React.FC = () => {
  const organizations: Organization[] = [
    {
      id: '1',
      name: 'Global Relief Foundation',
      description: 'Providing emergency relief to disaster-affected communities worldwide.',
      image: 'https://philea.eu/wp-content/uploads/2021/12/SNF-Global-Relief-Initiative.jpg',
      causes: ['Disaster Relief', 'Humanitarian Aid', 'Medical Support'],
      impact: 'Helped 1.2M people last year',
      rating: 4.9
    },
    {
      id: '2',
      name: 'Children Education Fund',
      description: 'Supporting education for underprivileged children globally.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRegbm2YCF1WvIKNTMMuuOdixfYRl6XfsIw3Elg8MGCI1NBu6q9YlFDu1El_OYlaa5BHJo&usqp=CAU',
      causes: ['Education', 'Child Welfare', 'Community Development'],
      impact: 'Built 42 schools last year',
      rating: 4.8
    },
    {
      id: '3',
      name: 'Wildlife Conservation',
      description: 'Protecting endangered species and preserving natural habitats.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjkzkaSI3AaKWVUqy9NWE9smYejXcgXuppAA&s',
      causes: ['Environment', 'Animal Welfare', 'Research'],
      impact: 'Protected 15 endangered species',
      rating: 4.7
    },
    
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
  const [processing, setProcessing] = useState<boolean>(false);
  const [paymentCompleted, setPaymentCompleted] = useState<boolean>(false);
  
  
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
  
  const getOrgIcon = (causes: string[]) => {
    if (causes.includes('Disaster Relief')) return <Globe className="h-5 w-5" />;
    if (causes.includes('Education')) return <School className="h-5 w-5" />;
    if (causes.includes('Animal Welfare')) return <PawPrint className="h-5 w-5" />;
    return <HeartHandshake className="h-5 w-5" />;
  };

  const resetForm = () => {
    setSelectedOrg('');
    setAmount('');
    setCustomAmount(false);
    setFrequency('one-time');
    setPaymentCompleted(false);
  };

  return (
    <div className="space-y-8 mx-auto px-4 py-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Donate Now</h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Make a Difference Today
        </p>
      </div>
      
      {paymentCompleted ? (
        <Card className="border-0 shadow-sm p-8 max-w-md mx-auto">
          <div className="text-center space-y-4">
            <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center">
              <ShieldCheck className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold">Thank You!</h2>
            <p className="text-gray-600">
              Your {frequency} donation of ${amount} to {organizations.find(org => org.id === selectedOrg)?.name} has been processed successfully.
            </p>
            <p className="text-sm text-gray-500">
              A receipt has been sent to your email.
            </p>
            <Button onClick={resetForm} className="mt-4">
              Make Another Donation
            </Button>
          </div>
        </Card>
      ) : (
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
                      type="button"
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
                      type="button"
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
                        type="button"
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
                
                <Elements stripe={stripePromise}>
                  <CheckoutForm
                    selectedOrg={selectedOrg}
                    amount={amount}
                    frequency={frequency}
                    organizations={organizations}
                    processing={processing}
                    setProcessing={setProcessing}
                    setPaymentCompleted={setPaymentCompleted}
                  />
                </Elements>
                
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
      )}
    </div>
  );
};

export default DonateNow;