'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  spotsAvailable: number;
}

const AvailableEvents: React.FC = () => {
  // Mock data - in a real app, this would come from an API call
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Community Garden Cleanup',
      date: '2025-04-15',
      location: 'Central Park',
      description: 'Help clean and prepare the community garden for spring planting.',
      spotsAvailable: 5,
    },
    {
      id: '2',
      title: 'Food Bank Distribution',
      date: '2025-04-18',
      location: 'Downtown Community Center',
      description: 'Assist with distributing food packages to families in need.',
      spotsAvailable: 8,
    },
    {
      id: '3',
      title: 'Senior Home Visit',
      date: '2025-04-22',
      location: 'Sunshine Retirement Home',
      description: 'Spend time with seniors through activities and conversation.',
      spotsAvailable: 3,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSignUp = (eventId: string) => {
    // This would typically make an API call to register the volunteer
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, spotsAvailable: event.spotsAvailable - 1 } 
        : event
    ));
    alert(`You've signed up for event ${eventId}!`);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Events</h2>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search events by title or location..."
          className="w-full p-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {filteredEvents.length > 0 ? (
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start ">
                <h3 className="text-lg font-semibold text-gray-700">{event.title}</h3>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  {event.spotsAvailable} spots
                </span>
              </div>
              
              <div className="mt-2 text-sm text-gray-600">
                <p><span className="font-medium">Date:</span> {new Date(event.date).toLocaleDateString()}</p>
                <p><span className="font-medium">Location:</span> {event.location}</p>
                <p className="mt-1">{event.description}</p>
              </div>
              
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => handleSignUp(event.id)}
                  disabled={event.spotsAvailable === 0}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    event.spotsAvailable > 0 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {event.spotsAvailable > 0 ? 'Sign Up' : 'Full'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No events found matching your search.
        </div>
      )}
    </div>
  );
};

export default AvailableEvents;