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

if (process.env.DOMAIN_PARTS_COUNT === undefined) {
  throw new Error(`\`DOMAIN_PARTS_COUNT\` was not defined!`);
}

module.exports = nextConfig;
