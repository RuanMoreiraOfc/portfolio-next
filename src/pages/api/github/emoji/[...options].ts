import { isNull, isString, isUndefined } from 'util';
import type { NextApiRequest, NextApiResponse } from 'next';

import { utilizePage } from '@lib/chromium';

export default Handler;

type FallbackModifier = '' | 'fallback';
type Modifiers = FallbackModifier | 'photo' | 'unicode';
type EmojisResponse = Record<string, string>;

let emojis: EmojisResponse | null = null;

async function Handler(req: NextApiRequest, res: NextApiResponse) {
  const optionsOrEmojiPicked = req.query?.options || [];
  const [emojiPicked, modifierPicked] = (
    isString(optionsOrEmojiPicked)
      ? [optionsOrEmojiPicked, '']
      : [...optionsOrEmojiPicked.slice(0, 2), undefined, '']
  ) as [string | undefined, Modifiers];

  if (isUndefined(emojiPicked)) {
    setupImmutableCache(res) //
      .status(404)
      .end();
    return;
  }

  try {
    if (isNull(emojis)) {
      emojis = await getEmojis(emojiPicked);
    }

    const emojiUrl = repeatedPart + emojis[emojiPicked];
    const emojiAsCode = emojiUrl.split(/\.|\//).at(-2) || '0';
    const emojiAsString = String.fromCodePoint(parseInt(emojiAsCode, 16));

    if (isFallbackModifier(modifierPicked)) {
      setupImmutableCache(res) //
        .redirect(emojiUrl);
      return;
    }

    if (emojiAsCode === '0') {
      throw new Error('Impossible to response!');
    }

    if (modifierPicked === 'unicode') {
      setupImmutableCache(res) //
        .json({
          emoji: emojiAsString,
          code: emojiAsCode,
        });
      return;
    }

    const { buffer, mimeType } = await generateEmojiPhoto(emojiAsString);

    setupImmutableCache(res) //
      .setHeader('Content-Type', mimeType)
      .send(buffer);
    return;
  } catch (err) {
    console.error({
      where: `/api/github/emoji/${emojiPicked}${
        modifierPicked //
          ? `/${modifierPicked}`
          : ''
      }`,
      error: err,
    });
    res //
      .setHeader('Cache-Control', 'no-cache')
      .status(502)
      .end();
    return;
  }
}

const repeatedPart = 'https://github.githubassets.com/images/icons/emoji/';

const setupImmutableCache = (res: NextApiResponse) => {
  return res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
};

const isFallbackModifier = (modifier: string): modifier is FallbackModifier => {
  return modifier === '' || modifier === 'fallback';
};

const getEmojis = async (emojiPicked: string) => {
  const emojisCache = (await import(
    'public/github-emojis.json'
  )) as unknown as EmojisResponse;

  if (emojiPicked in emojisCache) {
    return emojisCache;
  }

  const emojisFromAPI = (await (
    await fetch('https://api.github.com/emojis', {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: 'Bearer ' + process.env.GITHUB_ACCESS_TOKEN,
      },
    })
  ).json()) as EmojisResponse;

  if ('documentation_url' in emojisFromAPI) {
    throw new Error('Impossible to response!');
  }

  const minifiedEmojisFromApi = Object.fromEntries(
    Object.entries(emojisFromAPI).map(([key, value]) => [
      key,
      value.replace(repeatedPart, ''),
    ]),
  );

  return minifiedEmojisFromApi;
};

const generateEmojiPhoto = async (emojiAsString: string) => {
  const isDev = isUndefined(process.env.AWS_REGION);
  const buffer = await utilizePage(isDev, async (page) => {
    await page.setViewport({ width: 32, height: 32 });
    await page.setContent(
      `
    <html>
      <head>
        <style>
          body {
            margin: -2px 0;
            background: #f1f1f1;
            font-family: sans-serif;
            font-size: 25px;
          }
        </style>
      </head>
      <body>
        <div>${emojiAsString}</div>
      </body>
    </html>
    `,
    );

    const screenshot = await page.screenshot({ type: 'webp' });
    return screenshot;
  });

  return {
    buffer,
    mimeType: 'image/avif',
  };
};
