import type { GetStaticPropsContext } from 'next';

export { translate };

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
