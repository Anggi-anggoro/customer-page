import type { NextConfig } from "next";

const withPWA = require('next-pwa')({
  dest: 'public', 
  register: true, 
  skipWaiting: true,
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
