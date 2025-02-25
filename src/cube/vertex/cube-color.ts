import { TernaryNumber } from './TernaryNumber';

const multiplyItem = <T>(item: T, times: number): T[] =>
  Array.from({ length: times }).map(() => item);

export const colors: Array<TernaryNumber> = [
  ...multiplyItem<TernaryNumber>([Math.random(), Math.random(), Math.random()], 4),
  ...multiplyItem<TernaryNumber>([Math.random(), Math.random(), Math.random()], 2),
  ...multiplyItem<TernaryNumber>([Math.random(), Math.random(), Math.random()], 2),
  ...multiplyItem<TernaryNumber>([Math.random(), Math.random(), Math.random()], 2),
  ...multiplyItem<TernaryNumber>([Math.random(), Math.random(), Math.random()], 4),
  ...multiplyItem<TernaryNumber>([Math.random(), Math.random(), Math.random()], 4),
];
