"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Edit, Trash2, PlusCircle } from 'lucide-react';

// Mock user data
const initialUsers = [
  { id: 1, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'John Doe', email: 'john.doe@example.com', role: 'Editor', status: 'Active' },
  { id: 3, name: 'Alice Johnson', email: 'alice@example.com', role: 'Viewer', status: 'Inactive' },
  { id: 4, name: 'Bob Wilson', email: 'bob@example.com', role: 'Editor', status: 'Active' },
  { id: 5, name: 'Carol Williams', email: 'carol@example.com', role: 'Viewer', status: 'Active' },
  { id: 6, name: 'Dave Brown', email: 'dave@example.com', role: 'Admin', status: 'Active' },
  { id: 7, name: 'Eva Martinez', email: 'eva@example.com', role: 'Editor', status: 'Inactive' },
];

const ManageUsers = () => {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleDeleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };
  
  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Manage Users</h1>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
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
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === 'Admin' 
                          ? 'bg-red-100 text-red-800' 
                          : user.role === 'Editor' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="p-1 text-blue-600 hover:text-blue-800 mr-1">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-1 text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteUser(user.id)}
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
    </div>
  );
};

export default ManageUsers;