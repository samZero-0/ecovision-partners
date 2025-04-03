"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Edit, Trash2, PlusCircle, ChevronDown, ChevronUp } from 'lucide-react';
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
    axios.get('https://ecovision-backend-five.vercel.app/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error("Error fetching users:", err));
  };
  
  const filteredUsers = users?.filter(user => 
    user?.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
        axios.delete(`https://ecovision-backend-five.vercel.app/users/${id}`)
          .then(res => {
            if (res.data.success) {
              setUsers(users.filter(user => user._id !== id));
              Swal.fire('Deleted!', 'User has been deleted.', 'success');
            }
          })
          .catch(err => {
            console.error("Error deleting user:", err);
            Swal.fire('Error!', 'Failed to delete user.', 'error');
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
    
    if (modalMode === 'add') {
      axios.post('https://ecovision-backend-five.vercel.app/users', formData)
        .then(res => {
          if (res.data.success) {
            fetchUsers();
            setIsModalOpen(false);
            Swal.fire('Success!', 'User has been added.', 'success');
          }
        })
        .catch(err => {
          console.error("Error adding user:", err);
          Swal.fire('Error!', 'Failed to add user.', 'error');
        });
    } else {
      axios.patch(`https://ecovision-backend-five.vercel.app/users/${selectedUser?._id}`, formData)
        .then(() => {
          fetchUsers();
          setIsModalOpen(false);
          Swal.fire('Updated!', 'User has been updated.', 'success');
        })
        .catch(err => {
          console.error("Error updating user:", err);
          Swal.fire('Error!', 'Failed to update user.', 'error');
        });
    }
  };

  const toggleUserExpand = (userId: string) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'donor': return 'bg-blue-100 text-blue-800';
      case 'volunteer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="p-4  sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Manage Users</h1>
        <button 
          onClick={handleAddUser} 
          className="flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-black text-white rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
        >
          <PlusCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          Add New User
        </button>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">User Management</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4 relative">
            <Search className="absolute top-3 left-3 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              className="pl-9 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left border-b text-sm font-medium">Name</th>
                  <th className="px-4 py-3 text-left border-b text-sm font-medium">Email</th>
                  <th className="px-4 py-3 text-left border-b text-sm font-medium">Role</th>
                  <th className="px-4 py-3 text-left border-b text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-right border-b text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{user.displayName}</td>
                    <td className="px-4 py-3 text-sm">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button 
                        onClick={() => handleEditUser(user)} 
                        className="p-1 text-blue-600 hover:text-blue-800 mr-2"
                        aria-label="Edit user"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-1 text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteUser(user._id)}
                        aria-label="Delete user"
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
          <div className="sm:hidden space-y-2">
            {filteredUsers.map((user) => (
              <div key={user._id} className="border rounded-lg p-3">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleUserExpand(user._id)}
                >
                  <div>
                    <p className="font-medium">{user.displayName}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  {expandedUser === user._id ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>
                
                {expandedUser === user._id && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Role:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">Status:</span>
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEditUser(user)} 
                        className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 flex items-center"
                      >
                        <Edit className="h-3 w-3 mr-1" /> Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user._id)}
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
              Showing {filteredUsers.length} of {users.length} users
            </p>
            <div className="flex gap-1">
              <button className="px-3 py-1 border rounded-l-md hover:bg-gray-50 text-sm">
                Previous
              </button>
              <button className="px-3 py-1 border-t border-b border-r rounded-r-md bg-blue-50 text-blue-600 text-sm">
                Next
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* User Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-bold mb-4">
              {modalMode === 'add' ? 'Add New User' : 'Edit User'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
                  required
                  disabled={modalMode === 'edit'}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Photo URL</label>
                <input
                  type="text"
                  name="photoURL"
                  value={formData.photoURL}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
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
                  className="px-3 py-2 text-sm sm:px-4 sm:py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 text-sm sm:px-4 sm:py-2 bg-black text-white rounded-md hover:bg-blue-700"
                >
                  {modalMode === 'add' ? 'Add User' : 'Update User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;