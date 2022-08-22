export type { GetUniquesFromPattern };

// prettier-ignore
type GetUniquesFromPattern<T extends string, U, UCache extends string = never> =
  T extends `${infer FirstChar}${infer Rest}`
    ? Rest extends ''
      ? FirstChar
      : Rest extends `${string}${UCache | FirstChar}${string}`
        ? never
        : GetUniquesFromPattern<Rest, U, UCache | FirstChar> extends never
          ? never
          : T
    : never;
