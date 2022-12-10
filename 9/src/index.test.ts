import { describe, expect, test } from "@jest/globals";
import {
  defaultStartHeadLocation,
  defaultStartRopeMap,
  defaultStartTailLocation,
} from "./config";
import {
  applyMotion,
  getLocation,
  keyFromLocation,
  locationFromKey,
  moveHeadAndTail,
  normalizeMap,
  parseMotions,
} from "./engine";
import { Motion, RopeMap, Location, Space } from "./types";

import "./globals";

const oracle: {
  basic: {
    inputMotions: string[];
    headMotions?: Motion[];
    endRopeMap?: RopeMap;
    throwsErrorParsing?: boolean;
    throwsError?: boolean;
    endLocations: {
      head?: Location;
      tail?: Location;
    };
  }[];
} = {
  basic: [
    {
      inputMotions: ["R 4", "U 4", "L 3", "D 1", "R 4", "D 1", "L 5", "R 2"],
      headMotions: [
        { dir: "R", numSteps: 4 },
        { dir: "U", numSteps: 4 },
        { dir: "L", numSteps: 3 },
        { dir: "D", numSteps: 1 },
        { dir: "R", numSteps: 4 },
        { dir: "D", numSteps: 1 },
        { dir: "L", numSteps: 5 },
        { dir: "R", numSteps: 2 },
      ],
      endRopeMap: {
        // ..##..
        // ...##.
        // .####.
        // ....#.
        // s###..
        tailVisitedMap: new Map<string, boolean>([
          [`[${[4 - 0, 2].toString()}]`, true],
          [`[${[4 - 0, 3].toString()}]`, true],
          [`[${[4 - 1, 3].toString()}]`, true],
          [`[${[4 - 1, 4].toString()}]`, true],
          [`[${[4 - 2, 1].toString()}]`, true],
          [`[${[4 - 2, 2].toString()}]`, true],
          [`[${[4 - 2, 3].toString()}]`, true],
          [`[${[4 - 2, 4].toString()}]`, true],
          [`[${[4 - 3, 4].toString()}]`, true],
          [`[${[4 - 4, 1].toString()}]`, true],
          [`[${[4 - 4, 2].toString()}]`, true],
          [`[${[4 - 4, 3].toString()}]`, true],
        ]),
        // ......
        // ......
        // .TH...
        // ......
        // s.....
        map: new Map<string, Space[]>([
          [`[${[4 - 2, 2].toString()}]`, ["Head"]],
          // [`[${[4 - 2, 1].toString()}]`, "Tail"],
        ]),
      },
      endLocations: {
        head: { row: 4 - 2, col: 2 },
        // tail: { row: 4 - 2, col: 1 },
      },
    },
    {
      inputMotions: ["U 1", "P 4", "L 3"],
      headMotions: undefined,
      endRopeMap: undefined,
      throwsErrorParsing: true,
      throwsError: true,
      endLocations: {
        head: undefined,
        tail: undefined,
      },
    },
    {
      inputMotions: ["U -1", "D 4", "L 3"],
      headMotions: undefined,
      endRopeMap: undefined,
      throwsErrorParsing: true,
      throwsError: true,
      endLocations: {
        head: undefined,
        tail: undefined,
      },
    },
    {
      inputMotions: [],
      headMotions: [],
      endRopeMap: undefined,
      endLocations: {
        head: { row: 0, col: 0 },
        tail: { row: 0, col: 0 },
      },
    },
    {
      inputMotions: ["R 4"],
      headMotions: [{ dir: "R", numSteps: 4 }],
      endRopeMap: {
        // s###..
        tailVisitedMap: new Map<string, boolean>([
          [`[${[0, 1].toString()}]`, true],
          [`[${[0, 2].toString()}]`, true],
          [`[${[0, 3].toString()}]`, true],
        ]),
        // s..TH.
        map: new Map<string, Space[]>([
          [`[${[0, 4].toString()}]`, ["Head"]],
          // [`[${[0, 3].toString()}]`, "Tail"],
        ]),
      },
      endLocations: {
        head: { row: 0, col: 4 },
        // tail: { row: 0, col: 3 },
      },
    },
    {
      inputMotions: ["R 4", "L 2"],
      headMotions: [
        { dir: "R", numSteps: 4 },
        { dir: "L", numSteps: 2 },
      ],
      endRopeMap: {
        // s###..
        tailVisitedMap: new Map<string, boolean>([
          [`[${[0, 1].toString()}]`, true],
          [`[${[0, 2].toString()}]`, true],
          [`[${[0, 3].toString()}]`, true],
        ]),
        // s.HT..
        map: new Map<string, Space[]>([
          [`[${[0, 2].toString()}]`, ["Head"]],
          // [`[${[0, 3].toString()}]`, "Tail"],
        ]),
      },
      endLocations: {
        head: { row: 0, col: 2 },
        // tail: { row: 0, col: 3 },
      },
    },
    {
      inputMotions: ["R 1", "U 2"],
      headMotions: [
        { dir: "R", numSteps: 1 },
        { dir: "U", numSteps: 2 },
      ],
      endRopeMap: {
        // s###..
        tailVisitedMap: new Map<string, boolean>([
          // [`[${[0, 1].toString()}]`, true],
          // [`[${[0, 2].toString()}]`, true],
          // [`[${[0, 3].toString()}]`, true],
        ]),
        // .H....
        // .T....
        // s.....
        map: new Map<string, Space[]>([
          [`[${[2, 1].toString()}]`, ["Head"]],
          // [`[${[1, 1].toString()}]`, "Tail"],
        ]),
      },
      endLocations: {
        head: { row: 0, col: 2 },
        // tail: { row: 0, col: 3 },
      },
    },
  ],
};

