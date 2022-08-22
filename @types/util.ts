export {};

declare module 'util' {
  // SUPPRESS DEPRECATION WARNS

  export function isNull(obj: unknown): obj is null;
  export function isUndefined(obj: unknown): obj is undefined;
  export function isNullOrUndefined(obj: unknown): obj is null | undefined;
  export function isString(obj: unknown): obj is string;
  export function isBoolean(obj: unknown): obj is boolean;
  export function isNumber(obj: unknown): obj is number;
  export function isRegExp(obj: unknown): obj is RegExp;
  export function isFunction(obj: unknown): obj is Function;
}
