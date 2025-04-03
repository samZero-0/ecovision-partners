'use client';

import React, { useContext, useState } from 'react';
import AvailableEvents from './AvailableEvents';
import MyAssignedEvents from './MyAssignedEvents';
import ProgressReports from './ProgressReport';
import { AuthContext } from '@/providers/AuthProvider';

const Dashboard: React.FC = () => {
  const {user, logOut} = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState<'available' | 'assigned' | 'progress'>('available');

  return (
    <div className="min-h-screen ">
      <header className="bg-white shadow">
        <div className="w-full py-4 px-4 sm:py-6 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Volunteer Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="font-semibold text-base sm:text-lg px-2 sm:px-4 truncate max-w-[150px] sm:max-w-none">
              {user?.displayName}
            </span>
            <img
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-300"
              src={user?.photoURL}
              alt="User profile"
            />
              <button onClick={logOut} className='md:hidden flex btn'>Sign out</button>
          </div>
        
        </div>
      </header>
      
      <main className="w-full  mx-auto py-4 sm:py-6 sm:px-6 lg:px-8">
        <div className="md:px-2 sm:px-0">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="-mb-px flex space-x-2 sm:space-x-8">
              <button
                onClick={() => setActiveTab('available')}
                className={`whitespace-nowrap py-3 px-1 sm:py-4 border-b-2 font-medium text-xs sm:text-sm ${
                  activeTab === 'available'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Available Events
              </button>
              <button
                onClick={() => setActiveTab('assigned')}
                className={`whitespace-nowrap py-3 px-1 sm:py-4 border-b-2 font-medium text-xs sm:text-sm ${
                  activeTab === 'assigned'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Assigned Events
              </button>
              <button
                onClick={() => setActiveTab('progress')}
                className={`whitespace-nowrap py-3 px-1 sm:py-4 border-b-2 font-medium text-xs sm:text-sm ${
                  activeTab === 'progress'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Progress Reports
              </button>
            </nav>
          </div>
          
          <div className="mt-4 sm:mt-6">
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