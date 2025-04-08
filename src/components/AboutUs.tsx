import React from 'react';
import Image from 'next/image';

const AboutUs: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative h-96 w-full">
        <div className="absolute inset-0 bg-teal-900/70 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-teal-950/80 z-20"></div>
        <div className="h-full w-full relative">
          {/* Using placeholder image - you should replace this with your actual image */}
          <div className="absolute inset-0">
            <Image 
              src="https://image.cdn2.seaart.me/2025-04-01/cvlsf3le878c738gfipg-1/9979fc9084ca882bd4504a0610e90980_high.webp" 
              alt="Environmental conservation" 
              layout="fill"
              objectFit="cover"
              className="opacity-90"
            />
          </div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Mission</h1>
            <p className="text-xl text-white max-w-2xl mx-auto">
              Dedicated to promoting sustainability, conservation, and meaningful climate action
            </p>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-green-800 mb-6">Our Story</h2>
            <p className="text-gray-700 mb-4">
              Founded with a vision to create positive environmental change, our organization 
              brings together passionate advocates, scientists, and community leaders dedicated 
              to preserving our planet for future generations.
            </p>
            <p className="text-gray-700 mb-6">
              We believe that through education, community engagement, and sustainable practices, 
              we can address the most pressing environmental challenges facing our world today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-teal-600 hover:bg-green-700 text-white py-2 px-6 rounded-md transition duration-300">
                Join Our Mission
              </button>
              <button className="border border-teal-600 text-green-600 hover:bg-green-50 py-2 px-6 rounded-md transition duration-300">
                Learn More
              </button>
            </div>
          </div>
          <div className="relative h-80 rounded-lg overflow-hidden shadow-xl">
            <Image 
              src="https://assets.trainingindustry.com/content/uploads/2022/04/4.1.22-Action-learning-teams-1920x1080.jpg" 
              alt="Our team in action" 
              layout="fill" 
              objectFit="cover"
            />
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="bg-teal-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-12">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
              <p className="text-gray-700">Environmental Events</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">10K+</div>
              <p className="text-gray-700">Volunteers Mobilized</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">25+</div>
              <p className="text-gray-700">Conservation Projects</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">100K+</div>
              <p className="text-gray-700">Trees Planted</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-green-800 mb-12">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4 mx-auto">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-teal-800 text-center mb-3">Sustainability</h3>
            <p className="text-gray-600 text-center">
              We promote sustainable practices that meet present needs without compromising future generations.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4 mx-auto">
              <svg className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-green-800 text-center mb-3">Community</h3>
            <p className="text-gray-600 text-center">
              We believe in the power of community action and collective responsibility for our environment.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4 mx-auto">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-green-800 text-center mb-3">Integrity</h3>
            <p className="text-gray-600 text-center">
              We operate with transparency and accountability in all our environmental initiatives.
            </p>
          </div>
        </div>
      </section>

      {/* Our Team */}
      {/* <section className="bg-green-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-12">Our Leadership Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((member) => (
              <div key={member} className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="h-64 relative">
                  <Image 
                    src={`/api/placeholder/400/400`} 
                    alt={`Team member ${member}`} 
                    layout="fill" 
                    objectFit="cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-green-800">Team Member {member}</h3>
                  <p className="text-green-600 text-sm mb-2">Leadership Role</p>
                  <p className="text-gray-600 text-sm">
                    Passionate environmental advocate with expertise in sustainability and conservation.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Join Us CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto bg-teal-700 rounded-xl overflow-hidden shadow-xl">
          <div className="p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Join Our Mission</h2>
            <p className="text-green-100 mb-8 max-w-2xl mx-auto">
              Whether you're looking to volunteer, donate, or collaborate, there are many ways to 
              support our environmental initiatives and make a positive impact on our planet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white hover:bg-green-50 text-green-700 font-semibold py-3 px-6 rounded-md transition duration-300">
                Become a Volunteer
              </button>
              <button className="bg-green-600 hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-md transition duration-300">
                Donate Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;