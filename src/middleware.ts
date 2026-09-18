import { NextRequest, NextResponse } from 'next/server';

import { filterRequestedLanguageApi } from '@lib/filterRequestedLanguageApi';

export { middleware };

const PUBLIC_FILE = /\.(.*)$/;

async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore Next internals and static files
  if (
    pathname.startsWith('/_next') ||
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

  // Keep an explicit (valid) language subdomain, otherwise use the browser one
  const preferredLang = locales.includes(currentSubdomain)
    ? currentSubdomain
    : langFromBrowser;

  // Already on correct language subdomain
  if (currentSubdomain === preferredLang) {
    return NextResponse.next();
  }

  // Preserve localhost behavior
  if (
    hostname.includes('localhost') ||
    hostname.includes('127.0.0.1')
  ) {
    url.hostname = hostname;
    url.port = url.port || '3000';

    return NextResponse.next();
  }

  // Redirect to language subdomain
  url.hostname = `${preferredLang}.${baseDomain}`;

  return NextResponse.redirect(url);
}
