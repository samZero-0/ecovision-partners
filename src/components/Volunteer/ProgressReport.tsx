'use client'

import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@/providers/AuthProvider';

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
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState<VolunteerStats>({
    totalHours: 0,
    eventsCompleted: 0,
    upcomingEvents: 0,
    streakDays: 0,
    impactAreas: [],
    monthlyActivity: [],
    certificates: []
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'impact' | 'certificates'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchUserData = async () => {
      try {
        const response = await axios.get('https://ecovision-backend-five.vercel.app/signed-up-volunteers');
        const userEvents = response.data.volunteers.filter(
          (event: any) => event.volunteerEmail === user.email
        );

        // Calculate stats
        const totalHours = userEvents.reduce((sum: number, event: any) => sum + (event.hoursCompleted || 0), 0);
        const eventsCompleted = userEvents.filter((event: any) => event.progress === 'Completed').length;
        const upcomingEvents = userEvents.filter((event: any) => 
          event.status === 'registered' && event.progress !== 'Completed'
        ).length;

        // Group by impact areas (using eventName as placeholder for impact area)
        const impactAreasMap = new Map<string, number>();
        userEvents.forEach((event: any) => {
          const area = event.eventName.split(' ')[0]; // Simple grouping for demo
          const hours = event.hoursCompleted || 0;
          impactAreasMap.set(area, (impactAreasMap.get(area) || 0) + hours);
        });

        const impactAreas = Array.from(impactAreasMap.entries()).map(([name, hours]) => ({
          name,
          hours
        }));

        // Group by month (simplified)
        const monthlyActivity = [
          { month: 'Jan', hours: Math.floor(Math.random() * 20) + 5 },
          { month: 'Feb', hours: Math.floor(Math.random() * 20) + 5 },
          { month: 'Mar', hours: Math.floor(Math.random() * 20) + 5 },
          { month: 'Apr', hours: Math.floor(Math.random() * 20) + 5 },
        ];

        // Mock certificates based on completed events
        const certificates = eventsCompleted > 0 ? [
          {
            id: '1',
            name: 'Environmental Stewardship',
            issueDate: new Date().toISOString(),
            imageUrl: '/api/placeholder/200/120',
          },
          ...(eventsCompleted > 3 ? [{
            id: '2',
            name: 'Community Leadership',
            issueDate: new Date().toISOString(),
            imageUrl: '/api/placeholder/200/120',
          }] : [])
        ] : [];

        setStats({
          totalHours,
          eventsCompleted,
          upcomingEvents,
          streakDays: Math.floor(Math.random() * 10) + 1, // Random streak for demo
          impactAreas,
          monthlyActivity,
          certificates
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user?.email]);

  const nextMilestone = 100;
  const progressPercentage = (stats.totalHours / nextMilestone) * 100;

  if (loading) {
    return (
      <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Progress Reports</h2>
        <div className="text-center py-8 text-gray-500">Loading your progress data...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Progress Reports</h2>
      
      <div className="flex overflow-x-auto mb-4 sm:mb-6 border-b pb-1">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-3 sm:px-4 py-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
            activeTab === 'overview' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('impact')}
          className={`px-3 sm:px-4 py-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
            activeTab === 'impact' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Impact Areas
        </button>
        <button 
          onClick={() => setActiveTab('certificates')}
          className={`px-3 sm:px-4 py-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
            activeTab === 'certificates' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Certificates
        </button>
      </div>
      
      {activeTab === 'overview' && (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
            <div className="p-3 sm:p-4 bg-blue-50 rounded-lg">
              <p className="text-xs sm:text-sm text-blue-500 font-medium">Total Hours</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-700">{stats.totalHours}</p>
            </div>
            <div className="p-3 sm:p-4 bg-green-50 rounded-lg">
              <p className="text-xs sm:text-sm text-green-500 font-medium">Completed</p>
              <p className="text-xl sm:text-2xl font-bold text-green-700">{stats.eventsCompleted}</p>
            </div>
            <div className="p-3 sm:p-4 bg-purple-50 rounded-lg">
              <p className="text-xs sm:text-sm text-purple-500 font-medium">Upcoming</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-700">{stats.upcomingEvents}</p>
            </div>
            <div className="p-3 sm:p-4 bg-orange-50 rounded-lg">
              <p className="text-xs sm:text-sm text-orange-500 font-medium">Streak</p>
              <p className="text-xl sm:text-2xl font-bold text-orange-700">{stats.streakDays} days</p>
            </div>
          </div>
          
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-2">Next Milestone</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5 sm:h-4">
              <div 
                className="bg-blue-600 h-2.5 sm:h-4 rounded-full" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs sm:text-sm text-gray-500 mt-1">
              <span>0 hours</span>
              <span>{stats.totalHours} hours ({Math.round(progressPercentage)}%)</span>
              <span>{nextMilestone} hours</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-2">Monthly Activity</h3>
            <div className="h-48 sm:h-64 w-full">
              <div className="flex h-32 sm:h-48 items-end justify-between">
                {stats.monthlyActivity.map((month) => (
                  <div key={month.month} className="flex flex-col items-center">
                    <div 
                      className="w-8 sm:w-12 bg-blue-400 hover:bg-blue-500 transition-colors" 
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
          <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-3 sm:mb-4">Impact Areas</h3>
          
          <div className="space-y-3 sm:space-y-4">
            {stats.impactAreas.length > 0 ? (
              stats.impactAreas.map((area) => (
                <div key={area.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">{area.name}</span>
                    <span className="text-xs sm:text-sm text-gray-500">{area.hours} hours</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
                    <div 
                      className="bg-blue-600 h-2 sm:h-2.5 rounded-full" 
                      style={{ width: `${(area.hours / stats.totalHours) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                No impact data available yet. Complete some events to see your impact.
              </div>
            )}
          </div>
          
          {stats.impactAreas.length > 0 && (
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm sm:text-md font-medium text-gray-700 mb-2">Your Impact</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                You've contributed the most hours to <strong>{stats.impactAreas[0]?.name || ''}</strong> causes.
              </p>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'certificates' && (
        <div>
          <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-3 sm:mb-4">Certificates</h3>
          
          {stats.certificates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {stats.certificates.map((cert) => (
                <div key={cert.id} className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-100 h-24 sm:h-32 flex items-center justify-center">
                    <span className="text-gray-400">Certificate Image</span>
                  </div>
                  <div className="p-3 sm:p-4">
                    <h4 className="font-medium text-gray-800 text-sm sm:text-base">{cert.name}</h4>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Issued: {new Date(cert.issueDate).toLocaleDateString()}
                    </p>
                    <div className="mt-2 sm:mt-3">
                      <button className="text-xs sm:text-sm text-blue-600 hover:text-blue-800">
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500 text-sm sm:text-base">
              Complete more events to earn certificates.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressReports;