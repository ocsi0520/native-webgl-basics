export const allAxis = ["x", "y", "z"] as const;
export type Axis = (typeof allAxis)[number];