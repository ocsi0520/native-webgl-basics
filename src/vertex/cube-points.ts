import { TernaryNumber } from "./TernaryNumber";

// these are in clipspace
export const points: Array<TernaryNumber> = [
  // front
  [0, 0.5, 0.25], // 1
  [0, 0, 0.25], // 2
  [0.5, 0.5, 0.25], // 3
  [0.5, 0, 0.25], // 4

  // right side
  [0.5, 0.5, -0.25], // 5
  [0.5, 0, -0.25], // 6

  // back side
  [0, 0.5, -0.25], // 7
  [0, 0, -0.25], // 8

  // left side
  [0, 0.5, 0.25], // 9 (1),
  [0, 0, 0.25], // 10 (2)

  // cut
  // upper side
  [0, 0, 0.25], // 10 (2)
  [0, 0, -0.25], // 11 (8)
  [0.5, 0, 0.25], // 12 (4)
  [0.5, 0, -0.25], // 13 (6)

  // cut
  // down side
  [0, 0.5, -0.25], // 7
  [0, 0.5, 0.25], // 1
  [0.5, 0.5, -0.25], // 5
  [0.5, 0.5, 0.25], // 3
];
