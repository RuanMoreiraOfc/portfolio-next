import { NextRequest, NextResponse } from 'next/server';

import { filterRequestedLanguageApi } from '@lib/filterRequestedLanguageApi';

export { proxy };

const PUBLIC_FILE = /\.(.*)$/;

async function proxy(request: NextRequest) {
  const { pathname, buildId } = request.nextUrl;

  // Ignore Next internals, API routes and static files. `_next/data` requests
  // are normalized to their page path before getting here (on Vercel even
  // `buildId` is gone, only the `x-nextjs-data` header remains) and already
  // carry the locale, so they must pass through untouched
  if (
    pathname.startsWith('/_next') ||
    request.headers.get('x-nextjs-data') !== null ||
    buildId !== undefined ||
    pathname.includes('/api/') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();

  const hostname = url.hostname;

  const domainPartsCount = Number(process.env.DOMAIN_PARTS_COUNT ?? 2);

  const hostnameParts = hostname.split('.');

  const baseDomain = hostnameParts
    .slice(-domainPartsCount)
    .join('.');

  const currentSubdomain =
    hostnameParts.length > domainPartsCount
      ? hostnameParts.slice(0, -domainPartsCount).join('.')
      : '';

  const {
    lang: langFromBrowser,
    defaults: { langs: locales },
  } = filterRequestedLanguageApi({
    headers: {
      'accept-language':
        request.headers.get('accept-language') ?? undefined,
    },
  });

  const isLocalhost =
    hostname.includes('localhost') || hostname.includes('127.0.0.1');

  // i18n is configured, so there is always a default locale
  const defaultLocale = url.defaultLocale as string;

  // `?locale=xx` (locale picker) or a `/xx/...` pathname is an explicit choice
  const langFromParam = url.searchParams.get('locale') ?? '';
  const langFromPathname = url.locale === defaultLocale ? '' : url.locale;
  const explicitLang = [langFromParam, langFromPathname].find((lang) =>
    locales.includes(lang),
  );

  // Otherwise keep a (valid) language subdomain, or fall back to the browser one
  const preferredLang =
    explicitLang ??
    (locales.includes(currentSubdomain) ? currentSubdomain : langFromBrowser);

  url.searchParams.delete('locale');

  // No subdomains on localhost: just serve the preferred language
  if (isLocalhost) {
    url.locale = preferredLang;

    return NextResponse.rewrite(url);
  }

  // Already on the right language subdomain: serve that locale's page
  if (currentSubdomain === preferredLang && explicitLang === undefined) {
    if (url.locale === preferredLang) {
      return NextResponse.next();
    }

    url.locale = preferredLang;

    return NextResponse.rewrite(url);
  }

  // Move to the language subdomain, dropping any locale hint from the URL
  url.locale = defaultLocale;
  url.hostname = `${preferredLang}.${baseDomain}`;

  return NextResponse.redirect(url, {
    status: explicitLang === undefined ? 307 : 308,
  });
}
