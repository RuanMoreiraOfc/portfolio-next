import nextConfig from 'next.config';

import { r } from '@lib/regex';

import type { NextApiRequest } from 'next';

export { filterRequestedLanguageApi };

const locales = nextConfig.i18n!.locales;
const defaultLocale = nextConfig.i18n!.defaultLocale.replace(/fallback-/, '');

const REGEX_IGNORE_IN_LANGUAGE = r
  .withCache({ separator: /,?\s?/, union: /|/ })
  .resolve((c) => [
    /,/,
    c.separator,
    c.union,
    /-\w*/,
    c.separator,
    c.union,
    /;q=\d?.?\d*/,
    c.separator,
  ]);

const filterRequestedLanguageApi = (
  req: Pick<NextApiRequest, 'headers'>,
  acceptedLanguages: string[] = locales,
  fallback: string = defaultLocale,
) => {
  const requestedLanguages = req.headers['accept-language'] || undefined;

  const langs = //
    (requestedLanguages ?? '')
      .split(REGEX_IGNORE_IN_LANGUAGE)
      .filter((reqLang) => acceptedLanguages.includes(reqLang));

  const lang = langs[0] || fallback;

  return {
    requestedLanguages,
    langs,
    lang,
    defaults: {
      langs: locales,
      lang: defaultLocale,
    },
  };
};
