'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import { Leaf, Globe, HandHelping, ArrowRight, ChevronDown } from 'lucide-react';

const MissionBanner = () => {
  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{
          crossFade: true // Ensures complete opacity transition
        }}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ 
          clickable: true,
          dynamicBullets: true 
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        className="absolute inset-0 h-full w-full"
      >
        <SwiperSlide className="absolute inset-0">
          <div className="relative h-full w-full bg-green-900/70 flex items-center justify-center text-center">
            <div className="absolute inset-0 bg-[url('/placeholder-landscape.jpg')] bg-cover bg-center opacity-50 z-0"></div>
            <div className="z-10 text-white px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                Sustainability in Action
              </h1>
              <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-6 drop-shadow-md">
                Empowering communities to create lasting environmental change
              </p>
              <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full flex items-center mx-auto space-x-2 transition-colors">
                <span>Learn More</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide className="absolute inset-0">
          <div className="relative h-full w-full bg-blue-900/70 flex items-center justify-center text-center">
            <div className="absolute inset-0 bg-[url('/placeholder-conservation.jpg')] bg-cover bg-center opacity-50 z-0"></div>
            <div className="z-10 text-white px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                Conservation Matters
              </h1>
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-6">
                <div className="bg-white/10 p-4 rounded-lg">
                  <Leaf className="mx-auto w-12 h-12 text-green-400 mb-3" />
                  <h3 className="text-xl font-semibold">Ecosystem Protection</h3>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <Globe className="mx-auto w-12 h-12 text-blue-400 mb-3" />
                  <h3 className="text-xl font-semibold">Climate Action</h3>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <HandHelping className="mx-auto w-12 h-12 text-teal-400 mb-3" />
                  <h3 className="text-xl font-semibold">Community Engagement</h3>
                </div>
              </div>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full flex items-center mx-auto space-x-2 transition-colors">
                <span>Our Initiatives</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide className="absolute inset-0">
          <div className="relative h-full w-full bg-teal-900/70 flex items-center justify-center text-center">
            <div className="absolute inset-0 bg-[url('/placeholder-digital.jpg')] bg-cover bg-center opacity-50 z-0"></div>
            <div className="z-10 text-white px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                Digital Platform for Impact
              </h1>
              <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-6 drop-shadow-md">
                Event management, volunteer coordination, and secure donation processing
              </p>
              <div className="flex justify-center space-x-4">
                <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-full flex items-center space-x-2 transition-colors">
                  <span>Register</span>
                  <ChevronDown className="w-5 h-5" />
                </button>
                <button className="bg-white text-teal-800 hover:bg-gray-100 px-6 py-3 rounded-full flex items-center space-x-2 transition-colors">
                  <span>Donate</span>
                  <HandHelping className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default MissionBanner;