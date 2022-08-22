export type {
  OmitDistributiveStrict as OmitDistributive,
  OmitDistributiveLoose,
};

type OmitDistributiveStrict<T, K extends keyof T> = OmitDistributive<T, K>;
type OmitDistributiveLoose<T, K extends string> = OmitDistributive<T, K>;

// *** CORE ***

type OmitDistributive<T, K> = T extends unknown
  ? Pick<T, Exclude<keyof T, K>>
  : never;
