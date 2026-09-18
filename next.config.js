const i18n = require('./i18n.config');

const REQUIRED_VARIABLES = [
  'DOMAIN_PARTS_COUNT',
  'GITHUB_ACCESS_TOKEN',
  'RESUME_URL_EN',
  'RESUME_URL_PT',
  'SELFIE_URL',
];
const VARIABLES_UNDEFINED = REQUIRED_VARIABLES.filter(
  (variable) => process.env[variable] === undefined,
);
if (VARIABLES_UNDEFINED.length > 0) {
  throw new Error(
    `\`${VARIABLES_UNDEFINED.join(' & ')}\` ${
      VARIABLES_UNDEFINED.length === 1 ? 'was' : 'were'
    } not defined!`,
  );
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'user-images.githubusercontent.com' },
      { protocol: 'https', hostname: 'repository-images.githubusercontent.com' },
    ],
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
};

module.exports = nextConfig;
