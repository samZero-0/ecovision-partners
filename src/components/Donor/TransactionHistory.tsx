'use client'

import React, { useState, useEffect, useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, ChevronUp, Download, ArrowDownUp, Search,
  CreditCard, Banknote, Wallet, AlertCircle, CheckCircle2,
  Clock, XCircle, Receipt, RefreshCw, FileText, Filter,
  Calendar as CalendarIcon, ArrowRight, MoreVertical, User
} from 'lucide-react';
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

const TransactionHistory: React.FC = () => {
  const { user } = useContext(AuthContext);
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
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
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
    switch(id) {
      case '1': return isMobile ? 'Global Relief' : 'Global Relief Foundation';
      case '2': return isMobile ? 'Education Fund' : 'Children Education Fund';
      case '3': return isMobile ? 'Wildlife' : 'Wildlife Conservation';
      default: return isMobile ? `Org ${id}` : `Organization ${id}`;
    }
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://ecovision-backend-five.vercel.app/donations');
      const data = await response.json();
      if (data.success) {
        const userDonations = data.donations.filter(
          (donation: Donation) => donation.donorEmail === user?.email
        );
        setDonations(userDonations);
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
    <div className="space-y-4 p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Donation History</h1>
          <p className="text-xs md:text-sm text-gray-500">View and manage your donation history</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search donations..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg text-sm md:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={refreshData}
              disabled={loading}
              className="flex-1 sm:flex-none"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="sr-only sm:not-sr-only ml-2">Refresh</span>
            </Button>
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
              <Download className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only ml-2">Export</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="block text-xs font-medium">Date Range</label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="date"
                className="w-full p-2 border rounded-lg text-sm"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
            </div>
            <ArrowRight className="text-gray-400 shrink-0" />
            <div className="relative flex-1">
              <input
                type="date"
                className="w-full p-2 border rounded-lg text-sm"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-1">
          <label className="block text-xs font-medium">Status</label>
          <select
            className="w-full p-2 border rounded-lg text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        
        <div className="flex items-end">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs"
            onClick={() => {
              setSearchTerm('');
              setDateRange({ start: '', end: '' });
              setStatusFilter('all');
            }}
          >
            Clear All Filters
          </Button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}
      
      {/* Transactions Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center">
                  <span>Date</span>
                  <ArrowDownUp size={12} className="ml-1" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('organizationId')}
              >
                <div className="flex items-center">
                  <span>Organization</span>
                  <ArrowDownUp size={12} className="ml-1" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center">
                  <span>Amount</span>
                  <ArrowDownUp size={12} className="ml-1" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">
                  <span>Status</span>
                  <ArrowDownUp size={12} className="ml-1" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  <div className="flex items-center justify-center">
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Loading donations...
                  </div>
                </td>
              </tr>
            ) : sortedDonations.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Search className="h-6 w-6 text-gray-400" />
                    <p className="text-sm">{donations.length === 0 ? 'You have no donations yet.' : 'No donations match the current filter.'}</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedDonations.map(donation => (
                <React.Fragment key={donation._id}>
                  <tr className="hover:bg-gray-50">
                    <td 
                      className="px-4 py-3 text-gray-400 cursor-pointer"
                      onClick={() => toggleRowExpanded(donation._id)}
                    >
                      {expandedRows[donation._id] ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm">
                        {new Date(donation.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: isMobile ? undefined : 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium">
                        {getOrganizationName(donation.organizationId)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm font-medium text-green-600">
                        ${donation.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
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
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                  {expandedRows[donation._id] && (
                    <tr className="bg-gray-50">
                      <td colSpan={6} className="px-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-gray-500" />
                              Details
                            </h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="text-gray-500">Payment ID:</div>
                              <div className="font-medium truncate">{donation.paymentIntentId}</div>
                              
                              <div className="text-gray-500">Frequency:</div>
                              <div className="font-medium capitalize">
                                {donation.frequency.replace('-', ' ')}
                              </div>
                              
                              <div className="text-gray-500">Date:</div>
                              <div className="text-sm">
                                {new Date(donation.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm flex items-center">
                              <Receipt className="h-4 w-4 mr-2 text-gray-500" />
                              Documents
                            </h4>
                            <div className="space-y-2">
                              <Button variant="outline" size="sm" className="w-full justify-start text-sm">
                                <Download className="h-4 w-4 mr-2" />
                                Download Receipt
                              </Button>
                              <Button variant="outline" size="sm" className="w-full justify-start text-sm">
                                <FileText className="h-4 w-4 mr-2" />
                                Tax Receipt
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm flex items-center">
                              <AlertCircle className="h-4 w-4 mr-2 text-gray-500" />
                              Actions
                            </h4>
                            <div className="space-y-2">
                              {donation.status === 'pending' && (
                                <Button variant="outline" size="sm" className="w-full justify-start text-sm text-red-600 hover:bg-red-50">
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Cancel
                                </Button>
                              )}
                              <Button variant="ghost" size="sm" className="w-full justify-start text-sm text-gray-600">
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
      
      {sortedDonations.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
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