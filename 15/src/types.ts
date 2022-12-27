export type Point = {
  x: number;
  y: number;
};

export type Report = {
  sensorPoint: Point;
  beaconPoint: Point;
};

export type Bounds = {
  x: { min: number; max: number; size: number };
  y: { min: number; max: number; size: number };
};

export type Cave = {
  map: Map<string, Space>;
};

export type SpaceType = "sensor" | "beacon" | "nobeacon" | "unknown";

export type Space = {
  type: SpaceType;
  ascii: string;
  report?: Report;
};

export const SpaceTypes: Map<SpaceType, Space> = new Map<SpaceType, Space>([
  ["sensor", { type: "sensor", ascii: "S" }],
  ["beacon", { type: "beacon", ascii: "B" }],
  ["nobeacon", { type: "nobeacon", ascii: "#" }],
  ["unknown", { type: "unknown", ascii: "." }],
]);

export type Interval = [number, number];
