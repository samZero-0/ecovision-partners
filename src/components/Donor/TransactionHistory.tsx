'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, ChevronUp, Download, ArrowDownUp, Search,
  CreditCard, Banknote, Wallet, AlertCircle, CheckCircle2,
  Clock, XCircle, Receipt, RefreshCw, FileText, Filter,
  Calendar as CalendarIcon, ArrowRight, MoreVertical, User
} from 'lucide-react';

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

const TransactionHistory: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Donation>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({
    start: '',
    end: ''
  });
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch('https://ecovision-backend-five.vercel.app/donations');
        const data = await response.json();
        if (data.success) {
          setDonations(data.donations);
        } else {
          setError('Failed to fetch donations');
        }
      } catch (err) {
        setError('Error fetching donations');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDonations();
  }, []);
  
  const handleSort = (field: keyof Donation) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const toggleRowExpanded = (id: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const filteredDonations = donations.filter(donation => {
    const matchesSearch = 
      donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.donorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.organizationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.paymentIntentId.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesDateRange = true;
    if (dateRange.start && dateRange.end) {
      const donationDate = new Date(donation.createdAt);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      matchesDateRange = donationDate >= startDate && donationDate <= endDate;
    }
    
    const matchesStatus = statusFilter === 'all' || donation.status === statusFilter;
    
    return matchesSearch && matchesDateRange && matchesStatus;
  });
  
  const sortedDonations = [...filteredDonations].sort((a, b) => {
    if (sortField === 'createdAt') {
      return sortDirection === 'asc' 
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    
    if (sortField === 'amount') {
      return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    }
    
    // For string values
    const aValue = String(a[sortField]).toLowerCase();
    const bValue = String(b[sortField]).toLowerCase();
    
    return sortDirection === 'asc'
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });
  
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 mr-1" />;
      case 'pending': return <Clock className="h-4 w-4 mr-1" />;
      case 'failed': return <XCircle className="h-4 w-4 mr-1" />;
      default: return null;
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

  const refreshData = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://ecovision-backend-five.vercel.app/donations');
      const data = await response.json();
      if (data.success) {
        setDonations(data.donations);
        setError(null);
      } else {
        setError('Failed to fetch donations');
      }
    } catch (err) {
      setError('Error fetching donations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Donation History</h1>
          <p className="text-sm text-gray-500">View and manage your donation history</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={refreshData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <Card>
        <CardHeader className="pb-0">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-600" />
              <span>Filter Donations</span>
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setSearchTerm('');
                setDateRange({ start: '', end: '' });
                setStatusFilter('all');
              }}
            >
              Clear All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative flex items-center md:mt-5">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search donations..."
                className="pl-10 pr-4 py-2 w-full border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <div className="w-full">
                <label className="block text-xs mb-1 font-medium">Date Range</label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="date"
                      className="w-full pl-10 pr-3 py-2 border rounded-lg"
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    />
                  </div>
                  <ArrowRight className="text-gray-400" />
                  <div className="relative flex-1">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="date"
                      className="w-full pl-10 pr-3 py-2 border rounded-lg"
                      value={dateRange.end}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-xs mb-1 font-medium">Status</label>
              <select
                className="w-full p-2 border rounded-lg"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      Date
                      <ArrowDownUp size={14} className="ml-1" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('donorName')}
                  >
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      Donor
                      <ArrowDownUp size={14} className="ml-1" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('organizationId')}
                  >
                    <div className="flex items-center">
                      Organization
                      <ArrowDownUp size={14} className="ml-1" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('amount')}
                  >
                    <div className="flex items-center">
                      Amount
                      <ArrowDownUp size={14} className="ml-1" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      <ArrowDownUp size={14} className="ml-1" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                      <div className="flex items-center justify-center">
                        <RefreshCw className="h-6 w-6 mr-2 animate-spin" />
                        Loading donations...
                      </div>
                    </td>
                  </tr>
                ) : sortedDonations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Search className="h-8 w-8 text-gray-400" />
                        <p>No donations found matching your criteria</p>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSearchTerm('');
                            setDateRange({ start: '', end: '' });
                            setStatusFilter('all');
                          }}
                        >
                          Clear all filters
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedDonations.map(donation => (
                    <React.Fragment key={donation._id}>
                      <tr className="hover:bg-gray-50">
                        <td 
                          className="px-6 py-4 text-gray-400 cursor-pointer"
                          onClick={() => toggleRowExpanded(donation._id)}
                        >
                          {expandedRows[donation._id] ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {new Date(donation.createdAt).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(donation.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {donation.donorName}
                            </span>
                            <span className="text-xs text-gray-500">
                              {donation.donorEmail}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getOrganizationName(donation.organizationId)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-green-600 font-medium">
                            ${donation.amount.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            donation.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : donation.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {getStatusIcon(donation.status)}
                            {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:bg-gray-100">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                      {expandedRows[donation._id] && (
                        <tr className="bg-gray-50">
                          <td colSpan={7} className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="space-y-3">
                                <h4 className="font-medium text-sm flex items-center">
                                  <FileText className="h-4 w-4 mr-2 text-gray-500" />
                                  Donation Details
                                </h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div className="text-gray-500">Payment ID:</div>
                                  <div className="font-medium">{donation.paymentIntentId}</div>
                                  
                                  <div className="text-gray-500">Frequency:</div>
                                  <div className="font-medium capitalize">
                                    {donation.frequency.replace('-', ' ')}
                                  </div>
                                  
                                  <div className="text-gray-500">Date & Time:</div>
                                  <div>
                                    {new Date(donation.createdAt).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-3">
                                <h4 className="font-medium text-sm flex items-center">
                                  <Receipt className="h-4 w-4 mr-2 text-gray-500" />
                                  Receipt & Documents
                                </h4>
                                <div className="space-y-2">
                                  <Button variant="outline" size="sm" className="w-full justify-start">
                                    <Download className="h-4 w-4 mr-2" />
                                    Download Receipt
                                  </Button>
                                  <Button variant="outline" size="sm" className="w-full justify-start">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Tax Receipt (PDF)
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="space-y-3">
                                <h4 className="font-medium text-sm flex items-center">
                                  <AlertCircle className="h-4 w-4 mr-2 text-gray-500" />
                                  Actions
                                </h4>
                                <div className="space-y-2">
                                  {donation.status === 'pending' && (
                                    <Button variant="outline" size="sm" className="w-full justify-start text-red-600 hover:bg-red-50">
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Cancel Donation
                                    </Button>
                                  )}
                                  <Button variant="ghost" size="sm" className="w-full justify-start text-gray-600">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Report Issue
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {sortedDonations.length > 0 && (
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div>
            Showing <span className="font-medium">1-{sortedDonations.length}</span> of{' '}
            <span className="font-medium">{sortedDonations.length}</span> donations
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;