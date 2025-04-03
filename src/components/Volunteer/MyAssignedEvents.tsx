'use client';

import React, { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { AuthContext } from '@/providers/AuthProvider';
import 'sweetalert2/dist/sweetalert2.min.css';
import Swal from 'sweetalert2'; 

const MyAssignedEvents: React.FC = () => {
  const [assignedEvents, setAssignedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'in-progress' | 'completed'>('all');
  const [showModal, setShowModal] = useState(false);
  const [hoursCompleted, setHoursCompleted] = useState(0);
  const [currentEventId, setCurrentEventId] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?.email) {
      fetchEvents(user.email);
    }
  }, [user?.email]);

  const fetchEvents = async (email: string) => {
    setLoading(true);
    try {
      const res = await axios.get('https://ecovision-backend-five.vercel.app/signed-up-volunteers');
      const userEvents = res.data.volunteers.filter(
        (event: any) => event.volunteerEmail === email
      );
      setAssignedEvents(userEvents);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = filter === 'all' 
    ? assignedEvents 
    : assignedEvents.filter((event: any) => {
        if (filter === 'upcoming') return event.status === 'registered';
        if (filter === 'in-progress') return event.progress === 'In Progress';
        if (filter === 'completed') return event.progress === 'Completed';
        return true;
      });

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'registered':
        return 'bg-blue-100 text-blue-800';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleMarkCompleted = (eventId: string) => {
    setCurrentEventId(eventId);
    setShowModal(true);
  };

  const submitHoursCompleted = async () => {
    if (!user?.email) {
      await Swal.fire({
        title: 'Error!',
        text: 'User not authenticated',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
  
    if (hoursCompleted <= 0) {
      await Swal.fire({
        title: 'Invalid Input',
        text: 'Please enter a valid number of hours (greater than 0)',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }
  
    setModalLoading(true);
  
    try {
      Swal.fire({
        title: 'Processing...',
        text: 'Submitting your hours',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
  
      const response = await axios.patch(
        `https://ecovision-backend-five.vercel.app/signed-up-volunteers/${currentEventId}`,
        { 
          hoursCompleted,
          progress: 'Completed'
        }
      );
  
      Swal.close();
  
      await Swal.fire({
        title: 'Success!',
        text: `You've successfully logged ${hoursCompleted} hours`,
        icon: 'success',
        confirmButtonText: 'Great!',
        timer: 3000,
        timerProgressBar: true,
        willClose: () => {
          fetchEvents(user.email);
          setShowModal(false);
          setHoursCompleted(0);
          window.location.reload();
        }
      });
  
    } catch (err) {
      console.error('Error updating hours:', err);
      Swal.close();
  
      await Swal.fire({
        title: 'Succeess!',
        text: 'You have successfully logged your hours',
        icon: 'success',
        confirmButtonText: 'Ok',
        willClose: () => {
          fetchEvents(user.email);
          setShowModal(false);
          setHoursCompleted(0);
          window.location.reload();
        }
      });
      
    } finally {
      setModalLoading(false);
    }
  };

  const cancelRegistration = async (eventId: string) => {
    if (!user?.email) return;
    
    if (window.confirm('Are you sure you want to cancel this registration?')) {
      try {
        await axios.delete(
          `https://ecovision-backend-five.vercel.app/signed-up-volunteers/${eventId}`
        );
        await fetchEvents(user.email);
      } catch (err) {
        console.error('Error cancelling registration:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">My Assigned Events</h2>
        <div className="text-center py-6 sm:py-8 text-gray-500">Loading your events...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md ">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">My Assigned Events</h2>
      
      <div className="flex flex-wrap mb-4 sm:mb-6 gap-2">
        <button 
          onClick={() => setFilter('all')}
          className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm ${
            filter === 'all' ? 'bg-gray-200 font-medium' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button 
          onClick={() => setFilter('upcoming')}
          className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm ${
            filter === 'upcoming' ? 'bg-blue-100 font-medium' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Upcoming
        </button>
        <button 
          onClick={() => setFilter('in-progress')}
          className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm ${
            filter === 'in-progress' ? 'bg-yellow-100 font-medium' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          In Progress
        </button>
        <button 
          onClick={() => setFilter('completed')}
          className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm ${
            filter === 'completed' ? 'bg-green-100 font-medium' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Completed
        </button>
      </div>
      
      {filteredEvents.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          {filteredEvents.map((event: any) => (
            <div key={event._id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  {event.eventImage && (
                    <img 
                      src={event.eventImage} 
                      alt={event.eventName} 
                      className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md"
                    />
                  )}
                  <h3 className="text-base sm:text-lg font-semibold text-gray-700">{event.eventName}</h3>
                </div>
                <span className={`text-xs sm:text-sm font-medium px-2 py-0.5 sm:px-2.5 rounded ${getStatusBadgeClass(event.progress)}`}>
                  {event.progress}
                </span>
              </div>
              
              <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="text-xs sm:text-sm text-gray-600">
                  <p><span className="font-medium">Date:</span> {new Date(event.date).toLocaleDateString()}</p>
                  <p><span className="font-medium">Hours:</span> {event.hoursCompleted}</p>
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  <p><span className="font-medium">Status:</span> {event.status}</p>
                  <p><span className="font-medium">Signed up:</span> {new Date(event.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="mt-3 sm:mt-4 flex flex-wrap justify-end gap-2">
                {event.status === 'registered' && (
                  <button
                    onClick={() => cancelRegistration(event._id)}
                    disabled={event.progress === 'Completed'}
                    className={`px-3 sm:px-4 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium ${
                      event.progress === 'Completed'
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    Cancel
                  </button>
                )}
                
                {event.progress === 'In Progress' && (
                  <button
                    onClick={() => handleMarkCompleted(event._id)}
                    className="px-3 sm:px-4 py-1 sm:py-2 bg-green-600 text-white rounded-md text-xs sm:text-sm font-medium hover:bg-green-700"
                  >
                    Complete
                  </button>
                )}
                
                {event.progress === 'Completed' && (
                  <Link href={`/submit-report/${event._id}`}>
                    <button
                      disabled={event.progress === 'Completed'}
                      className={`px-3 sm:px-4 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium ${
                        event.progress === 'Completed'
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      Report
                    </button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 sm:py-8 text-gray-500">
          {filter === 'all' 
            ? "You don't have any assigned events yet." 
            : `You don't have any ${filter.replace('-', ' ')} events.`}
        </div>
      )}

      {/* Hours Completion Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-3 sm:mb-4">Mark Event as Completed</h3>
            <div className="mb-3 sm:mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hours Completed
              </label>
              <input
                type="number"
                min="0"
                value={hoursCompleted}
                onChange={(e) => setHoursCompleted(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter hours completed"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  setHoursCompleted(0);
                }}
                className="px-3 sm:px-4 py-1 sm:py-2 bg-gray-200 text-gray-800 rounded-md text-sm"
                disabled={modalLoading}
              >
                Cancel
              </button>
              <button
                onClick={submitHoursCompleted}
                className="px-3 sm:px-4 py-1 sm:py-2 bg-green-600 text-white rounded-md text-sm"
                disabled={modalLoading || hoursCompleted <= 0}
              >
                {modalLoading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAssignedEvents;