// Replacements for the `util.is*` type-guards, removed from Node.js 23+
// and never available in the browser bundle.

export {
  isBoolean,
  isFunction,
  isNull,
  isNullOrUndefined,
  isNumber,
  isRegExp,
  isString,
  isUndefined,
};

const isBoolean = (value: unknown): value is boolean =>
  typeof value === 'boolean';

const isFunction = (value: unknown): value is (...args: any[]) => any =>
  typeof value === 'function';

const isNull = (value: unknown): value is null => value === null;

const isNullOrUndefined = (value: unknown): value is null | undefined =>
  value === null || value === undefined;

const isNumber = (value: unknown): value is number => typeof value === 'number';

const isRegExp = (value: unknown): value is RegExp => value instanceof RegExp;

const isString = (value: unknown): value is string => typeof value === 'string';

const isUndefined = (value: unknown): value is undefined => value === undefined;
