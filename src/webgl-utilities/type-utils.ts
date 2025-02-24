export type SliceOfFirst<T extends unknown[]> = T extends [unknown, ...infer R]
  ? R
  : never;

// https://stackoverflow.com/a/70307091
export type Enumerate<
  N extends number,
  Acc extends number[] = []
> = Acc["length"] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc["length"]]>;

// type Range<F extends number, T extends number> = Exclude<
//   Enumerate<T>,
//   Enumerate<F>
// >;
