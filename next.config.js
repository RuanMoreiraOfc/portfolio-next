/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['fallback-en', 'en'],
    defaultLocale: 'fallback-en',
    localeDetection: false,
  },
  images: {
    domains: [
      'drive.google.com',
      'images.pexels.com',
      'user-images.githubusercontent.com',
      'repository-images.githubusercontent.com',
    ],
  },
  webpack(config, { dir }) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.tsx?$/,
      include: [dir],
      use: [
        'next-swc-loader',
        {
          loader: '@svgr/webpack',
          options: { babel: false },
        },
      ],
    });

    return config;
  },
};

if (process.env.DOMAIN_PARTS_COUNT === undefined) {
  throw new Error(`\`DOMAIN_PARTS_COUNT\` was not defined!`);
}

module.exports = nextConfig;
