import { describe, expect, test } from "@jest/globals";
import {
  calcUniqueIntervalSpaces,
  caveToString,
  constructCave,
  getCaveBounds,
  getIntervalsAlongY,
  manhattanDistance,
  parseReport,
  parseReports,
  stringToPoint,
  trimIntervals,
  useSensor,
} from "./engine";
import { Report } from "./types";

var fs = require("fs");

var inputs = [
  {
    fileName: "input.txt",
    y: 2000000,
  },
  {
    fileName: "input-example.txt",
    y: 10,
  },
];

// const strData = `Sensor at x=3289936, y=2240812: closest beacon is at x=3232809, y=2000000
// Sensor at x=30408, y=622853: closest beacon is at x=-669401, y=844810
// Sensor at x=3983196, y=3966332: closest beacon is at x=3232807, y=4625568
// Sensor at x=929672, y=476353: closest beacon is at x=-669401, y=844810
// Sensor at x=1485689, y=3597734: closest beacon is at x=1951675, y=3073734
// Sensor at x=69493, y=1886070: closest beacon is at x=-669401, y=844810
// Sensor at x=2146060, y=3999371: closest beacon is at x=2300657, y=4128792
// Sensor at x=3228558, y=3890086: closest beacon is at x=3232807, y=4625568
// Sensor at x=3031444, y=2295853: closest beacon is at x=2928827, y=2611422
// Sensor at x=374444, y=3977240: closest beacon is at x=-888612, y=4039783
// Sensor at x=1207660, y=2710720: closest beacon is at x=1951675, y=3073734
// Sensor at x=3851310, y=61626: closest beacon is at x=4807592, y=976495
// Sensor at x=3195193, y=3022787: closest beacon is at x=2928827, y=2611422
// Sensor at x=1784895, y=2111901: closest beacon is at x=1951675, y=3073734
// Sensor at x=2894075, y=2427030: closest beacon is at x=2928827, y=2611422
// Sensor at x=3301867, y=803327: closest beacon is at x=3232809, y=2000000
// Sensor at x=2506616, y=3673347: closest beacon is at x=2300657, y=4128792
// Sensor at x=2628426, y=3054377: closest beacon is at x=1951675, y=3073734
// Sensor at x=2521975, y=1407505: closest beacon is at x=3232809, y=2000000
// Sensor at x=2825447, y=2045173: closest beacon is at x=3232809, y=2000000
// Sensor at x=2261212, y=2535886: closest beacon is at x=2928827, y=2611422
// Sensor at x=3956000, y=1616443: closest beacon is at x=3232809, y=2000000
// Sensor at x=3870784, y=2872668: closest beacon is at x=2928827, y=2611422
// `;

const reports: { report: Report; line: string }[] = [
  {
    report: { sensorPoint: { x: 2, y: 18 }, beaconPoint: { x: -2, y: 15 } },
    line: "Sensor at x=2, y=18: closest beacon is at x=-2, y=15",
  },
  {
    report: { sensorPoint: { x: 9, y: 16 }, beaconPoint: { x: 10, y: 16 } },
    line: "Sensor at x=9, y=16: closest beacon is at x=10, y=16",
  },
  {
    report: { sensorPoint: { x: 13, y: 2 }, beaconPoint: { x: 15, y: 3 } },
    line: "Sensor at x=13, y=2: closest beacon is at x=15, y=3",
  },
  {
    report: { sensorPoint: { x: 12, y: 14 }, beaconPoint: { x: 10, y: 16 } },
    line: "Sensor at x=12, y=14: closest beacon is at x=10, y=16",
  },
  {
    report: { sensorPoint: { x: 10, y: 20 }, beaconPoint: { x: 10, y: 16 } },
    line: "Sensor at x=10, y=20: closest beacon is at x=10, y=16",
  },
  {
    report: { sensorPoint: { x: 14, y: 17 }, beaconPoint: { x: 10, y: 16 } },
    line: "Sensor at x=14, y=17: closest beacon is at x=10, y=16",
  },
  {
    report: { sensorPoint: { x: 8, y: 7 }, beaconPoint: { x: 2, y: 10 } },
    line: "Sensor at x=8, y=7: closest beacon is at x=2, y=10",
  },
  {
    report: { sensorPoint: { x: 2, y: 0 }, beaconPoint: { x: 2, y: 10 } },
    line: "Sensor at x=2, y=0: closest beacon is at x=2, y=10",
  },
  {
    report: { sensorPoint: { x: 0, y: 11 }, beaconPoint: { x: 2, y: 10 } },
    line: "Sensor at x=0, y=11: closest beacon is at x=2, y=10",
  },
  {
    report: { sensorPoint: { x: 20, y: 14 }, beaconPoint: { x: 25, y: 17 } },
    line: "Sensor at x=20, y=14: closest beacon is at x=25, y=17",
  },
  {
    report: { sensorPoint: { x: 17, y: 20 }, beaconPoint: { x: 21, y: 22 } },
    line: "Sensor at x=17, y=20: closest beacon is at x=21, y=22",
  },
  {
    report: { sensorPoint: { x: 16, y: 7 }, beaconPoint: { x: 15, y: 3 } },
    line: "Sensor at x=16, y=7: closest beacon is at x=15, y=3",
  },
  {
    report: { sensorPoint: { x: 14, y: 3 }, beaconPoint: { x: 15, y: 3 } },
    line: "Sensor at x=14, y=3: closest beacon is at x=15, y=3",
  },
  {
    report: { sensorPoint: { x: 20, y: 1 }, beaconPoint: { x: 15, y: 3 } },
    line: "Sensor at x=20, y=1: closest beacon is at x=15, y=3",
  },
];

