import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Customer App',
    short_name: 'Customer',
    description: 'Customer Website',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/twitter-image.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/twitter-image.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}