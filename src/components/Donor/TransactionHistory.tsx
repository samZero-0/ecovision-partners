'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, ChevronUp, Download, ArrowDownUp, Search,
  CreditCard, Banknote, Wallet, AlertCircle, CheckCircle2,
  Clock, XCircle, Receipt, RefreshCw, FileText, Filter,
  Calendar as CalendarIcon, ArrowRight, MoreVertical
} from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  organization: string;
  amount: number;
  type: 'donation' | 'refund';
  status: 'completed' | 'pending' | 'failed';
  referenceId: string;
  paymentMethod: string;
  campaign?: string;
  taxReceipt?: boolean;
}

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      date: '2025-03-15T14:30:00',
      organization: 'Global Relief Foundation',
      amount: 150,
      type: 'donation',
      status: 'completed',
      referenceId: 'GRF-2553412',
      paymentMethod: 'Credit Card (****4567)',
      campaign: 'Emergency Relief Fund',
      taxReceipt: true
    },
    {
      id: '2',
      date: '2025-03-01T09:15:00',
      organization: 'Children Education Fund',
      amount: 75,
      type: 'donation',
      status: 'completed',
      referenceId: 'CEF-9871254',
      paymentMethod: 'PayPal',
      campaign: 'Back to School Initiative',
      taxReceipt: true
    },
    {
      id: '3',
      date: '2025-02-20T16:45:00',
      organization: 'Wildlife Conservation',
      amount: 100,
      type: 'donation',
      status: 'pending',
      referenceId: 'WC-7563210',
      paymentMethod: 'Bank Transfer',
      campaign: 'Endangered Species Protection'
    },
    {
      id: '4',
      date: '2025-02-10T11:20:00',
      organization: 'Children Education Fund',
      amount: 25,
      type: 'refund',
      status: 'completed',
      referenceId: 'CEF-REF-458721',
      paymentMethod: 'Original Method',
      campaign: 'Back to School Initiative'
    },
    {
      id: '5',
      date: '2025-02-05T13:10:00',
      organization: 'Global Relief Foundation',
      amount: 200,
      type: 'donation',
      status: 'completed',
      referenceId: 'GRF-3698541',
      paymentMethod: 'Credit Card (****4567)',
      campaign: 'Winter Shelter Program',
      taxReceipt: true
    },
    {
      id: '6',
      date: '2025-01-20T10:05:00',
      organization: 'Local Food Bank',
      amount: 50,
      type: 'donation',
      status: 'failed',
      referenceId: 'LFB-1234567',
      paymentMethod: 'Credit Card (****7890)',
      campaign: 'Holiday Meal Drive'
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Transaction>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({
    start: '',
    end: ''
  });
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  
  const handleSort = (field: keyof Transaction) => {
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
  
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.referenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.campaign?.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesDateRange = true;
    if (dateRange.start && dateRange.end) {
      const transactionDate = new Date(transaction.date);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      matchesDateRange = transactionDate >= startDate && transactionDate <= endDate;
    }
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    
    return matchesSearch && matchesDateRange && matchesStatus && matchesType;
  });
  
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortField === 'date') {
      return sortDirection === 'asc' 
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
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
  
  const getPaymentMethodIcon = (method: string) => {
    if (method.includes('Credit Card')) return <CreditCard className="h-4 w-4 mr-1" />;
    if (method.includes('PayPal')) return <Wallet className="h-4 w-4 mr-1" />;
    if (method.includes('Bank')) return <Banknote className="h-4 w-4 mr-1" />;
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Transaction History</h1>
          <p className="text-sm text-gray-500">View and manage your donation transactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-0">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-600" />
              <span>Filter Transactions</span>
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setSearchTerm('');
                setDateRange({ start: '', end: '' });
                setStatusFilter('all');
                setTypeFilter('all');
              }}
            >
              Clear All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative flex items-center md:mt-5">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search transactions..."
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
            
            <div>
              <label className="block text-xs mb-1 font-medium">Type</label>
              <select
                className="w-full p-2 border rounded-lg"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="donation">Donation</option>
                <option value="refund">Refund</option>
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
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      Date
                      <ArrowDownUp size={14} className="ml-1" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('organization')}
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
                    onClick={() => handleSort('type')}
                  >
                    <div className="flex items-center">
                      Type
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
                {sortedTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Search className="h-8 w-8 text-gray-400" />
                        <p>No transactions found matching your criteria</p>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSearchTerm('');
                            setDateRange({ start: '', end: '' });
                            setStatusFilter('all');
                            setTypeFilter('all');
                          }}
                        >
                          Clear all filters
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedTransactions.map(transaction => (
                    <React.Fragment key={transaction.id}>
                      <tr className="hover:bg-gray-50">
                        <td 
                          className="px-6 py-4 text-gray-400 cursor-pointer"
                          onClick={() => toggleRowExpanded(transaction.id)}
                        >
                          {expandedRows[transaction.id] ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {new Date(transaction.date).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(transaction.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {transaction.organization}
                            </span>
                            {transaction.campaign && (
                              <span className="text-xs text-gray-500">
                                {transaction.campaign}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`font-medium ${transaction.type === 'refund' ? 'text-red-600' : 'text-green-600'}`}>
                            {transaction.type === 'refund' ? '-' : '+'}${transaction.amount.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.type === 'donation' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : transaction.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {getStatusIcon(transaction.status)}
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:bg-gray-100">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                      {expandedRows[transaction.id] && (
                        <tr className="bg-gray-50">
                          <td colSpan={7} className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="space-y-3">
                                <h4 className="font-medium text-sm flex items-center">
                                  <FileText className="h-4 w-4 mr-2 text-gray-500" />
                                  Transaction Details
                                </h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div className="text-gray-500">Reference ID:</div>
                                  <div className="font-medium">{transaction.referenceId}</div>
                                  
                                  <div className="text-gray-500">Payment Method:</div>
                                  <div className="flex items-center font-medium">
                                    {getPaymentMethodIcon(transaction.paymentMethod)}
                                    {transaction.paymentMethod}
                                  </div>
                                  
                                  <div className="text-gray-500">Date & Time:</div>
                                  <div>
                                    {new Date(transaction.date).toLocaleDateString('en-US', {
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
                                  {transaction.taxReceipt && (
                                    <Button variant="outline" size="sm" className="w-full justify-start">
                                      <FileText className="h-4 w-4 mr-2" />
                                      Tax Receipt (PDF)
                                    </Button>
                                  )}
                                </div>
                              </div>
                              
                              <div className="space-y-3">
                                <h4 className="font-medium text-sm flex items-center">
                                  <AlertCircle className="h-4 w-4 mr-2 text-gray-500" />
                                  Actions
                                </h4>
                                <div className="space-y-2">
                                  {transaction.status === 'pending' && (
                                    <Button variant="outline" size="sm" className="w-full justify-start text-red-600 hover:bg-red-50">
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Cancel Transaction
                                    </Button>
                                  )}
                                  {transaction.status === 'failed' && (
                                    <Button size="sm" className="w-full justify-start">
                                      <RefreshCw className="h-4 w-4 mr-2" />
                                      Retry Payment
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
      
      {sortedTransactions.length > 0 && (
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div>
            Showing <span className="font-medium">1-{sortedTransactions.length}</span> of{' '}
            <span className="font-medium">{sortedTransactions.length}</span> transactions
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