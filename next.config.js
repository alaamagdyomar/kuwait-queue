/** @type {import('next').NextConfig} */
const withSvgr = require('next-plugin-svgr');

const nextConfig = withSvgr({
  reactStrictMode: false,
  i18n: {
    locales: ['en', 'ar'],
    defaultLocale: 'en',
    localeDetection: false,
  },
  async rewrites() {
    return [
      {
        source: '/home',
        destination: '/',
      },
      {
        source: '/areas',
        destination: '/select/areas',
      },
      {
        source: '/branches',
        destination: '/select/branches',
      },
      {
        source: '/schedule',
        destination: '/select/time',
      },
      {
        source: '/about',
        destination: '/vendor/info',
      },
      {
        source: '/wishlist',
        destination: '/user/wishlist',
      },
      {
        source: '/orders',
        destination: '/user/order',
      },
      {
        source: '/receipt/:orderId',
        destination: '/order/:orderId/receipt',
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/OrderConfirmation/failure/:slug',
        destination: '/order/:slug/status/failure',
        permanent: true,
      },
      {
        source: '/OrderConfirmation/success/:orderId',
        destination: '/order/:orderId/status/success',
        permanent: true,
      },
    ];
  },
  env: {
    SECRET_APP_KEY: '@#8!U.S.A.M.A.!@)8231',
    NEXT_PUBLIC_URL: '/',
    PUBLIC_URL: '/',
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'testbedbynd.com',
      'pages-dash.testbedbynd.com',
      'queue-spaces.nyc3.digitaloceanspaces.com',
      'queue-app.sgp1.digitaloceanspaces.com',
      '*.sgp1.digitaloceanspaces.com',
    ],
    // minimumCacheTTL: 60 * 60 * 24,
    dangerouslyAllowSVG: true,
  },
});

nextConfig.webpack = (config) => {
  config.module.rules.push({
    test: /\.svg$/,
    issuer: /\.[jt]sx?$/,
    use: ['@svgr/webpack'],
  });
  config.resolve.fallback = { fs: false };
  return config;
};

module.exports = nextConfig;
