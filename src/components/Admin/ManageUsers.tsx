"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Edit, Trash2, PlusCircle, ChevronDown, ChevronUp, User as UserIcon, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    photoURL: '',
    role: 'user'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  interface User {
    _id: string;
    displayName?: string;
    email?: string;
    photoURL?: string;
    role: string;
  }
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = () => {
    setIsLoading(true);
    axios.get('https://ecovision-backend-five.vercel.app/users')
      .then(res => {
        setUsers(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching users:", err);
        setIsLoading(false);
        Swal.fire('Error!', 'Failed to load users.', 'error');
      });
  };
  
  const filteredUsers = users?.filter(user => 
    user?.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  
  const handleDeleteUser = (id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        axios.delete(`https://ecovision-backend-five.vercel.app/users/${id}`)
          .then(res => {
            if (res.data.success) {
              setUsers(users.filter(user => user._id !== id));
              Swal.fire('Deleted!', 'User has been deleted.', 'success');
            }
            setIsLoading(false);
          })
          .catch(err => {
            console.error("Error deleting user:", err);
            Swal.fire('Error!', 'Failed to delete user.', 'error');
            setIsLoading(false);
          });
      }
    });
  };

  const handleAddUser = () => {
    setFormData({
      displayName: '',
      email: '',
      photoURL: '',
      role: 'user'
    });
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      displayName: user.displayName || '',
      email: user.email || '',
      photoURL: user.photoURL || '',
      role: user.role || 'user'
    });
    setModalMode('edit');
    setIsModalOpen(true);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (modalMode === 'add') {
      axios.post('https://ecovision-backend-five.vercel.app/users', formData)
        .then(res => {
          if (res.data.success) {
            fetchUsers();
            setIsModalOpen(false);
            Swal.fire({
              title: 'Success!',
              text: 'User has been added.',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500
            });
          }
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Error adding user:", err);
          Swal.fire('Error!', 'Failed to add user.', 'error');
          setIsLoading(false);
        });
    } else {
      axios.patch(`https://ecovision-backend-five.vercel.app/users/${selectedUser?._id}`, formData)
        .then(() => {
          fetchUsers();
          setIsModalOpen(false);
          Swal.fire({
            title: 'Updated!',
            text: 'User has been updated.',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          });
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Error updating user:", err);
          Swal.fire('Error!', 'Failed to update user.', 'error');
          setIsLoading(false);
        });
    }
  };

  const toggleUserExpand = (userId: string) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border border-red-200';
      case 'donor': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'volunteer': return 'bg-green-100 text-green-800 border border-green-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <div className="h-2 w-2 rounded-full bg-red-500"></div>;
      case 'donor': return <div className="h-2 w-2 rounded-full bg-blue-500"></div>;
      case 'volunteer': return <div className="h-2 w-2 rounded-full bg-green-500"></div>;
      default: return <div className="h-2 w-2 rounded-full bg-gray-500"></div>;
    }
  };

  const getInitials = (name: string = '') => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  
  return (
    <div className="p-4 sm:p-6  min-h-screen">
      <div className="max-w-8xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Users</h1>
            <p className="text-gray-500 mt-1">Add, edit and manage system users</p>
          </div>
          <button 
            onClick={handleAddUser} 
            className="flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors w-full sm:w-auto justify-center shadow-sm group"
          >
            <PlusCircle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
            Add New User
          </button>
        </div>
        
        <Card className="mb-6 shadow-sm border-0">
          <CardHeader className="p-4 sm:p-6 bg-white rounded-t-lg border-b">
            <CardTitle className="text-lg sm:text-xl flex items-center">
              <UserIcon className="h-5 w-5 mr-2 text-gray-400" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 bg-white rounded-b-lg">
            <div className="mb-4 relative">
              <Search className="absolute top-3 left-3 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left border-b text-sm font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-4 py-3 text-left border-b text-sm font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-4 py-3 text-left border-b text-sm font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-4 py-3 text-left border-b text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-right border-b text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUsers.length > 0 ? (
                        currentUsers.map((user) => (
                          <tr key={user._id} className="border-b hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-sm">
                              <div className="flex items-center">
                                {user.photoURL ? (
                                  <img 
                                    src={user.photoURL} 
                                    alt={user.displayName}
                                    className="w-8 h-8 rounded-full mr-3 object-cover"
                                  />
                                ) : (
                                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3 text-sm font-medium text-gray-600">
                                    {getInitials(user.displayName)}
                                  </div>
                                )}
                                <span className="font-medium text-gray-800">{user.displayName}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                {getRoleIcon(user.role)}
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                                  {user.role}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                Active
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end">
                                <button 
                                  onClick={() => handleEditUser(user)} 
                                  className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors mr-2"
                                  aria-label="Edit user"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button 
                                  className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                                  onClick={() => handleDeleteUser(user._id)}
                                  aria-label="Delete user"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-gray-500">
                            No users found matching your search criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Mobile List */}
                <div className="sm:hidden space-y-3">
                  {currentUsers.length > 0 ? (
                    currentUsers.map((user) => (
                      <div key={user._id} className="border rounded-lg p-3 bg-white shadow-sm">
                        <div 
                          className="flex justify-between items-center cursor-pointer"
                          onClick={() => toggleUserExpand(user._id)}
                        >
                          <div className="flex items-center">
                            {user.photoURL ? (
                              <img 
                                src={user.photoURL} 
                                alt={user.displayName}
                                className="w-10 h-10 rounded-full mr-3 object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3 text-sm font-medium text-gray-600">
                                {getInitials(user.displayName)}
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-800">{user.displayName}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                          {expandedUser === user._id ? (
                            <ChevronUp className="h-5 w-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        
                        {expandedUser === user._id && (
                          <div className="mt-3 pt-3 border-t animate-fadeIn">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-500">Role:</span>
                              <div className="flex items-center">
                                {getRoleIcon(user.role)}
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                                  {user.role}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-medium text-gray-500">Status:</span>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                Active
                              </span>
                            </div>
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditUser(user);
                                }} 
                                className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 flex items-center border border-blue-200 transition-colors"
                              >
                                <Edit className="h-3 w-3 mr-1" /> Edit
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteUser(user._id);
                                }}
                                className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 flex items-center border border-red-200 transition-colors"
                              >
                                <Trash2 className="h-3 w-3 mr-1" /> Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 border rounded-lg">
                      No users found matching your search criteria.
                    </div>
                  )}
                </div>
                
                <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <p className="text-sm text-gray-500">
                    Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
                  </p>
                  
                  {totalPages > 1 && (
                    <div className="flex gap-1">
                      <button 
                        className={`px-3 py-1 border rounded-l-md text-sm transition-colors ${currentPage === 1 ? 'text-gray-400 bg-gray-50' : 'hover:bg-gray-50 text-gray-700'}`}
                        onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                        <button
                          key={number}
                          onClick={() => paginate(number)}
                          className={`px-3 py-1 border text-sm ${
                            currentPage === number 
                              ? 'bg-black text-white' 
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          {number}
                        </button>
                      ))}
                      <button 
                        className={`px-3 py-1 border rounded-r-md text-sm transition-colors ${currentPage === totalPages ? 'text-gray-400 bg-gray-50' : 'hover:bg-gray-50 text-gray-700'}`}
                        onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* User Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div 
            className="bg-white p-5 sm:p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                {modalMode === 'add' ? 'Add New User' : 'Edit User'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Name</label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${modalMode === 'edit' ? 'bg-gray-100' : ''}`}
                  required
                  disabled={modalMode === 'edit'}
                />
                {modalMode === 'edit' && (
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Photo URL</label>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {formData.photoURL ? (
                      <img 
                        src={formData.photoURL} 
                        alt="User avatar preview"
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '#';
                          // Set to fallback image or hide
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                        {getInitials(formData.displayName)}
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    name="photoURL"
                    value={formData.photoURL}
                    onChange={handleInputChange}
                    className="flex-1 p-2 border border-gray-300 rounded-md text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1 text-gray-700">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="donor">Donor</option>
                  <option value="volunteer">Volunteer</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm sm:text-base bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {modalMode === 'add' ? 'Adding...' : 'Updating...'}
                    </>
                  ) : (
                    modalMode === 'add' ? 'Add User' : 'Update User'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add a global style for animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ManageUsers;