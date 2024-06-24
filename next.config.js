/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['flagcdn.com'],
  },
  env: {
    API_URL: 'https://api.deartherapist.in',
  },
};

module.exports = nextConfig;
