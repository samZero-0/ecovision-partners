'use client';

import { motion } from 'framer-motion';
import { 
  PartyPopper, 
  Users, 
  Camera, 
  Utensils, 
  Music2, 
  MapPin, 
  Calendar, 
  Clock,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

const WhatWeOffer = () => {
  const services = [
    {
      icon: PartyPopper,
      title: "Full Event Planning",
      description: "From concept to execution, we handle every detail of your event with precision and creativity.",
      features: ["Venue Selection", "Theme Design", "Timeline Management", "Vendor Coordination"],
      color: "bg-purple-500"
    },
    {
      icon: Users,
      title: "Corporate Events",
      description: "Elevate your business gatherings with our professional corporate event management services.",
      features: ["Conference Planning", "Team Building", "Product Launches", "Award Ceremonies"],
      color: "bg-blue-500"
    },
    {
      icon: Camera,
      title: "Wedding Planning",
      description: "Create unforgettable moments with our comprehensive wedding planning services.",
      features: ["Ceremony Design", "Reception Planning", "Vendor Management", "Timeline Coordination"],
      color: "bg-pink-500"
    },
    {
      icon: Utensils,
      title: "Catering Services",
      description: "Delight your guests with exquisite culinary experiences tailored to your event.",
      features: ["Menu Planning", "Dietary Accommodations", "Service Staff", "Bar Service"],
      color: "bg-amber-500"
    },
    {
      icon: Music2,
      title: "Entertainment",
      description: "Keep your guests engaged with our premium entertainment solutions.",
      features: ["Live Bands", "DJs", "Performers", "Interactive Activities"],
      color: "bg-green-500"
    },
    {
      icon: MapPin,
      title: "Venue Selection",
      description: "Find the perfect location that matches your vision and requirements.",
      features: ["Site Visits", "Capacity Planning", "Layout Design", "Vendor Coordination"],
      color: "bg-red-500"
    }
  ];

  const stats = [
    { value: "500+", label: "Events Organized" },
    { value: "50+", label: "Venue Partners" },
    { value: "100%", label: "Client Satisfaction" },
    { value: "15+", label: "Years Experience" }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Sparkles className="w-5 h-5 text-teal-500" />
            <span className="text-sm font-semibold text-black tracking-wider uppercase">
              Our Services
            </span>
            <Sparkles className="w-5 h-5 text-teal-500" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-800"
          >
            What We Offer
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600"
          >
            Transform your vision into reality with our comprehensive event management services
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-shadow duration-500"
            >
              <div className="p-8">
                <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                
                <ul className="space-y-3">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-700">
                      <ChevronRight className="w-4 h-4 text-purple-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="px-8 py-4 bg-gray-50 border-t">
                <button className="text-teal-600 font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                  Learn More
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-teal-600 to-green-600 rounded-3xl p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-sm mb-4">
                  {index === 0 && <Calendar className="w-8 h-8 text-white" />}
                  {index === 1 && <MapPin className="w-8 h-8 text-white" />}
                  {index === 2 && <Users className="w-8 h-8 text-white" />}
                  {index === 3 && <Clock className="w-8 h-8 text-white" />}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-6">
            Ready to Create Your Perfect Event?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Let's work together to bring your vision to life. Our team of expert event planners is here to help you every step of the way.
          </p>
        <Link href='/login'>
        <button className="bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-teal-700 transition-colors flex items-center gap-2 mx-auto">
            Schedule a Consultation
            <ChevronRight className="w-5 h-5" />
          </button>
        </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default WhatWeOffer;