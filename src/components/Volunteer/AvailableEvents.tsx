'use client';

import React, { useContext, useEffect, useState } from 'react';

import axios from 'axios';
import { Calendar, Clock, MapPin } from 'lucide-react'; // Icons for event details
// import Image from 'next/image';
import { AuthContext } from '@/providers/AuthProvider';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

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
  const {user} = useContext(AuthContext)
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch both events and volunteer data in parallel
        const [eventsResponse, volunteersResponse] = await Promise.all([
          axios.get<Event[]>('https://ecovision-backend-five.vercel.app/events'),
          axios.get('https://ecovision-backend-five.vercel.app/signed-up-volunteers')
        ]);
  
        console.log("Fetched events:", eventsResponse.data);
        console.log("Fetched volunteers response:", volunteersResponse.data);
  
        // Handle different response formats from backend
        let volunteersArray: Volunteer[] = [];
        if (Array.isArray(volunteersResponse.data)) {
          // Case 1: Backend returns direct array
          volunteersArray = volunteersResponse.data;
        } else if (volunteersResponse.data?.volunteers && Array.isArray(volunteersResponse.data.volunteers)) {
          // Case 2: Backend returns { volunteers: [...] }
          volunteersArray = volunteersResponse.data.volunteers;
        } else {
          console.warn('Unexpected volunteers response format:', volunteersResponse.data);
        }
  
        // Filter volunteers by current user's email and get their event IDs
        const userRegisteredEventIds = volunteersArray
          .filter(volunteer => volunteer.volunteerEmail === user?.email)
          .map(volunteer => volunteer.eventId);
        
        // Filter events to exclude those the user has already registered for
        const availableEvents = eventsResponse.data.filter(event => 
          !userRegisteredEventIds.includes(event._id)
        );
  
        setEvents(availableEvents);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load events');
      } finally {
        setLoading(false);
      }
    };
  
    if (user?.email) {  // Only fetch if user is logged in
      fetchData();
    } else {
      setEvents([]);  // Clear events if no user is logged in
    }
  }, [user]);
  


  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );


const handleSignUp = async (eventId: string) => {
  // Show confirmation dialog
  const result = await Swal.fire({
    title: 'Confirm Registration',
    text: 'Are you sure you want to register for this event?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, register!'
  });

  // If user cancels, don't proceed
  if (!result.isConfirmed) {
    return;
  }

  try {
    const selectedEvent = events.find(event => event._id === eventId);
    
    if (!selectedEvent) {
      console.error('Event not found');
      return;
    }

    const userData = {
      name: `${user.displayName}`, 
      email: `${user.email}`, 
      photoURL: `${user.photoURL}` 
    };

    const volunteerData = {
      volunteerName: userData.name,
      volunteerEmail: userData.email,
      eventId: selectedEvent._id,
      eventName: selectedEvent.title,
      eventImage: selectedEvent.image,
      volunteerImage: userData.photoURL,
      progress: 'In Progress',
      hoursCompleted: 0
    };

    const response = await axios.post(
      'https://ecovision-backend-five.vercel.app/signed-up-volunteers',
      volunteerData,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    
    if (response.data.success) {
      // Remove the event from the UI
      setEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
      
      // Show success message
      Swal.fire(
        'Registered!',
        'You have successfully registered for the event.',
        'success'
      );
    } else {
      console.error('Registration failed:', response.data.message);
      Swal.fire(
        'Error',
        `Registration failed: ${response.data.message}`,
        'error'
      );
    }
  } catch (error) {
    console.error('Error during registration:', error);
    
    let errorMessage = 'An unexpected error occurred';
    if (axios.isAxiosError(error)) {
      if (error.response) {
        errorMessage = error.response.data.message || error.message;
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        errorMessage = 'Request setup error: ' + error.message;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    Swal.fire(
      'Error',
      errorMessage,
      'error'
    );
  }
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div 
            key={event._id} 
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
                  {event.attendees > 0 ? `${event.attendees} Attendees` : 'Sold out'}
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
                onClick={() => handleSignUp(event._id)}
                disabled={event.attendees === 0}
                className={`w-full py-2 px-4 rounded-lg text-sm font-semibold transition-colors ${
                  event.attendees > 0 
                    ? 'bg-black text-white hover:bg-blue-700' 
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