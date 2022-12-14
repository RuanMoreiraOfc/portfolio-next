import { isNull, isString, isUndefined } from 'util';
import type { NextApiRequest, NextApiResponse } from 'next';

export default Handler;

type FallbackModifier = '' | 'fallback';
type Modifiers = FallbackModifier | 'svg' | 'unicode';
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
      .setHeader(
        'Content-Disposition',
        `inline; filename="emoji_${emojiPicked}.svg"`,
      )
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
  const buffer = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <text x="0" y="15">
        ${emojiAsString}
      </text>
    </svg>
  `.replace(/\n+/, ' ');

  return {
    buffer,
    mimeType: 'image/svg+xml',
  };
};
