'use client';

import React, { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import { Leaf, Globe, HandHelping, ArrowRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';

const MissionBanner = () => {
  useEffect(() => {
    const parallaxScroll = () => {
      const elements = document.querySelectorAll('.parallax-bg');
      elements.forEach((el) => {
        const scrolled = window.scrollY;
        const element = el as HTMLElement;
        element.style.transform = `translateY(${scrolled * 0.5}px)`;
      });
    };

    window.addEventListener('scroll', parallaxScroll);
    return () => window.removeEventListener('scroll', parallaxScroll);
  }, []);

  return (
    <div className="relative w-full h-[700px] overflow-hidden">
      <Swiper
        modules={[Pagination, Autoplay, EffectFade, Navigation]}
        effect="fade"
        fadeEffect={{
          crossFade: true
        }}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ 
          clickable: true,
          dynamicBullets: true
        }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        speed={1000}
        className="absolute inset-0 h-full w-full"
      >
        <SwiperSlide>
          <div className="relative h-full w-full flex items-center justify-center text-center overflow-hidden">
            <div 
              className="absolute inset-0 parallax-bg bg-cover bg-center transform transition-transform duration-1000 "
              style={{
                backgroundImage: "url('https://image.cdn2.seaart.me/2025-04-01/cvlsf3le878c738gfipg-2/1d0580bde3669d900cbd237bf06f5e3f_high.webp')",
              }}
            >
              <div className="absolute inset-0 bg-black/50 "></div>
            </div>
            <div className="relative z-10 text-white px-4 animate-fade-in-up">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg animate-slide-up">
                Sustainability in Action
              </h1>
              <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-8 drop-shadow-md animate-slide-up-delay">
                Empowering communities to create lasting environmental change
              </p>
              <Link href='/login'>
              <button className="bg-teal-500 hover:bg-green-600 text-white px-8 py-4 rounded-full flex items-center mx-auto space-x-3 transition-all duration-300 transform hover:scale-105 hover:shadow-lg animate-bounce-in">
                <span className="text-lg">Learn More</span>
                <ArrowRight className="w-6 h-6" />
              </button></Link>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="relative h-full w-full flex items-center justify-center text-center overflow-hidden">
            <div 
              className="absolute inset-0 parallax-bg bg-cover bg-center transform transition-transform duration-1000 "
              style={{
                backgroundImage: "url('https://image.cdn2.seaart.me/2025-04-01/cvlsj6le878c73b4grj0-2/ac773b23895b1477b1aa10dfcb38f53a_high.webp')",
              }}
            >
              <div className="absolute inset-0 bg-black/50 "></div>
            </div>
            <div className="relative z-10 text-white px-4 mt-12">
              <h1 className="text-5xl md:text-7xl  font-bold mb-8 drop-shadow-lg animate-slide-up hidden md:block">
                Conservation Matters
              </h1>
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-8">
                {[
                  { icon: Leaf, title: "Ecosystem Protection", color: "green" },
                  { icon: Globe, title: "Climate Action", color: "blue" },
                  { icon: HandHelping, title: "Community Engagement", color: "teal" }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="bg-white/10 backdrop-blur-md p-6 rounded-xl transform transition-all duration-500 hover:scale-105 hover:bg-white/20"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <item.icon className={`mx-auto w-16 h-16 text-${item.color}-400 mb-4`} />
                    <h3 className="text-2xl font-semibold">{item.title}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="relative h-full w-full flex items-center justify-center text-center overflow-hidden">
            <div 
              className="absolute inset-0 parallax-bg bg-cover bg-center transform transition-transform duration-1000 "
              style={{
                backgroundImage: "url('https://cdn.pixabay.com/photo/2024/02/04/14/38/earth-8552339_1280.jpg')",
              }}
            >
              <div className="absolute inset-0 bg-black/50 "></div>
            </div>
            <div className="relative z-10 text-white px-4">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg animate-slide-up">
                Digital Platform for Impact
              </h1>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 drop-shadow-md animate-slide-up-delay">
                Event management, volunteer coordination, and secure donation processing
              </p>
              <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
                <Link href='/login'>
                <button className="group bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-full flex items-center justify-center space-x-3 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  <span className="text-lg">Register Now</span>
                  <ChevronDown className="w-6 h-6 transition-transform group-hover:translate-y-1" />
                </button></Link>
               <Link href='/login'>
               <button className="group bg-white text-teal-800 hover:bg-gray-100 px-8 py-4 rounded-full flex items-center justify-center space-x-3 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  <span className="text-lg">Support Us</span>
                  <HandHelping className="w-6 h-6 transition-transform group-hover:rotate-12" />
                </button></Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      <div className="swiper-button-prev !text-white !w-12 !h-12 !bg-black/30 rounded-full transition-all duration-300 hover:!bg-black/50 -translate-x-4"></div>
      <div className="swiper-button-next !text-white !w-12 !h-12 !bg-black/30 rounded-full transition-all duration-300 hover:!bg-black/50 translate-x-4"></div>
    </div>
  );
};

export default MissionBanner;