const oracle = {
  parse: [
    ...reports,
    {
      line: "Sensor at x=3289936, y=2240812: closest beacon is at x=3232809, y=2000000",
      report: {
        sensorPoint: { x: 3289936, y: 2240812 },
        beaconPoint: { x: 3232809, y: 2000000 },
      },
    },
  ],
  distance: [
    { p1: { x: 8, y: 7 }, p2: { x: 2, y: 10 }, ans: 9 },
    {
      p1: { x: 3289936, y: 2240812 },
      p2: { x: 3232809, y: 2000000 },
      ans: 297939,
    },
    {
      p1: { x: 30408, y: 622853 },
      p2: { x: -669401, y: 844810 },
      ans: 921766,
    },
  ],
  full: [
    {
      reports: reports.map((report) => report.report),
      lineY: 10,
      ans: 26,
    },
    {
      reports: reports.map((report) => report.report),
      lineY: 11,
      ans: 28,
    },
    {
      reports: reports.map((report) => report.report),
      lineY: 25,
      ans: 4,
    },
    {
      reports: reports.map((report) => report.report),
      lineY: -8,
      ans: 5,
    },
    {
      reports: [
        { sensorPoint: { x: 5, y: 5 }, beaconPoint: { x: 10, y: 10 } },
        { sensorPoint: { x: 9, y: 9 }, beaconPoint: { x: 10, y: 10 } },
      ],
      lineY: 9,
      ans: 13,
    },
    {
      reports: [
        { sensorPoint: { x: 5, y: 5 }, beaconPoint: { x: 10, y: 10 } },
        { sensorPoint: { x: 9, y: 9 }, beaconPoint: { x: 10, y: 10 } },
      ],
      lineY: 10,
      ans: 10,
    },
  ],
};

describe("part1", () => {
  test("Parses examples", () => {
    const tests = oracle.parse;
    tests.forEach((test) => {
      const reports = parseReport(test.line);
      expect(reports).toEqual(test.report);
    });
  });
  test("Calculates Manhattan Distance", () => {
    const tests = oracle.distance;
    tests.forEach((test) => {
      const dist = manhattanDistance(test.p1, test.p2);
      expect(dist).toBe(test.ans);
    });
  });

  test("GetIntervals", () => {
    const test = oracle.parse;
    const _reports = reports.map((report) => report.report);
    let cave = constructCave(_reports);
    // let cave = constructCave([reports[6].report]);

    const res = getIntervalsAlongY(-2, _reports);
    console.log(res);

    reports.forEach((report) => {
      cave = useSensor(cave, report.report.sensorPoint);
    });

    console.log(caveToString(cave));
  });

  test("calcUniqueIntervalSpaces", () => {
    const res = calcUniqueIntervalSpaces([
      [1, 5],
      [4, 6],
    ]);
    expect(res).toBe(5);
  });

  test("trimIntervals (1)", () => {
    const res = trimIntervals([
      [1, 5],
      [4, 6],
    ]);
    expect(res).toEqual([
      [1, 4],
      [4, 6],
    ]);
  });
  test("trimIntervals (2)", () => {
    const res = trimIntervals([
      [0, 4],
      [2, 6],
      [3, 7],
      [6, 8],
    ]);
    console.log(res);

    expect(res).toEqual([
      [0, 2],
      [2, 3],
      [3, 6],
      [6, 8],
    ]);
  });

  test("calcUniqueIntervalSpaces (2)", () => {
    const res = calcUniqueIntervalSpaces([
      [0, 4],
      [2, 6],
      [3, 7],
      [6, 8],
    ]);

    expect(res).toBe(8);
  });

  test("full test", () => {
    const tests = oracle.full;
    tests.forEach((test) => {
      const ans = getIntervalsAlongY(test.lineY, test.reports);
      expect(ans).toBe(ans);
    });
  });

  test("test", () => {
    // const test = oracle.par
    let cave = constructCave(oracle.full[4].reports);
    // console.log(getCaveBounds(cave.map));
    console.log(caveToString(cave));
    oracle.full[4].reports.forEach((report) => {
      cave = useSensor(cave, report.sensorPoint);
    });
    console.log(caveToString(cave));
  });

  // test("test 2", () => {
  //   const input = inputs[0]; // Main
  //   // const input = inputs[1]; // Example
  //   // const data: string = fs.readFileSync(input.fileName, "utf8").toString();
  //   const lines = strData.split(/\r?\n/).filter((line) => line.length);
  //   const reports = parseReports(lines);

  //   let cave = constructCave(reports);

  //   console.log("============= Cave Constructed =============");

  //   //   console.log(getCaveBounds(cave.map));
  //   //   console.log(caveToString(cave));

  //   reports.forEach((report) => {
  //     cave = useSensor(cave, report.sensorPoint);
  //   });

  //   console.log("============= Updated All Sensors =============");

  //   //   console.log(caveToString(cave));

  //   const nobeaconPoints = [...cave.map].filter((pair) => {
  //     const point = stringToPoint(pair[0]);
  //     return point.y === input.y && pair[1].type === "nobeacon";
  //   });

  //   console.log(nobeaconPoints.length);
  // });
});

describe("part2", () => {
  test("calculates example line 1", () => {
    expect(1 + 1).toBe(2);
  });
});
