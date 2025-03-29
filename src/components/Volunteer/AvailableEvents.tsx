'use client';

import React, { useState } from 'react';

import axios from 'axios';
import { Calendar, Clock, MapPin } from 'lucide-react'; // Icons for event details
import Image from 'next/image';

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
  const [events, setEvents] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');

  axios.get('https://ecovision-backend-five.vercel.app/events')
  .then(res=> setEvents(res.data))

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div 
            key={event.id} 
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
          >
            {/* Image Section */}
            <div className="h-48 overflow-hidden">
              <img 
                src={event?.image} 
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-event.jpg';
                }}
              />
            </div>
      
            {/* Content Section */}
            <div className="p-5">
              {/* Title and Badge */}
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-800 line-clamp-1">{event.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  event.attendees > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {event.attendees > 0 ? `${event.attendees} spots left` : 'Sold out'}
                </span>
              </div>
      
              {/* Event Details */}
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{new Date(event.date).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{event.time || 'Time TBD'}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="line-clamp-1">{event.location || 'Location TBD'}</span>
                </div>
              </div>
      
              {/* Description */}
              <p className="text-gray-500 text-sm mb-5 line-clamp-2">
                {event.description || 'No description provided'}
              </p>
      
              {/* Action Button */}
              <button
                onClick={() => handleSignUp(event.id)}
                disabled={event.attendees === 0}
                className={`w-full py-2 px-4 rounded-lg text-sm font-semibold transition-colors ${
                  event.attendees > 0 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {event.attendees > 0 ? 'Register Now' : 'Event Full'}
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