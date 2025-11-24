/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Sab kuch allow kar diya (filhal development ke liye)
      },
    ],
    // Agar upar wala kaam na kare, to ye domains list bhi daal dena safety ke liye
    domains: ['images.unsplash.com', 'placehold.co', 'i.imgur.com', 'res.cloudinary.com'],
  },
};

module.exports = nextConfig;