'use client';

import React, { useState } from 'react';
import AvailableEvents from './AvailableEvents';
import MyAssignedEvents from './MyAssignedEvents';
import ProgressReports from './ProgressReport';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'available' | 'assigned' | 'progress'>('available');

  return (
    <div className="min-h-screen ">
      <header className="bg-white shadow">
        <div className="md:w-full py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center ">
          <h1 className="text-3xl font-bold text-gray-900">Volunteer Dashboard</h1>
          <div className="flex items-center space-x-4 ">
            <span className="text-sm text-gray-600">Welcome, Alex</span>
            <img
              className="h-10 w-10 rounded-full bg-gray-300"
              src="/api/placeholder/40/40"
              alt="User profile"
            />
          </div>
        </div>
      </header>
      
      <main className="md:w-full mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('available')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'available'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Available Events
              </button>
              <button
                onClick={() => setActiveTab('assigned')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'assigned'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Assigned Events
              </button>
              <button
                onClick={() => setActiveTab('progress')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'progress'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Progress Reports
              </button>
            </nav>
          </div>
          
          <div className="mt-6">
            {activeTab === 'available' && <AvailableEvents />}
            {activeTab === 'assigned' && <MyAssignedEvents />}
            {activeTab === 'progress' && <ProgressReports />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;