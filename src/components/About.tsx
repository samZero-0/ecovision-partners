'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Users, Award, ArrowRight } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const AboutUsSection = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-20">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-16 items-center"
        >
          {/* Company Images Section */}
          <motion.div 
            variants={fadeInUp}
            className="grid grid-cols-2 gap-6"
          >
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ type: "tween" }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg transform hover:shadow-2xl transition-all duration-300"
            >
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80" 
                alt="Team Collaboration" 
                className="w-full h-64 object-cover"
              />
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ type: "tween" }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg transform hover:shadow-2xl transition-all duration-300 mt-8"
            >
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80" 
                alt="Office Environment" 
                className="w-full h-64 object-cover"
              />
            </motion.div>
          </motion.div>

          {/* Mission and Story Section */}
          <motion.div variants={fadeInUp}>
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl font-bold text-gray-800 mb-8 leading-tight"
            >
              Our Mission: Driving
              <span className="text-green-600"> Environmental Impact</span>
            </motion.h2>
            
            <motion.p 
              variants={fadeInUp}
              className="text-gray-600 text-lg mb-8 leading-relaxed"
            >
              We are dedicated to promoting sustainability, conservation, and climate action. 
              Our goal is to create meaningful change by empowering communities, developing 
              innovative solutions, and leveraging technology for environmental progress.
            </motion.p>

            <motion.div 
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-6 mb-12"
            >
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl shadow-sm"
              >
                <Globe className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="font-bold text-green-800 text-xl mb-2">12</h3>
                <p className="text-green-600">Global Initiatives</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl shadow-sm"
              >
                <Users className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="font-bold text-blue-800 text-xl mb-2">7,600+</h3>
                <p className="text-blue-600">Volunteers</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-2xl shadow-sm"
              >
                <Award className="w-12 h-12 text-teal-600 mb-4" />
                <h3 className="font-bold text-teal-800 text-xl mb-2">205,000+</h3>
                <p className="text-teal-600">Impact Hours</p>
              </motion.div>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
            >
              <h4 className="text-2xl font-bold text-gray-800 mb-4">Our Story</h4>
              <p className="text-gray-600 leading-relaxed">
                Founded by passionate environmental advocates, our organization began with a 
                simple yet powerful vision: to create tangible solutions for global sustainability 
                challenges. We've grown from a small team to a global movement, consistently 
                innovating and expanding our impact.
              </p>
              <motion.button 
                whileHover={{ x: 5 }}
                className="flex items-center mt-4 text-green-600 font-semibold"
              >
                Learn more <ArrowRight className="ml-2 w-4 h-4" />
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Awards and Recognition */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20 text-center"
        >
          <h3 className="text-3xl font-bold text-gray-800 mb-8">
            Recognized for Innovative Environmental Solutions
          </h3>
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap justify-center items-center gap-6"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white shadow-lg rounded-2xl px-8 py-4 border border-gray-100"
            >
              <span className="text-xl font-bold text-gray-700">#1 in Climate Innovation</span>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white shadow-lg rounded-2xl px-8 py-4 border border-gray-100"
            >
              <span className="text-xl font-bold text-gray-700">Top Green Tech Award</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUsSection;