/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        // Optional: Restrict to your Cloudinary account for security
        // pathname: '/dkc4pu2rq/**', // Replace with your cloud name
      },
    ],
  },
  
  // For API Routes (Pages Router)
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: '10mb',
  },
  
  // For App Router file uploads (if using Server Actions)
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  
  // Optional: Enable if using App Router + Server Components
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;