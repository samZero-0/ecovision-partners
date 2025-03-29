'use client'

import React, { useState } from 'react';
import { Bar } from 'recharts';

interface VolunteerStats {
  totalHours: number;
  eventsCompleted: number;
  upcomingEvents: number;
  streakDays: number;
  impactAreas: {
    name: string;
    hours: number;
  }[];
  monthlyActivity: {
    month: string;
    hours: number;
  }[];
  certificates: {
    id: string;
    name: string;
    issueDate: string;
    imageUrl: string;
  }[];
}

const ProgressReports: React.FC = () => {
  // Mock data - in a real app, this would come from an API call
  const [stats, setStats] = useState<VolunteerStats>({
    totalHours: 87,
    eventsCompleted: 12,
    upcomingEvents: 2,
    streakDays: 4,
    impactAreas: [
      { name: 'Environmental', hours: 32 },
      { name: 'Social Services', hours: 28 },
      { name: 'Education', hours: 15 },
      { name: 'Animal Welfare', hours: 12 },
    ],
    monthlyActivity: [
      { month: 'Oct', hours: 12 },
      { month: 'Nov', hours: 15 },
      { month: 'Dec', hours: 8 },
      { month: 'Jan', hours: 20 },
      { month: 'Feb', hours: 18 },
      { month: 'Mar', hours: 14 },
    ],
    certificates: [
      {
        id: '1',
        name: 'Environmental Stewardship',
        issueDate: '2024-12-15',
        imageUrl: '/api/placeholder/200/120',
      },
      {
        id: '2',
        name: 'Crisis Response',
        issueDate: '2025-02-10',
        imageUrl: '/api/placeholder/200/120',
      },
    ],
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'impact' | 'certificates'>('overview');

  // Calculate progress toward next milestone (100 hours)
  const nextMilestone = 100;
  const progressPercentage = (stats.totalHours / nextMilestone) * 100;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Progress Reports</h2>
      
      <div className="flex mb-6 border-b">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'overview' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('impact')}
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'impact' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Impact Areas
        </button>
        <button 
          onClick={() => setActiveTab('certificates')}
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'certificates' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Certificates
        </button>
      </div>
      
      {activeTab === 'overview' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-500 font-medium">Total Hours</p>
              <p className="text-2xl font-bold text-blue-700">{stats.totalHours}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-500 font-medium">Events Completed</p>
              <p className="text-2xl font-bold text-green-700">{stats.eventsCompleted}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-500 font-medium">Upcoming Events</p>
              <p className="text-2xl font-bold text-purple-700">{stats.upcomingEvents}</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-500 font-medium">Streak Days</p>
              <p className="text-2xl font-bold text-orange-700">{stats.streakDays}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Progress to Next Milestone</h3>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-blue-600 h-4 rounded-full" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>0 hours</span>
              <span>{stats.totalHours} hours ({Math.round(progressPercentage)}%)</span>
              <span>{nextMilestone} hours</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Monthly Activity</h3>
            <div className="h-64 w-full">
              {/* This would be a chart in a real app */}
              <div className="flex h-48 items-end justify-between">
                {stats.monthlyActivity.map((month) => (
                  <div key={month.month} className="flex flex-col items-center">
                    <div 
                      className="w-12 bg-blue-400 hover:bg-blue-500 transition-colors" 
                      style={{ height: `${(month.hours / 20) * 100}%` }}
                    ></div>
                    <span className="text-xs mt-1">{month.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'impact' && (
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4">Hours by Impact Area</h3>
          
          <div className="space-y-4">
            {stats.impactAreas.map((area) => (
              <div key={area.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{area.name}</span>
                  <span className="text-sm text-gray-500">{area.hours} hours</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${(area.hours / stats.totalHours) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-md font-medium text-gray-700 mb-2">Impact Summary</h3>
            <p className="text-sm text-gray-600">
              You've contributed the most hours to <strong>Environmental</strong> causes, making up 
              {' '}{Math.round((stats.impactAreas[0].hours / stats.totalHours) * 100)}%{' '}
              of your total volunteer work. Consider exploring more opportunities in 
              {' '}<strong>Education</strong> if you're looking to diversify your impact.
            </p>
          </div>
        </div>
      )}
      
      {activeTab === 'certificates' && (
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4">Your Certificates</h3>
          
          {stats.certificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.certificates.map((cert) => (
                <div key={cert.id} className="border rounded-lg overflow-hidden">
                  <img 
                    src={cert.imageUrl} 
                    alt={cert.name} 
                    className="w-full h-32 object-cover" 
                  />
                  <div className="p-4">
                    <h4 className="font-medium text-gray-800">{cert.name}</h4>
                    <p className="text-sm text-gray-500">Issued on {new Date(cert.issueDate).toLocaleDateString()}</p>
                    <div className="mt-3">
                      <button className="text-sm text-blue-600 hover:text-blue-800">
                        Download PDF
                      </button>
                      <button className="text-sm text-blue-600 hover:text-blue-800 ml-4">
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              You haven't earned any certificates yet. Complete more volunteer activities to earn recognition.
            </div>
          )}
          
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Available Certificates</h3>
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium text-gray-800">Community Leadership</h4>
              <p className="text-sm text-gray-600 mt-1">
                Complete 5 more events in the Social Services category to earn this certificate.
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">3/5 events completed</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressReports;