'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Autoplay } from 'swiper/modules';
import { Check, Star, Crown, Zap, Users, Calendar, Gift, Shield, Clock, MapPin, Music, Camera, Utensils, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';

const PricingPackages = () => {
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const packages = [
    {
      name: "Basic",
      icon: Star,
      price: 499,
      description: "Perfect for small events and gatherings",
      color: "from-teal-500 to-teal-600",
      bgPattern: "teal",
      features: [
        { text: "Up to 50 guests", icon: Users },
        { text: "Basic venue decoration", icon: Sparkles },
        { text: "4-hour event coverage", icon: Clock },
        { text: "Standard catering service", icon: Utensils },
        { text: "Background music system", icon: Music },
        { text: "Dedicated event coordinator", icon: Users },
        { text: "Venue selection assistance", icon: MapPin },
        { text: "Basic event insurance", icon: Shield }
      ],
      note: "Additional services available at extra cost",
      logo: "B"
    },
    {
      name: "Premium",
      icon: Crown,
      price: 999,
      description: "Ideal for medium-sized events with premium touches",
      color: "from-blue-700 to-blue-800",
      bgPattern: "blue",
      popular: true,
      features: [
        { text: "Up to 150 guests", icon: Users },
        { text: "Premium themed decoration", icon: Sparkles },
        { text: "8-hour event coverage", icon: Clock },
        { text: "Premium catering with 3 menu options", icon: Utensils },
        { text: "Live entertainment (solo artist or DJ)", icon: Music },
        { text: "2 Professional event coordinators", icon: Users },
        { text: "Photo booth with digital copies", icon: Camera },
        { text: "Custom lighting design", icon: Sparkles },
        { text: "Comprehensive event insurance", icon: Shield },
        { text: "Vendor management for 3 suppliers", icon: Gift }
      ],
      note: "Includes 2 planning consultations",
      logo: "P"
    },
    {
      name: "Ultimate",
      icon: Zap,
      price: 1999,
      description: "For large-scale luxury events with full customization",
      color: "from-orange-500 to-orange-600",
      bgPattern: "orange",
      features: [
        { text: "Up to 300 guests", icon: Users },
        { text: "Luxury custom decoration", icon: Sparkles },
        { text: "Full-day event coverage (12 hours)", icon: Clock },
        { text: "Gourmet catering with 5 menu options", icon: Utensils },
        { text: "Live band + professional DJ", icon: Music },
        { text: "Full event team (coordinators, assistants)", icon: Users },
        { text: "Professional photo & video package", icon: Camera },
        { text: "Custom staging and lighting design", icon: Sparkles },
        { text: "VIP guest services", icon: Crown },
        { text: "Premium event insurance", icon: Shield },
        { text: "Full vendor management (up to 8 suppliers)", icon: Gift },
        { text: "Pre-event venue walkthrough", icon: MapPin }
      ],
      note: "Includes 5 planning consultations and rehearsal coordination",
      logo: "U"
    }
  ];

  const features = [
    { 
      icon: Users, 
      title: "Guest Management", 
      description: "Digital RSVP tracking, seating arrangements, and attendee analytics for all package tiers" 
    },
    { 
      icon: Calendar, 
      title: "Timeline Planning", 
      description: "Customized event schedules with vendor coordination and contingency planning" 
    },
    { 
      icon: Gift, 
      title: "Vendor Coordination", 
      description: "Preferred vendor network with negotiated discounts and quality assurance" 
    },
    { 
      icon: Shield, 
      title: "Insurance Coverage", 
      description: "Comprehensive liability coverage scaled to your event size and requirements" 
    }
  ];

  if (!mounted) return null;

  return (
    <section className="py-20 bg-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10"
            style={{
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.1
            }}
            animate={{
              x: [0, (Math.random() - 0.5) * 100],
              y: [0, (Math.random() - 0.5) * 100],
              transition: {
                duration: Math.random() * 30 + 20,
                repeat: Infinity,
                repeatType: "reverse"
              }
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-400 mb-4 text-sm font-medium tracking-wide"
          >
            PRICING PLANS
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-6 text-white"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Choose Your Perfect Package
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400"
          >
            Flexible packages designed to meet your event needs with professional execution
          </motion.p>
        </div>

        {/* 3D Card Slider */}
        <div className="relative max-w-4xl mx-auto mb-20 px-10">
          {/* Navigation Arrows */}
          <div className="absolute inset-y-0 left-0 flex items-center z-10">
            <button className="p-2 rounded-full bg-gray-800/50 backdrop-blur-md text-white hover:bg-gray-700 transition-colors shadow-lg -ml-4">
              {/* <ChevronLeft className="w-6 h-6" /> */}
            </button>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center z-10">
            <button className="p-2 rounded-full bg-gray-800/50 backdrop-blur-md text-white hover:bg-gray-700 transition-colors shadow-lg -mr-4">
              {/* <ChevronRight className="w-6 h-6" /> */}
            </button>
          </div>

          {/* Swipe Instruction */}
          <motion.div 
            className="text-center text-gray-400 text-sm mb-4 flex items-center justify-center gap-2"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" />
              Swipe to explore
              <ChevronRight className="w-4 h-4" />
            </span>
          </motion.div>

          <Swiper
            effect="cards"
            grabCursor={true}
            modules={[EffectCards, Autoplay]}
            autoplay={{
              delay: 5000,
              disableOnInteraction: true,
            }}
            className="w-full"
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            spaceBetween={30} // Added space between cards
            slidesPerView={1} // Makes cards slightly overlap but still visible
            centeredSlides={true} // Centers the active card
          >
            {packages.map((pkg, index) => (
              <SwiperSlide key={pkg.name} className="py-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0.7 }}
                  animate={{ 
                    scale: activeIndex === index ? 1 : 1,
                    opacity: activeIndex === index ? 1 : 0.7,
                    y: activeIndex === index ? 0 : 20
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`bg-gradient-to-br ${pkg.color} p-8 rounded-2xl h-[600px] relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300`}
                >
                  {/* Watermark Logo */}
                  <div className="absolute -right-10 -top-10 opacity-10">
                    <div className="text-[200px] font-black text-white">{pkg.logo}</div>
                  </div>

                  {/* Floating Particles */}
                  <div className="absolute inset-0 overflow-hidden">
                    {[...Array(15)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute rounded-full bg-white/10"
                        style={{
                          width: Math.random() * 10 + 5,
                          height: Math.random() * 10 + 5,
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          y: [0, (Math.random() - 0.5) * 50],
                          x: [0, (Math.random() - 0.5) * 50],
                          transition: {
                            duration: Math.random() * 10 + 5,
                            repeat: Infinity,
                            repeatType: "reverse"
                          }
                        }}
                      />
                    ))}
                  </div>

                  <div className="relative h-full flex flex-col">
                    {pkg.popular && (
                      <motion.span 
                        className="absolute -top-4 -right-4 bg-white px-4 py-1 rounded-full text-sm font-bold text-blue-800 shadow-lg flex items-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                        Most Popular
                      </motion.span>
                    )}
                    
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <pkg.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">{pkg.name}</h3>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold text-white">${pkg.price}</span>
                        <span className="text-white/80">/event</span>
                      </div>
                      <p className="text-white/90 mt-2 text-sm font-medium">{pkg.description}</p>
                    </div>

                    <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar mb-4">
                      <ul className="space-y-3">
                        {pkg.features.map((feature, i) => (
                          <motion.li 
                            key={i} 
                            className="flex items-start gap-3 text-white/90 group"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 + 0.2 }}
                          >
                            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-0.5 group-hover:bg-white/30 transition-all">
                              <Check className="w-3 h-3 flex-shrink-0 text-white" />
                            </div>
                            <div className="flex items-center gap-2">
                              {feature.icon && <feature.icon className="w-4 h-4 opacity-70" />}
                              <span className="text-sm font-medium">{feature.text}</span>
                            </div>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {pkg.note && (
                      <p className="text-white/70 text-xs mt-auto mb-4 italic">
                        {pkg.note}
                      </p>
                    )}

                    <motion.button 
                      className="w-full bg-white text-gray-900 py-3 rounded-xl font-bold hover:bg-white/90 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Get {pkg.name} Plan
                    </motion.button>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 hover:border-purple-500/30 transition-all hover:shadow-lg group"
            >
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-700 rounded-lg flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform"
                whileHover={{ rotate: 10 }}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </motion.div>
              <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
              <p className="text-gray-400 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingPackages;