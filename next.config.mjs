/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow ClickUp attachment images
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "attachments.clickup.com" },
      { protocol: "https", hostname: "*.clickup.com" },
    ],
  },
};
export default nextConfig;
