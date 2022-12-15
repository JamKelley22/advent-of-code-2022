import { describe, expect, test } from "@jest/globals";
import {
  caveToString,
  constructCave,
  getAllTraceBounds,
  parseTraces,
} from "./engine";
import { Bounds, Point, Trace } from "./types";

const traces: Trace[] = [
  {
    path: [
      { x: 498, y: 4 },
      { x: 498, y: 6 },
      { x: 496, y: 6 },
    ],
  },
  {
    path: [
      { x: 503, y: 4 },
      { x: 502, y: 4 },
      { x: 502, y: 9 },
      { x: 494, y: 9 },
    ],
  },
];

const oracle: {
  parse: { input: string; traces: Trace[] }[];
  bounds: {
    traces: Trace[];
    bounds: Bounds;
    additionalPoint?: Point;
  }[];
  construct: { caveStr: string; traces: Trace[] }[];
} = {
  parse: [
    {
      input: `498,4 -> 498,6 -> 496,6
      503,4 -> 502,4 -> 502,9 -> 494,9`,
      traces: traces,
    },
  ],
  bounds: [
    {
      traces: traces,
      bounds: {
        x: {
          min: 494,
          max: 503,
          size: 10,
        },
        y: {
          min: 0,
          max: 9,
          size: 10,
        },
      },
      additionalPoint: { x: 500, y: 0 },
    },
  ],
  construct: [
    {
      traces: traces,
      caveStr: `\
......+...
..........
..........
..........
....#...##
....#...#.
..###...#.
........#.
........#.
#########.
`,
    },
  ],
};

describe("part1", () => {
  test("Parses examples", () => {
    const test = oracle.parse;
    test.forEach((test) => {
      const traces = parseTraces(test.input.split("\n"));
      expect(traces).toEqual(test.traces);
    });
  });
  test("Gets Bounds", () => {
    const test = oracle.bounds;
    test.forEach((test) => {
      const bounds = getAllTraceBounds(test.traces, test.additionalPoint);
      expect(bounds).toEqual(test.bounds);
    });
  });

  test("Constructs & ToStrings Correctly", () => {
    const test = oracle.construct;
    test.forEach((test) => {
      const cave = constructCave(test.traces);
      const caveStr = caveToString(cave);
      expect(caveStr).toEqual(test.caveStr);
    });
  });

  test("Run", () => {
    const cave = constructCave(traces);
    const caveStr = caveToString(cave);
    console.log(caveStr);
  });
});

describe("part2", () => {
  test("calculates example line 1", () => {
    expect(1 + 1).toBe(2);
  });
});
