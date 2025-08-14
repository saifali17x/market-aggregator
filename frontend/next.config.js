/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "via.placeholder.com", "images.unsplash.com"],
  },
  async rewrites() {
    // Only use localhost rewrites in development
    if (process.env.NODE_ENV === "development") {
      return [
        {
          source: "/api/:path*",
          destination: "http://localhost:3001/api/:path*",
        },
      ];
    }
    // In production, let Vercel handle API routes
    return [];
  },
};

module.exports = nextConfig;
