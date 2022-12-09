import { Location, RopeMap, Space } from "./types";

export const defaultStartLocation: Location = { row: 0, col: 0 };

export const defaultStartHeadLocation: Location = defaultStartLocation;
export const defaultStartTailLocation: Location = defaultStartLocation;

export const defaultStartRopeMap: RopeMap = {
  tailVisitedMap: new Map<string, boolean>([
    [
      `[${[defaultStartLocation.row, defaultStartLocation.col].toString()}]`,
      true,
    ],
  ]),
  map: new Map<string, Space>([
    [
      `[${[defaultStartLocation.row, defaultStartLocation.col].toString()}]`,
      "Both",
    ],
  ]),
};
