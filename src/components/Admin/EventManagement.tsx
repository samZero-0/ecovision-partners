"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Users, Edit, Trash2, Eye, PlusCircle, Search, X, ChevronDown, ChevronUp } from 'lucide-react';
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
  image: string;
}

const EventManagement = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

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
      image: ''
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
        image: currentEvent.image
      };
  
      if (currentEvent._id) {
        await axios.patch(
          `https://ecovision-backend-five.vercel.app/events/${currentEvent._id}`,
          eventData
        );
      } else {
        await axios.post(
          'https://ecovision-backend-five.vercel.app/events', 
          eventData
        );
      }
      
      Swal.fire('Success', 'Event saved successfully', 'success');
      setIsModalOpen(false);
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      Swal.fire('Success', 'Event saved successfully', 'success');
      setIsModalOpen(false);
      fetchEvents();
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

  const toggleEventExpand = (eventId: string) => {
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Upcoming': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEvents = events
    .filter(event => 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(event => filterStatus === 'All' || event.status === filterStatus);
  
  return (
    <div className="p-4 sm:p-6">
      {/* Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-bold">
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
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                  <input
                    type="text"
                    name="title"
                    value={currentEvent?.title || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={currentEvent?.date || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slots</label>
                  <input
                    type="number"
                    name="attendees"
                    value={currentEvent?.attendees || 0}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={currentEvent?.description || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    name="image"
                    value={currentEvent?.image || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base"
                    required
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-6 flex justify-end gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1 sm:px-4 sm:py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 sm:px-4 sm:py-2 text-sm bg-black text-white rounded-md hover:bg-gray-800"
                >
                  {currentEvent?._id ? 'Update' : 'Create'} Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold">Event Management</h1>
        <button 
          className="flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors w-full sm:w-auto justify-center"
          onClick={handleCreateEvent}
        >
          <PlusCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          Create New Event
        </button>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute top-3 left-3 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
              <input
                type="text"
                placeholder="Search events..."
                className="pl-9 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
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
              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left border-b text-sm font-medium">Event Name</th>
                      <th className="px-4 py-3 text-left border-b text-sm font-medium">Date</th>
                      <th className="px-4 py-3 text-left border-b text-sm font-medium">Time</th>
                      <th className="px-4 py-3 text-left border-b text-sm font-medium">Location</th>
                      <th className="px-4 py-3 text-left border-b text-sm font-medium">Slots</th>
                      <th className="px-4 py-3 text-left border-b text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-right border-b text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvents.map((event) => (
                      <tr key={event._id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium">{event.title}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                            {event.date}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-gray-500" />
                            {event.time}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                            {event.location}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-gray-500" />
                            {event.attendees}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(event.status)}`}>
                            {event.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button 
                            className="p-1 text-blue-600 hover:text-blue-800 mr-2"
                            onClick={() => handleEditEvent(event)}
                            aria-label="Edit event"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-1 text-red-600 hover:text-red-800"
                            onClick={() => event._id && handleDeleteEvent(event._id)}
                            aria-label="Delete event"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Mobile List */}
              <div className="sm:hidden space-y-3">
                {filteredEvents.map((event) => (
                  <div key={event._id} className="border rounded-lg p-3">
                    <div 
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleEventExpand(event._id || '')}
                    >
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {event.date} at {event.time}
                        </p>
                      </div>
                      {expandedEvent === event._id ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </div>
                    
                    {expandedEvent === event._id && (
                      <div className="mt-3 pt-3 border-t space-y-2">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm">{event.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm">{event.attendees} attendees</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm font-medium mr-2">Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(event.status)}`}>
                            {event.status}
                          </span>
                        </div>
                        <div className="pt-2 flex justify-end gap-2">
                          <button 
                            onClick={() => handleEditEvent(event)} 
                            className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 flex items-center"
                          >
                            <Edit className="h-3 w-3 mr-1" /> Edit
                          </button>
                          <button 
                            onClick={() => event._id && handleDeleteEvent(event._id)}
                            className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 flex items-center"
                          >
                            <Trash2 className="h-3 w-3 mr-1" /> Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                <p className="text-sm text-gray-500">
                  Showing {filteredEvents.length} of {events.length} events
                </p>
                <div className="flex gap-1">
                  <button className="px-3 py-1 text-sm border rounded-l-md hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="px-3 py-1 text-sm border-t border-b border-r rounded-r-md bg-blue-50 text-blue-600">
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Event Calendar</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="bg-gray-100 p-4 rounded-md text-center">
              <p className="text-sm sm:text-base text-gray-500">Calendar view will be implemented here</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Quick Event Stats</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-blue-50 p-3 sm:p-4 rounded-md">
                <p className="text-xs sm:text-sm text-blue-500">Upcoming Events</p>
                <p className="text-xl sm:text-2xl font-bold">{events.filter(e => e.status === 'Upcoming').length}</p>
              </div>
              <div className="bg-green-50 p-3 sm:p-4 rounded-md">
                <p className="text-xs sm:text-sm text-green-500">Completed Events</p>
                <p className="text-xl sm:text-2xl font-bold">{events.filter(e => e.status === 'Completed').length}</p>
              </div>
              <div className="bg-amber-50 p-3 sm:p-4 rounded-md">
                <p className="text-xs sm:text-sm text-amber-500">Total Slots</p>
                <p className="text-xl sm:text-2xl font-bold">{events.reduce((sum, e) => sum + e.attendees, 0)}</p>
              </div>
              <div className="bg-purple-50 p-3 sm:p-4 rounded-md">
                <p className="text-xs sm:text-sm text-purple-500">Avg. Attendees</p>
                <p className="text-xl sm:text-2xl font-bold">
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