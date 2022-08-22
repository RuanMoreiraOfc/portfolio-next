/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['fallback-en', 'en'],
    defaultLocale: 'fallback-en',
    localeDetection: false,
  },
};

module.exports = nextConfig;
