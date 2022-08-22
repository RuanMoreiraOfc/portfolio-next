import type { FunctionComponent } from 'react';

export type { UnwrapArray, UnwrapPromise, UnwrapComponent };

type UnwrapArray<T extends Array<any>> = T extends (infer O)[] ? O : never;
type UnwrapPromise<T extends Promise<any>> = T extends Promise<infer O>
  ? O
  : never;
type UnwrapComponent<T extends FunctionComponent<any>> =
  T extends FunctionComponent<infer O> ? O : never;
