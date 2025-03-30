'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Autoplay } from 'swiper/modules';
import { Check, Star, Crown, Zap, Users, Calendar, Gift, Shield } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';

const PricingPackages = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const packages = [
    {
      name: "Basic",
      icon: Star,
      price: 499,
      description: "Perfect for small events and gatherings",
      color: "from-blue-500 to-blue-600",
      features: [
        "Up to 50 guests",
        "Basic venue decoration",
        "4-hour event coverage",
        "Basic catering service",
        "Background music",
        "Event coordinator"
      ]
    },
    {
      name: "Premium",
      icon: Crown,
      price: 999,
      description: "Ideal for medium-sized events",
      color: "from-purple-500 to-purple-600",
      popular: true,
      features: [
        "Up to 150 guests",
        "Premium decoration",
        "8-hour event coverage",
        "Premium catering",
        "Live entertainment",
        "2 Event coordinators",
        "Photo booth",
        "Custom lighting"
      ]
    },
    {
      name: "Ultimate",
      icon: Zap,
      price: 1999,
      description: "For large-scale luxury events",
      color: "from-amber-500 to-amber-600",
      features: [
        "Up to 300 guests",
        "Luxury decoration",
        "Full-day coverage",
        "Gourmet catering",
        "Live band + DJ",
        "Full event team",
        "Photo & video",
        "Custom staging",
        "VIP services"
      ]
    }
  ];

  const features = [
    { icon: Users, title: "Guest Management" },
    { icon: Calendar, title: "Timeline Planning" },
    { icon: Gift, title: "Vendor Coordination" },
    { icon: Shield, title: "Insurance Coverage" }
  ];

  if (!mounted) return null;

  return (
    <section className="py-20 bg-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.2),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(168,85,247,0.2),transparent_50%)]" />

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-400 mb-4"
          >
            Pricing Plans
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-6 text-white"
          >
            Choose Your Perfect Package
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400"
          >
            Flexible packages designed to meet your event needs
          </motion.p>
        </div>

        {/* 3D Card Slider */}
        <div className="max-w-sm mx-auto mb-20">
          <Swiper
            effect="cards"
            grabCursor={true}
            modules={[EffectCards, Autoplay]}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            className="w-full"
          >
            {packages.map((pkg, index) => (
              <SwiperSlide key={pkg.name}>
                <div className={`bg-gradient-to-br ${pkg.color} p-8 rounded-2xl h-[500px] relative overflow-hidden`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,white,transparent_70%)]" />
                    <div className="grid grid-cols-3 gap-4 p-4">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="w-full h-8 bg-white/20 rounded-full" />
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    {pkg.popular && (
                      <span className="absolute -top-4 -right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-purple-600">
                        Popular
                      </span>
                    )}
                    
                    <div className="flex items-center gap-3 mb-6">
                      <pkg.icon className="w-8 h-8 text-white" />
                      <h3 className="text-2xl font-bold text-white">{pkg.name}</h3>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-white">${pkg.price}</span>
                        <span className="text-white/80">per event</span>
                      </div>
                      <p className="text-white/80 mt-2">{pkg.description}</p>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 text-white">
                          <Check className="w-5 h-5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button className="w-full bg-white text-gray-900 py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors">
                      Choose Plan
                    </button>
                  </div>
                </div>
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
              className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
              <p className="text-gray-400">
                Comprehensive {feature.title.toLowerCase()} solutions included in all packages
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingPackages;