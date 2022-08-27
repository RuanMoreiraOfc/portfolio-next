/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['fallback-en', 'en', 'pt'],
    defaultLocale: 'fallback-en',
    localeDetection: false,
  },
  images: {
    domains: [
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

module.exports = nextConfig;
