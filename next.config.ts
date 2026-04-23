import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add this entire images block to whitelist Cloudinary
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**", // This allows any image path from Cloudinary
      },
    ],
  },
};

export default nextConfig;
