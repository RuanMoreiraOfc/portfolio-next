import { filterRequestedLanguageApi } from '@lib/filterRequestedLanguageApi';

import { api } from '@services/github/api';
import type {
  GetReadmeInput,
  GetReadmeResponse,
} from '@services/github/queries/getReadme';
import { getReadme } from '@services/github/queries/getReadme';

import { isString, isUndefined } from 'util';
import type { NextApiRequest, NextApiResponse } from 'next';
import { marked } from 'marked';

export default Handler;

const readmeObjectNameMapByLanguage: Record<
  string,
  GetReadmeInput['readmeObjectName']
> = {
  en: 'HEAD:README.md',
  pt: 'HEAD:README_PORTUGUESE.md',
};

const errorMessageMapByLanguage: Record<string, string> = {
  en: 'No `README` in your language',
  pt: 'Não há `README` na sua língua',
};

const RESPONSES = {
  required: '[required]',
  notSpecified: '[not specified]',
  notResolved: '[not resolved]',
  default(term: string) {
    return `${term}(default)`;
  },
  invalid(term: string) {
    return `${term}(invalid)`;
  },
};

async function Handler(req: NextApiRequest, res: NextApiResponse) {
  const getBestLanguage = initGetBestLanguage(
    isUndefined(req.query.lang) ? null : String(req.query.lang),
  );

  const langFromQuery = req.query.lang;
  const name = req.query.name;
  const { requestedLanguages, langs, lang } = filterRequestedLanguageApi(
    req,
    Object.keys(readmeObjectNameMapByLanguage),
  );

  const bestLanguage = getBestLanguage(lang);

  if (
    // NOTE: !isString() is a valid type-guard
    !isString(name) ||
    langs.length === 0 ||
    bestLanguage.includes(',') ||
    bestLanguage.includes(';')
  ) {
    const langParam =
      bestLanguage.includes(',') || bestLanguage.includes(';')
        ? RESPONSES.invalid(bestLanguage)
        : langFromQuery
        ? String(langFromQuery)
        : undefined;

    const your_languages = langFromQuery
      ? undefined
      : requestedLanguages ?? RESPONSES.notSpecified;

    const language =
      bestLanguage.includes(',') || bestLanguage.includes(';')
        ? RESPONSES.notResolved
        : getBestLanguage(langs.length === 0 ? RESPONSES.default(lang) : lang);

    res.status(400).json({
      input: {
        lang: langParam,
        name: name ?? RESPONSES.required,
        your_languages,
      },
      output: {
        html: RESPONSES.notResolved,
        language,
      },
    });
    return;
  }

  const response = await api.query<GetReadmeResponse, GetReadmeInput>({
    query: getReadme,
    variables: {
      name,
      readmeObjectName: readmeObjectNameMapByLanguage[bestLanguage],
    },
  });

  if (response.error) {
    console.error({ where: '/api/github/readme', error: response.error });
    res.status(404).json({
      error: {
        message: response.error.message,
        language: bestLanguage,
      },
    });
    return;
  }

  const { repo } = response.data;

  const repoUrl = repo.url;
  const defaultBranch = repo.defaultBranchRef.name || 'main';
  const text = repo.readme?.text || errorMessageMapByLanguage[lang];
  const html = //
    marked(text, { baseUrl: `${repoUrl}/blob/${defaultBranch}/` })
      .replace(/:(?<emoji>\w*?):/g, (...args: any[]) => {
        const emoji = args.at(-1).emoji;
        return `<img src="/api/github/emoji/${emoji}/svg" alt=":${emoji}:" />`;
      })
      .replace(/&#39;/g, '&quot;')
      .replace(/(?:\r?\n)+/g, '')
      .replace(/\s+/g, ' ');

  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  res.setHeader('Content-Type', 'text/html;charset=utf-8');
  res.setHeader('Content-Language', bestLanguage);
  res.status(200).send(html);
  return;
}

const initGetBestLanguage = (preferredLang: null | string) => (lang: string) =>
  preferredLang ?? lang;
