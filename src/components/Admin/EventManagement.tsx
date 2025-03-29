"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Users, Edit, Trash2, Eye, PlusCircle, Search, X } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

interface Event {
  _id?: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  status: string;
  description: string;
  image: string; // Changed from imageFile to imageUrl
}

const EventManagement = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('https://ecovision-backend-five.vercel.app/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      Swal.fire('Error', 'Failed to fetch events', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`https://ecovision-backend-five.vercel.app/events/${id}`);
        setEvents(events.filter(event => event._id !== id));
        Swal.fire('Deleted!', 'Your event has been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting event:', error);
        Swal.fire('Error', 'Failed to delete event', 'error');
      }
    }
  };

  const handleCreateEvent = () => {
    setCurrentEvent({
      title: '',
      date: '',
      time: '',
      location: '',
      attendees: 0,
      status: 'Upcoming',
      description: '',
      image: '' // Initialize with empty string
    });
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setCurrentEvent(event);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEvent) return;
  
    try {
      const eventData = {
        title: currentEvent.title,
        date: currentEvent.date,
        time: currentEvent.time,
        location: currentEvent.location,
        attendees: currentEvent.attendees,
        status: currentEvent.status,
        description: currentEvent.description,
        image: currentEvent.image // Include image URL
      };
  
      if (currentEvent._id) {
        // Update existing event
        const response = await axios.patch(
          `https://ecovision-backend-five.vercel.app/events/${currentEvent._id}`,
          eventData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
  
        setEvents(events.map(event => 
          event._id === currentEvent._id ? response.data.event : event
        ));
      } else {
        // Create new event
        const response = await axios.post(
          'https://ecovision-backend-five.vercel.app/events', 
          eventData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        
        setEvents([...events, response.data.event]);
      }
      
      Swal.fire('Success', 'Event saved successfully', 'success');
      setIsModalOpen(false);
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error('Error saving event:', error);
      
      let errorMessage = 'Failed to save event';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      }
      
      Swal.fire('Error', errorMessage, 'error');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!currentEvent) return;
    
    const { name, value } = e.target;
    setCurrentEvent({
      ...currentEvent,
      [name]: name === 'attendees' ? parseInt(value) || 0 : value
    });
  };

  const filteredEvents = events
    .filter(event => 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(event => filterStatus === 'All' || event.status === filterStatus);
  
  return (
    <div className="p-6">
      {/* Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {currentEvent?._id ? 'Edit Event' : 'Create New Event'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                  <input
                    type="text"
                    name="title"
                    value={currentEvent?.title || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={currentEvent?.date || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                      type="time"
                      name="time"
                      value={currentEvent?.time || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={currentEvent?.location || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Attendees</label>
                  <input
                    type="number"
                    name="attendees"
                    value={currentEvent?.attendees || 0}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    min="0"
                    required
                  />
                </div>

                {/* Description (textarea) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={currentEvent?.description || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={4}
                    required
                  />
                </div>

                {/* Image URL Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    name="image"
                    value={currentEvent?.image || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="https://example.com/image.jpg"
                  />
                  {currentEvent?.image && (
                    <div className="mt-2">
                      <img 
                        src={currentEvent.image} 
                        alt="Event preview" 
                        className="h-32 object-cover rounded-md"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={currentEvent?.status || 'Upcoming'}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                >
                  {currentEvent?._id ? 'Update' : 'Create'} Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Event Management</h1>
        <button 
          className="flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          onClick={handleCreateEvent}
        >
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
          
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
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
                      <tr key={event._id} className="border-b hover:bg-gray-50">
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
                          <button 
                            className="p-1 text-blue-600 hover:text-blue-800 mr-1"
                            onClick={() => handleEditEvent(event)}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-1 text-red-600 hover:text-red-800"
                            onClick={() => event._id && handleDeleteEvent(event._id)}
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
            </>
          )}
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
                  {events.length > 0 ? Math.round(events.reduce((sum, e) => sum + e.attendees, 0) / events.length) : 0}
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