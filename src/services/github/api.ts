import type { OmitDistributive } from '@~types/omitDistributive';

import type {
  NormalizedCacheObject,
  ApolloQueryResult,
  ApolloError,
  OperationVariables,
  QueryOptions,
  MutationOptions,
  MutationResult,
  ApolloClientOptions,
} from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client';

export { api };

type BaseOptionsType = ApolloClientOptions<NormalizedCacheObject>;
type BaseType = ApolloClient<NormalizedCacheObject>;
type BaseQueryResultType<T> = ApolloQueryResult<T>;
type BaseMutationResultType<T> = MutationResult<T>;

type TreatedQueryResultType<T> = OmitDistributive<
  BaseQueryResultType<T>,
  'data' | 'error' | 'errors'
> &
  (
    | {
        data: T;
        error?: never;
      }
    | {
        data?: never;
        error: ApolloError;
      }
  );

type TreatedMutationResultType<T> = OmitDistributive<
  BaseMutationResultType<T>,
  'data' | 'error'
> &
  (
    | {
        data: T;
        error?: never;
      }
    | {
        data?: never;
        error: ApolloError;
      }
  );

type CustomClient = OmitDistributive<BaseType, 'query' | 'mutate'> & {
  query: <TResponse = any, TVariables = OperationVariables>(
    options: QueryOptions<TVariables, TResponse>,
  ) => Promise<TreatedQueryResultType<TResponse>>;
  mutate: <TResponse = any, TVariables = OperationVariables>(
    options: MutationOptions<TResponse, TVariables>,
  ) => Promise<TreatedMutationResultType<TResponse>>;
  __clone: typeof __clone;
};

const createApolloInstance = (options: BaseOptionsType) => {
  const instance = new ApolloClient(options) as unknown as CustomClient;
  const originalQuery = instance.query;
  const originalMutate = instance.mutate;

  instance.query = async <TResponse = any, TVariables = OperationVariables>({
    ...args
  }: QueryOptions<TVariables, TResponse>) => {
    try {
      return await originalQuery({ ...args });
    } catch (err: any) {
      const error = err as ApolloError;

      return Promise.resolve({
        error,
      } as TreatedQueryResultType<TResponse>);
    }
  };

  instance.mutate = async <TResponse = any, TVariables = OperationVariables>({
    ...args
  }: MutationOptions<TResponse, TVariables>) => {
    try {
      return await originalMutate({ ...args });
    } catch (err: any) {
      const error = err as ApolloError;

      return Promise.resolve({
        error,
      } as TreatedMutationResultType<TResponse>);
    }
  };

  return instance;
};

const baseOptions: BaseOptionsType = {
  uri: 'https://api.github.com/graphql',
  cache: new InMemoryCache(),
  credentials: 'include',
  ssrMode: true,
  headers: {
    Authorization: 'Bearer ' + process.env.GITHUB_ACCESS_TOKEN,
  },
};

const __clone = (overrides: Partial<BaseOptionsType>) =>
  createApolloInstance({
    ...baseOptions,
    ...overrides,
  });

const api = createApolloInstance(baseOptions);
api.__clone = __clone;
