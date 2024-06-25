/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['flagcdn.com'],
  },
  
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BACKEND_URL}/api/:path*`,
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
  
  webpack: (config, { isServer }) => {
    // Fix for hot-reloading in development mode
    if (!isServer) {
      config.watchOptions = {
        ignored: ['node_modules'],
      };
    }
    return config;
  },
};

module.exports = nextConfig;
