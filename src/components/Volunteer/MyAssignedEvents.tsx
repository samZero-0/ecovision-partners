'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface AssignedEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  status: 'upcoming' | 'in-progress' | 'completed';
  role: string;
  coordinator: {
    name: string;
    email: string;
  };
}

const MyAssignedEvents: React.FC = () => {
  // Mock data - in a real app, this would come from an API call
  const [assignedEvents, setAssignedEvents] = useState<AssignedEvent[]>([
    {
      id: '1',
      title: 'Beach Cleanup',
      date: '2025-04-10',
      location: 'Coastal Beach',
      description: 'Help clean up plastic and other waste from our beautiful coast.',
      status: 'upcoming',
      role: 'Team Member',
      coordinator: {
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com'
      }
    },
    {
      id: '2',
      title: 'Homeless Shelter Meal Service',
      date: '2025-03-25',
      location: 'Downtown Shelter',
      description: 'Prepare and serve meals for the homeless community.',
      status: 'in-progress',
      role: 'Kitchen Assistant',
      coordinator: {
        name: 'Mike Peterson',
        email: 'mike.p@example.com'
      }
    },
    {
      id: '3',
      title: 'Animal Shelter Dog Walking',
      date: '2025-03-15',
      location: 'Paws & Claws Shelter',
      description: 'Provide exercise and companionship for shelter dogs.',
      status: 'completed',
      role: 'Dog Walker',
      coordinator: {
        name: 'Lisa Torres',
        email: 'lisa.t@example.com'
      }
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'upcoming' | 'in-progress' | 'completed'>('all');

  const filteredEvents = filter === 'all' 
    ? assignedEvents 
    : assignedEvents.filter(event => event.status === filter);

  const cancelAssignment = (eventId: string) => {
    if (confirm('Are you sure you want to cancel your assignment for this event?')) {
      // In a real app, this would make an API call
      setAssignedEvents(assignedEvents.filter(event => event.id !== eventId));
    }
  };

  const markAsCompleted = (eventId: string) => {
    // In a real app, this would make an API call
    setAssignedEvents(assignedEvents.map(event => 
      event.id === eventId 
        ? { ...event, status: 'completed' as const } 
        : event
    ));
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Assigned Events</h2>
      
      <div className="flex mb-6 space-x-2">
        <button 
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-md ${filter === 'all' ? 'bg-gray-200 font-medium' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          All
        </button>
        <button 
          onClick={() => setFilter('upcoming')}
          className={`px-3 py-1 rounded-md ${filter === 'upcoming' ? 'bg-blue-100 font-medium' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          Upcoming
        </button>
        <button 
          onClick={() => setFilter('in-progress')}
          className={`px-3 py-1 rounded-md ${filter === 'in-progress' ? 'bg-yellow-100 font-medium' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          In Progress
        </button>
        <button 
          onClick={() => setFilter('completed')}
          className={`px-3 py-1 rounded-md ${filter === 'completed' ? 'bg-green-100 font-medium' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          Completed
        </button>
      </div>
      
      {filteredEvents.length > 0 ? (
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-700">{event.title}</h3>
                <span className={`text-sm font-medium px-2.5 py-0.5 rounded ${getStatusBadgeClass(event.status)}`}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1).replace('-', ' ')}
                </span>
              </div>
              
              <div className="mt-2 text-sm text-gray-600">
                <p><span className="font-medium">Date:</span> {new Date(event.date).toLocaleDateString()}</p>
                <p><span className="font-medium">Location:</span> {event.location}</p>
                <p><span className="font-medium">Role:</span> {event.role}</p>
                <p><span className="font-medium">Coordinator:</span> {event.coordinator.name} ({event.coordinator.email})</p>
                <p className="mt-1">{event.description}</p>
              </div>
              
              <div className="mt-3 flex justify-end space-x-2">
                {event.status === 'upcoming' && (
                  <button
                    onClick={() => cancelAssignment(event.id)}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200"
                  >
                    Cancel
                  </button>
                )}
                
                {event.status === 'in-progress' && (
                  <button
                    onClick={() => markAsCompleted(event.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                  >
                    Mark Completed
                  </button>
                )}
                
                {event.status === 'completed' && (
                  <Link href={`/submit-report/${event.id}`}>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                      Submit Report
                    </button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          {filter === 'all' 
            ? "You don't have any assigned events yet." 
            : `You don't have any ${filter} events.`}
        </div>
      )}
    </div>
  );
};

export default MyAssignedEvents;