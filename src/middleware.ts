import { filterRequestedLanguageApi } from '@lib/filterRequestedLanguageApi';

import type { IncomingHttpHeaders } from 'http';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export { middleware, config };

async function middleware(req: NextRequest) {
  const headers: IncomingHttpHeaders = Object.fromEntries(
    req.headers.entries(),
  );

  const dest = headers['sec-fetch-dest'] as
    | 'image'
    | 'document'
    | 'script'
    | 'empty';

  if (
    dest !== 'document' ||
    req.nextUrl.pathname.includes('.') ||
    ['/_next', '/api'].some((e) => req.nextUrl.pathname.startsWith(e))
  ) {
    const response = NextResponse.next();
    return response;
  }

  const {
    lang: betterLang,
    defaults: { langs: locales },
  } = filterRequestedLanguageApi({ headers });

  const [subdomain] = headers.host
    ?.split('.')
    .reduce((acc, e, i, { length: parts_count }) => {
      if (parts_count <= Number(process.env!.DOMAIN_PARTS_COUNT)) {
        acc.push('');
      }

      acc.push(e);
      return acc;
    }, [] as string[]) ?? [''];
  const { origin, pathname, search, hash, locale } = req.nextUrl;
  const langFromPathname = req.url
    .replace(origin, '')
    .replace(pathname, '')
    .replace(search, '')
    .replace(hash, '');

  const preferredLang = locales.includes(subdomain)
    ? subdomain
    : langFromPathname || betterLang;

  const fillURL = (baseURL: URL | string, ...pathnames: string[]) =>
    new URL(
      hash,
      new URL(
        search,
        new URL(pathnames.map((e) => e.replace(/\//, '')).join('/'), baseURL),
      ),
    );

  const newOrigin = origin
    .replace(`://${subdomain}`, `://`)
    .replace(`://`, `://${preferredLang}.`)
    .replace('..', '.');

  const redirectDestination = fillURL(newOrigin, pathname);
  const rewriteDestination = fillURL(newOrigin, preferredLang, pathname);

  if (locales.includes(subdomain) === false) {
    const response = NextResponse.redirect(redirectDestination);
    return response;
  }

  if (langFromPathname !== '') {
    const response = NextResponse.redirect(redirectDestination, {
      status: 308,
    });
    return response;
  }

  if (subdomain !== locale) {
    const response = NextResponse.rewrite(rewriteDestination);
    return response;
  }

  const response = NextResponse.next();
  return response;
}

const config = {
  matcher: ['/:path:*'],
};