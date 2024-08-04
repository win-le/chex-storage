export type StorageKey<R> = R extends string
  ? `${R}++` | R
  : `${string}++` | string;

export type Optional<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;
