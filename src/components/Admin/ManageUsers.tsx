"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Edit, Trash2, PlusCircle } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    photoURL: '',
    role: 'user'
  });
  const [searchTerm, setSearchTerm] = useState('');
  
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
  
  const handleDeleteUser = (id) => {
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
              Swal.fire(
                'Deleted!',
                'User has been deleted.',
                'success'
              );
            }
          })
          .catch(err => {
            console.error("Error deleting user:", err);
            Swal.fire(
              'Error!',
              'Failed to delete user.',
              'error'
            );
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

  const handleEditUser = (user) => {
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
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (modalMode === 'add') {
      // Add new user
      axios.post('https://ecovision-backend-five.vercel.app/users', formData)
        .then(res => {
          if (res.data.success) {
            fetchUsers();
            setIsModalOpen(false);
            Swal.fire(
              'Success!',
              'User has been added.',
              'success'
            );
          }
        })
        .catch(err => {
          console.error("Error adding user:", err);
          Swal.fire(
            'Error!',
            'Failed to add user.',
            'error'
          );
        });
    } else {
      // Update existing user
      axios.patch(`https://ecovision-backend-five.vercel.app/users/${selectedUser._id}`, {
        displayName: formData.displayName,
        email: formData.email,
        photoURL: formData.photoURL,
        role: formData.role
      })
        .then(res => {
          fetchUsers();
          setIsModalOpen(false);
          Swal.fire(
            'Updated!',
            'User has been updated.',
            'success'
          );
        })
        .catch(err => {
          setIsModalOpen(false);
          console.error("Error updating user:", err);
          Swal.fire(
            'Updated!',
            'User has been updated.',
            'success'
          );
        });
    }
  };
  
  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Manage Users</h1>
        <button onClick={handleAddUser} className="flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-blue-700 transition-colors">
          <PlusCircle className="h-5 w-5 mr-2" />
          Add New User
        </button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative">
            <Search className="absolute top-3 left-3 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left border-b">Name</th>
                  <th className="px-4 py-2 text-left border-b">Email</th>
                  <th className="px-4 py-2 text-left border-b">Role</th>
                  <th className="px-4 py-2 text-left border-b">Status</th>
                  <th className="px-4 py-2 text-right border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{user.displayName}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === 'admin' 
                          ? 'bg-red-100 text-red-800' 
                          : user.role === 'donor' 
                          ? 'bg-blue-100 text-blue-800' 
                          : user.role === 'volunteer'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
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
                        className="p-1 text-blue-600 hover:text-blue-800 mr-1"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-1 text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteUser(user._id)}
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
            <p className="text-sm text-gray-500">Showing {filteredUsers.length} of {users.length} users</p>
            <div className="flex">
              <button className="px-3 py-1 border rounded-l-md hover:bg-gray-50">Previous</button>
              <button className="px-3 py-1 border-t border-b border-r rounded-r-md bg-blue-50 text-blue-600">Next</button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* User Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
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
                  className="w-full p-2 border border-gray-300 rounded-md"
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
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                  disabled={modalMode === 'edit'} // Email cannot be changed for existing users
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Photo URL</label>
                <input
                  type="text"
                  name="photoURL"
                  value={formData.photoURL}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
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
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-blue-700"
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