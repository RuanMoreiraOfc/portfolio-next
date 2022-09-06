import type { GetStaticPropsContext } from 'next';

export { translate, translatePaths };

const translate = async <T>(path: string, ctx: GetStaticPropsContext) => {
  try {
    const { default: translation } = await import(
      `public/locales/${path}/${ctx.locale}.json`
    );

    return translation as T;
  } catch (err) {
    return null;
  }
};

const translatePaths = async <T>(
  paths: string[],
  ctx: GetStaticPropsContext,
) => {
  try {
    const translationEntriesPromises = paths.map(
      (path) => import(`public/locales/${path}/${ctx.locale}.json`),
    );
    const translationsEntries = await Promise.all(translationEntriesPromises);
    const translations = translationsEntries
      .map(({ default: translation }) => translation)
      .reduce((acc, e) => ({ ...acc, ...e }), {});

    return translations as T;
  } catch (err) {
    return null;
  }
};
