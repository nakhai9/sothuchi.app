import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
  images: {
    domains: ["cdn-icons-png.flaticon.com", "www.svgrepo.com"],
  },
};

export default nextConfig;
