
"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Users, Edit, Trash2, Eye, PlusCircle, Search } from 'lucide-react';

// Mock event data
const initialEvents = [
  { 
    id: 1, 
    title: 'Annual Fundraiser Gala', 
    date: '2025-04-15', 
    time: '19:00', 
    location: 'Grand Hotel', 
    attendees: 120, 
    status: 'Upcoming' 
  },
  { 
    id: 2, 
    title: 'Community Cleanup Drive', 
    date: '2025-04-02', 
    time: '09:00', 
    location: 'City Park', 
    attendees: 45, 
    status: 'Upcoming' 
  },
  { 
    id: 3, 
    title: 'Volunteer Orientation', 
    date: '2025-03-25', 
    time: '17:30', 
    location: 'Main Office', 
    attendees: 22, 
    status: 'Completed' 
  },
  { 
    id: 4, 
    title: 'Board Meeting', 
    date: '2025-04-10', 
    time: '14:00', 
    location: 'Conference Room A', 
    attendees: 8, 
    status: 'Upcoming' 
  },
  { 
    id: 5, 
    title: 'Donor Appreciation Day', 
    date: '2025-03-18', 
    time: '12:00', 
    location: 'Riverside Gardens', 
    attendees: 65, 
    status: 'Completed' 
  },
];

const EventManagement = () => {
  const [events, setEvents] = useState(initialEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter(event => event.id !== id));
  };
  
  const filteredEvents = events
    .filter(event => 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(event => filterStatus === 'All' || event.status === filterStatus);
  
  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Event Management</h1>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          <PlusCircle className="h-5 w-5 mr-2" />
          Create New Event
        </button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute top-3 left-3 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search events..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Events</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left border-b">Event Name</th>
                  <th className="px-4 py-2 text-left border-b">Date</th>
                  <th className="px-4 py-2 text-left border-b">Time</th>
                  <th className="px-4 py-2 text-left border-b">Location</th>
                  <th className="px-4 py-2 text-left border-b">Attendees</th>
                  <th className="px-4 py-2 text-left border-b">Status</th>
                  <th className="px-4 py-2 text-right border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{event.title}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                        {event.date}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-500" />
                        {event.time}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                        {event.location}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-gray-500" />
                        {event.attendees}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        event.status === 'Upcoming' 
                          ? 'bg-blue-100 text-blue-800' 
                          : event.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="p-1 text-gray-600 hover:text-gray-800 mr-1">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-blue-600 hover:text-blue-800 mr-1">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-1 text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-500">Showing {filteredEvents.length} of {events.length} events</p>
            <div className="flex">
              <button className="px-3 py-1 border rounded-l-md hover:bg-gray-50">Previous</button>
              <button className="px-3 py-1 border-t border-b border-r rounded-r-md bg-blue-50 text-blue-600">Next</button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Event Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-4 rounded-md text-center">
              <p className="text-gray-500">Calendar view will be implemented here</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Event Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-sm text-blue-500">Upcoming Events</p>
                <p className="text-2xl font-bold">{events.filter(e => e.status === 'Upcoming').length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-md">
                <p className="text-sm text-green-500">Completed Events</p>
                <p className="text-2xl font-bold">{events.filter(e => e.status === 'Completed').length}</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-md">
                <p className="text-sm text-amber-500">Total Attendees</p>
                <p className="text-2xl font-bold">{events.reduce((sum, e) => sum + e.attendees, 0)}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-md">
                <p className="text-sm text-purple-500">Avg. Attendees</p>
                <p className="text-2xl font-bold">
                  {Math.round(events.reduce((sum, e) => sum + e.attendees, 0) / events.length)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventManagement;