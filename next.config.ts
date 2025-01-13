  import type { NextConfig } from "next";

  const withPWA = require('next-pwa')({
    dest: 'public', 
    register: true, 
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
    scope: "/",
    sw : '/sw.js',
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/customer-w-anggi\.vercel\.app\//,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxEntries: 30,
            maxAgeSeconds: 60 * 30, 
          },
        },
      },
      {
        urlPattern: /^https:\/\/restcountries\.com\/v3\.1\/all\?fields=name$/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxEntries: 30,
            maxAgeSeconds:  60 * 30, 
          },
        },
      },
    ],
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