describe("part1", () => {
  test("Parses input motions (0)", () => {
    const test = oracle.basic[0];
    const fun = () => {
      return parseMotions(test.inputMotions);
    };
    if (!test.throwsErrorParsing) {
      const motions = fun();
      expect(motions).toEqual(test.headMotions);
    } else {
      expect(fun).toThrowError();
    }
  });
  test("Parses input motions (1)", () => {
    const test = oracle.basic[1];
    const fun = () => {
      return parseMotions(test.inputMotions);
    };
    if (!test.throwsErrorParsing) {
      const motions = fun();
      expect(motions).toEqual(test.headMotions);
    } else {
      expect(fun).toThrowError();
    }
  });
  test("Parses input motions (2)", () => {
    const test = oracle.basic[2];
    const fun = () => {
      return parseMotions(test.inputMotions);
    };
    if (!test.throwsErrorParsing) {
      const motions = fun();
      expect(motions).toEqual(test.headMotions);
    } else {
      expect(fun).toThrowError();
    }
  });
  test("Parses input motions (3)", () => {
    const test = oracle.basic[3];
    const fun = () => {
      return parseMotions(test.inputMotions);
    };
    if (!test.throwsErrorParsing) {
      const motions = fun();
      expect(motions).toEqual(test.headMotions);
    } else {
      expect(fun).toThrowError();
    }
  });

  test("Parses input motions (4)", () => {
    const test = oracle.basic[4];
    const fun = () => {
      return parseMotions(test.inputMotions);
    };
    if (!test.throwsErrorParsing) {
      const motions = fun();
      expect(motions).toEqual(test.headMotions);
    } else {
      expect(fun).toThrowError();
    }
  });

  test("Calculates Final RopeMap (0)", () => {
    const test = oracle.basic[0];
    const headMotions = test.headMotions!;

    const fun = () => {
      return moveHeadAndTail(defaultStartRopeMap, headMotions);
    };

    if (test.throwsError) {
      expect(fun).toThrowError();
      return;
    }
    const endRopeMap = fun();

    const testEndMapArr = [...(test.endRopeMap?.map || [])];
    const testEndTailVisitedArr = [...(test.endRopeMap?.tailVisitedMap || [])];
    // console.log(testEndMapArr);
    // console.log(endRopeMap.map);

    testEndMapArr.forEach((testEndMap) => {
      const has = endRopeMap.map.get(testEndMap[0]);
      expect(has).toBe(testEndMap[1]);
    });
    testEndTailVisitedArr.forEach((testEndTailVisited) => {
      const has = endRopeMap.tailVisitedMap.get(testEndTailVisited[0]);
      expect(has).toBe(testEndTailVisited[1]);
    });
  });
  test("Calculates Final RopeMap (1)", () => {
    const test = oracle.basic[1];
    const headMotions = test.headMotions;

    const fun = () => {
      return moveHeadAndTail(defaultStartRopeMap, headMotions!);
    };

    if (test.throwsError) {
      expect(fun).toThrowError();
      return;
    }
    const endRopeMap = fun();

    const testEndMapArr = [...(test.endRopeMap?.map || [])];
    const testEndTailVisitedArr = [...(test.endRopeMap?.tailVisitedMap || [])];

    testEndMapArr.forEach((testEndMap) => {
      const has = endRopeMap.map.get(testEndMap[0]);
      expect(has).toBe(testEndMap[1]);
    });
    testEndTailVisitedArr.forEach((testEndTailVisited) => {
      const has = endRopeMap.tailVisitedMap.get(testEndTailVisited[0]);
      expect(has).toBe(testEndTailVisited[1]);
    });
  });
  test("Calculates Final RopeMap (2)", () => {
    const test = oracle.basic[2];
    const headMotions = test.headMotions!;

    const fun = () => {
      return moveHeadAndTail(defaultStartRopeMap, headMotions);
    };

    if (test.throwsError) {
      expect(fun).toThrowError();
      return;
    }
    const endRopeMap = fun();

    const testEndMapArr = [...(test.endRopeMap?.map || [])];
    const testEndTailVisitedArr = [...(test.endRopeMap?.tailVisitedMap || [])];

    testEndMapArr.forEach((testEndMap) => {
      const has = endRopeMap.map.get(testEndMap[0]);
      expect(has).toBe(testEndMap[1]);
    });
    testEndTailVisitedArr.forEach((testEndTailVisited) => {
      const has = endRopeMap.tailVisitedMap.get(testEndTailVisited[0]);
      expect(has).toBe(testEndTailVisited[1]);
    });
  });
  test("Calculates Final RopeMap (3)", () => {
    const test = oracle.basic[3];
    const headMotions = test.headMotions!;

    const fun = () => {
      return moveHeadAndTail(defaultStartRopeMap, headMotions);
    };

    if (test.throwsError) {
      expect(fun).toThrowError();
      return;
    }
    const endRopeMap = fun();

    const testEndMapArr = [...(test.endRopeMap?.map || [])];
    const testEndTailVisitedArr = [...(test.endRopeMap?.tailVisitedMap || [])];

    testEndMapArr.forEach((testEndMap) => {
      const has = endRopeMap.map.get(testEndMap[0]);
      expect(has).toBe(testEndMap[1]);
    });
    testEndTailVisitedArr.forEach((testEndTailVisited) => {
      const has = endRopeMap.tailVisitedMap.get(testEndTailVisited[0]);
      expect(has).toBe(testEndTailVisited[1]);
    });
  });
  test("Calculates Final RopeMap (4)", () => {
    const test = oracle.basic[4];
    const headMotions = test.headMotions!;

    const fun = () => {
      return moveHeadAndTail(defaultStartRopeMap, headMotions);
    };

    if (test.throwsError) {
      expect(fun).toThrowError();
      return;
    }
    const endRopeMap = fun();

    const testEndMapArr = [...(test.endRopeMap?.map || [])];
    const testEndTailVisitedArr = [...(test.endRopeMap?.tailVisitedMap || [])];

    testEndMapArr.forEach((testEndMap) => {
      const has = endRopeMap.map.get(testEndMap[0]);
      expect(has).toBe(testEndMap[1]);
    });
    // testEndTailVisitedArr.forEach((testEndTailVisited) => {
    //   const has = endRopeMap.tailVisitedMap.get(testEndTailVisited[0]);
    //   expect(has).toBe(testEndTailVisited[1]);
    // });
  });

  test("getLocation of Head and Tail (0)", () => {
    const test = oracle.basic[0];
    const headEndLocation = getLocation("Head", test.endRopeMap!.map);
    expect(test.endLocations.head).toEqual(headEndLocation);
    // const tailEndLocation = getLocation("Tail", test.endRopeMap!.map);
    // expect(test.endLocations.tail).toEqual(tailEndLocation);
  });
  test("getLocation of Head and Tail (1)", () => {
    const test = oracle.basic[4];
    const headEndLocation = getLocation("Head", test.endRopeMap!.map);
    expect(test.endLocations.head).toEqual(headEndLocation);
    // const tailEndLocation = getLocation("Tail", test.endRopeMap!.map);
    // expect(test.endLocations.tail).toEqual(tailEndLocation);
  });

  test("applyMotion correctly (0)", () => {
    const test = oracle.basic[0];
    const headEndLocation = moveHeadAndTail(
      defaultStartRopeMap,
      test.headMotions!
    );

    const testEndMapArr = [...(test.endRopeMap?.map || [])];

    // console.log(testEndMapArr);
    // console.log(headEndLocation.map);

    testEndMapArr.forEach((testEndMap) => {
      const space = headEndLocation.map.get(testEndMap[0]);
      // console.log(headEndLocation.map);
      // console.log(testEndMap[0]);

      // console.log("===");
      // console.log(space);

      expect(space).toBe(testEndMap[1]);
    });
  });
  test("applyMotion correctly (1)", () => {
    const test = oracle.basic[4];
    const headEndLocation = moveHeadAndTail(
      defaultStartRopeMap,
      test.headMotions!
    );

    const testEndMapArr = [...(test.endRopeMap?.map || [])];

    testEndMapArr.forEach((testEndMap) => {
      const space = headEndLocation.map.get(testEndMap[0]);

      expect(space).toBe(testEndMap[1]);
    });
  });
  test("applyMotion correctly (2)", () => {
    const test = oracle.basic[5];
    const headEndLocation = moveHeadAndTail(
      defaultStartRopeMap,
      test.headMotions!
    );

    const testEndMapArr = [...(test.endRopeMap?.map || [])];

    testEndMapArr.forEach((testEndMap) => {
      const space = headEndLocation.map.get(testEndMap[0]);

      expect(space).toBe(testEndMap[1]);
    });
  });
  test("applyMotion correctly (3)", () => {
    const test = oracle.basic[6];
    const headEndLocation = moveHeadAndTail(
      defaultStartRopeMap,
      test.headMotions!
    );

    const testEndMapArr = [...(test.endRopeMap?.map || [])];

    testEndMapArr.forEach((testEndMap) => {
      const space = headEndLocation.map.get(testEndMap[0]);

      expect(space).toBe(testEndMap[1]);
    });
  });

  test("Encodes key", () => {
    const key = keyFromLocation({ row: 2, col: 3 });
    expect(key).toBe("[2,3]");
  });
  test("Decodes key (0)", () => {
    const loc = locationFromKey("[2,3]");
    expect(loc).toEqual({ row: 2, col: 3 });
  });
  test("Decodes key (1)", () => {
    const loc = locationFromKey("2,3");
    expect(loc).toEqual({ row: 2, col: 3 });
  });

  //   test("Normalizes map", () => {
  //     // (-1, 1) | (0, 1) | (1, 1)
  //     // (-1, 0) | (0, 0) | (1, 0)
  //     // (-1,-1) | (0,-1) | (1,-1)
  //     const map: Map<string, Space> = new Map<string, Space[]>([
  //       ["[-1,1]", "Empty"],
  //       ["[0,1]", "Empty"],
  //       ["[1,1]", "Empty"],
  //       ["[-1,0]", "Empty"],
  //       ["[0,0]", "Empty"],
  //       ["[1,0]", "Empty"],
  //       ["[-1,-1]", "Empty"],
  //       ["[0,-1]", "Empty"],
  //       ["[1,-1]", "Empty"],
  //     ]);
  //     const normalizedMap = normalizeMap(map);
  //     // console.log(normalizedMap);

  //     // (0, 2) | (1, 2) | (2, 2)
  //     // (0, 1) | (1, 1) | (2, 1)
  //     // (0, 0) | (1, 0) | (2, 0)
  //     expect(normalizedMap).toEqual(
  //       new Map<string, Space[]>([
  //         ["[0,2]", "Empty"],
  //         ["[1,2]", "Empty"],
  //         ["[2,2]", "Empty"],
  //         ["[0,1]", "Empty"],
  //         ["[1,1]", "Empty"],
  //         ["[2,1]", "Empty"],
  //         ["[0,0]", "Empty"],
  //         ["[1,0]", "Empty"],
  //         ["[2,0]", "Empty"],
  //       ])
  //     );
  //   });

  //   // test('Calculates num unique visited spaces by tail (1)', () => {

  //   // })
});

describe("part2", () => {
  test("calculates example line 1", () => {
    expect(1 + 1).toBe(2);
  });
});
