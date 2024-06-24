/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['https://flagcdn.com'],
  },
  env: {
    API_URL: 'https://api.deartherapist.in',
  },
};

module.exports = nextConfig;
