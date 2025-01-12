import type { NextConfig } from "next";

const withPWA = require('next-pwa')({
  dest: 'public', 
  register: true, 
  disable: process.env.NODE_ENV === 'development',
  sw:'sw.js',
  scope: "/app",
});

const nextConfig: NextConfig = {
  images : {
    formats :['image/webp'],
    remotePatterns : [
      {
        protocol : 'https',
        hostname : 'wwwyguzvcriyafipdond.supabase.co',
        pathname : '/storage/v1/**/public/photo/**'
      }
    ]
  },
};

export default withPWA(nextConfig)  ;
