/** @type {NonNullable<import('next').NextConfig['i18n']>} */
const i18n = {
  locales: ['fallback-en', 'en', 'pt'],
  defaultLocale: 'fallback-en',
  localeDetection: false,
};

module.exports = i18n;
