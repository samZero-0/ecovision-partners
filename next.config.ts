/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['assets.aceternity.com','encrypted-tbn0.gstatic.com','corporatetraining.usf.edu','images.unsplash.com','assets.trainingindustry.com','image.cdn2.seaart.me'],
  },
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint checks during build
  },
  typescript:{
    ignoreBuildErrors: true
  },
  
};

module.exports = nextConfig;
