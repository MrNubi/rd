/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'www.gravatar.com'],
  },
};

module.exports = nextConfig;
