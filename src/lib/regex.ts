import type { GetUniquesFromPattern } from '@~types/getUniquesFromPattern';

import { isFunction, isRegExp, isUndefined } from 'util';

export { r };
export type { Flags };

type RegexOrSource = RegExp | string;

const getSource = (maybeRegex: RegexOrSource) =>
  isRegExp(maybeRegex) ? maybeRegex.source : maybeRegex;
const getSourceFromObject = (
  obj: Record<string, RegexOrSource>,
): Record<string, string> =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, getSource(value)]),
  ) as Record<string, string>;

const propFlags = Symbol();
const propCache = Symbol();

type AcceptableFlags = 'g' | 'i' | 'm' | 'u' | 'y' | '';
type GenerateFlags<T extends string> = GetUniquesFromPattern<
  `${T}${T}${T}${T}${T}`,
  T
>;

type Flags = GenerateFlags<AcceptableFlags>;
type Cache<T extends string> = Record<T, string>;
type CacheParam<T extends string> = Record<T, RegexOrSource>;

const r = class r<T extends string> {
  [propFlags]?: Flags;
  [propCache]?: Cache<T>;

  constructor(flags?: Flags, cache?: Cache<T>) {
    this[propFlags] = flags;
    this[propCache] = cache;
  }

  static withFlags(flags: Flags) {
    return new this(flags);
  }
  static withCache<T extends string>(cache: CacheParam<T>) {
    return new this(undefined, getSourceFromObject(cache) as Cache<T>);
  }
  addFlags(flags: Flags) {
    this[propFlags] = flags;
    return this;
  }
  addCache(cache: CacheParam<T>) {
    this[propCache] = getSourceFromObject(cache) as Cache<T>;
    return this;
  }
  resolve<B extends T>(
    ...resolveList: T extends string
      ? [(cache: Cache<B>) => RegexOrSource[]] | RegexOrSource[]
      : RegexOrSource[]
  ) {
    const flags = this[propFlags];
    const cache = this[propCache];
    const newResolveList = (
      isFunction(resolveList[0])
        ? resolveList[0](cache ?? ({} as Cache<T>))
        : resolveList
    ) as RegexOrSource[];

    const {
      source: finalSource, //
      flags: finalFlags,
    } = newResolveList.reduce(
      (acc, cur) => {
        acc.source += getSource(cur);

        if (isUndefined(flags)) {
          acc.flags += isRegExp(cur) ? cur.flags : '';
        } else {
          acc.flags = flags;
        }

        return acc;
      },
      { source: '', flags: '' },
    );

    return new RegExp(finalSource, finalFlags);
  }
};
