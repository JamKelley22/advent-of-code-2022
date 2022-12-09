export const Direction = ["L", "R", "U", "D"];
export type Direction = typeof Direction[number];

export type Motion = {
  dir: Direction;
  numSteps: number;
};

export type Move = {
  rowChange: number;
  colChange: number;
};

export type Location = {
  row: number;
  col: number;
};

export type Space = "Empty" | "Head" | "Tail" | "Both";

export type RopeMap = {
  tailVisitedMap: Map<string, boolean>;
  map: Map<string, Space>;
};
