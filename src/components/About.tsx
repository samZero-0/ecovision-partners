import React from 'react';
import { Globe, Users, Award } from 'lucide-react';

const AboutUsSection = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Company Images Section */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-100 rounded-lg overflow-hidden shadow-md">
            <img 
              src="/api/placeholder/500/400" 
              alt="Team Collaboration" 
              className="w-full h-64 object-cover"
            />
          </div>
          <div className="bg-gray-100 rounded-lg overflow-hidden shadow-md">
            <img 
              src="/api/placeholder/500/400" 
              alt="Office Environment" 
              className="w-full h-64 object-cover"
            />
          </div>
        </div>

        {/* Mission and Story Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Our Mission: Driving Environmental Impact
          </h2>
          <p className="text-gray-600 mb-6">
            We are dedicated to promoting sustainability, conservation, and climate action. 
            Our goal is to create meaningful change by empowering communities, developing 
            innovative solutions, and leveraging technology for environmental progress.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <Globe className="mx-auto w-12 h-12 text-green-600 mb-3" />
              <h3 className="font-semibold text-green-800">12 Global Initiatives</h3>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <Users className="mx-auto w-12 h-12 text-blue-600 mb-3" />
              <h3 className="font-semibold text-blue-800">7,600+ Volunteers</h3>
            </div>
            <div className="bg-teal-50 p-4 rounded-lg text-center">
              <Award className="mx-auto w-12 h-12 text-teal-600 mb-3" />
              <h3 className="font-semibold text-teal-800">205,000+ Impact Hours</h3>
            </div>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg">
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Our Story</h4>
            <p className="text-gray-600">
              Founded by passionate environmental advocates, our organization began with a 
              simple yet powerful vision: to create tangible solutions for global sustainability 
              challenges. We've grown from a small team to a global movement, consistently 
              innovating and expanding our impact.
            </p>
          </div>
        </div>
      </div>

      {/* Awards and Recognition */}
      <div className="mt-16 text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          Recognized for Innovative Environmental Solutions
        </h3>
        <div className="flex justify-center items-center space-x-6">
          <div className="bg-white shadow-md rounded-lg px-6 py-3">
            <span className="text-lg font-semibold text-gray-700">#1 in Climate Innovation</span>
          </div>
          <div className="bg-white shadow-md rounded-lg px-6 py-3">
            <span className="text-lg font-semibold text-gray-700">Top Green Tech Award</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsSection;