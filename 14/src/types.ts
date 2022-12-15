export type Point = {
  x: number;
  y: number;
};

export type Trace = {
  path: Point[];
};

export type Bounds = {
  x: { min: number; max: number; size: number };
  y: { min: number; max: number; size: number };
};

export type Cave = {
  map: Space[][];
  sandSourcePoint: Point;
  floorHeight?: number;
};

export type SpaceType = "rock" | "air" | "sand" | "sandSource" | "floor";

export type Space = {
  type: SpaceType;
  ascii: string;
};

export const SpaceTypes: Map<SpaceType, Space> = new Map<SpaceType, Space>([
  ["air", { type: "air", ascii: "." }],
  ["rock", { type: "rock", ascii: "#" }],
  ["sand", { type: "sand", ascii: "o" }],
  ["sandSource", { type: "sandSource", ascii: "+" }],
  ["floor", { type: "floor", ascii: "-" }],
]);
