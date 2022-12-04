import { describe, expect, test } from "@jest/globals";

import {
  Assignment,
  calculateLine,
  parseLine,
  assignmentsToString,
  fullyContainsCalc,
  partlyContainsCalc,
} from "./engine";

const oracle: {
  str: string;
  assignment: Assignment[];
  fullyContains: boolean;
  contains: boolean;
}[] = [
  {
    str: "2-4,6-8",
    assignment: [
      { start: 2, end: 4 },
      { start: 6, end: 8 },
    ],
    fullyContains: false,
    contains: false,
  },
  {
    str: "2-3,4-5",
    assignment: [
      { start: 2, end: 3 },
      { start: 4, end: 5 },
    ],
    fullyContains: false,
    contains: false,
  },
  {
    str: "5-7,7-9",
    assignment: [
      { start: 5, end: 7 },
      { start: 7, end: 9 },
    ],
    fullyContains: false,
    contains: true,
  },
  {
    str: "2-8,3-7",
    assignment: [
      { start: 2, end: 8 },
      { start: 3, end: 7 },
    ],
    fullyContains: true,
    contains: true,
  },
  {
    str: "6-6,4-6",
    assignment: [
      { start: 6, end: 6 },
      { start: 4, end: 6 },
    ],
    fullyContains: true,
    contains: true,
  },
  {
    str: "2-6,4-8",
    assignment: [
      { start: 2, end: 6 },
      { start: 4, end: 8 },
    ],
    fullyContains: false,
    contains: true,
  },
];

describe("part1", () => {
  test("parses example line (1)", () => {
    const assignment = parseLine(oracle[0].str);
    expect(assignment).toEqual(oracle[0].assignment);
  });
  test("parses example line (2)", () => {
    const assignment = parseLine(oracle[0].str);
    expect(assignment).toEqual(oracle[0].assignment);
  });
  test("parses example line (3)", () => {
    const assignment = parseLine(oracle[0].str);
    expect(assignment).toEqual(oracle[0].assignment);
  });
  test("parses example line (4)", () => {
    const assignment = parseLine(oracle[0].str);
    expect(assignment).toEqual(oracle[0].assignment);
  });
  test("parses example line (5)", () => {
    const assignment = parseLine(oracle[0].str);
    expect(assignment).toEqual(oracle[0].assignment);
  });
  test("parses example line (6)", () => {
    const assignment = parseLine(oracle[0].str);
    expect(assignment).toEqual(oracle[0].assignment);
  });

  test("calculates example line (1)", () => {
    const fullyContains = calculateLine(oracle[0].assignment);
    expect(fullyContains).toBe(oracle[0].fullyContains);
  });
  test("calculates example line (2)", () => {
    const fullyContains = calculateLine(oracle[1].assignment);
    expect(fullyContains).toBe(oracle[1].fullyContains);
  });
  test("calculates example line (3)", () => {
    const fullyContains = calculateLine(oracle[2].assignment);
    expect(fullyContains).toBe(oracle[2].fullyContains);
  });
  test("calculates example line (4)", () => {
    const fullyContains = calculateLine(oracle[3].assignment);
    expect(fullyContains).toBe(oracle[3].fullyContains);
  });
  test("calculates example line (5)", () => {
    const fullyContains = calculateLine(oracle[4].assignment);
    expect(fullyContains).toBe(oracle[4].fullyContains);
  });
  test("calculates example line (6)", () => {
    const fullyContains = calculateLine(oracle[5].assignment);
    expect(fullyContains).toBe(oracle[5].fullyContains);
  });

  test("calculates custom test (1)", () => {
    const testOracle = {
      str: "94-95,61-94", // 61-62,1-33
      assignment: [
        { start: 94, end: 95 },
        { start: 61, end: 94 },
      ],
      fullyContains: false,
    };
    const fullyContains = calculateLine(testOracle.assignment);
    expect(fullyContains).toBe(testOracle.fullyContains);
  });

  test("calculates custom test (2)", () => {
    const testOracle = {
      str: "9-85,8-85", //
      assignment: [
        { start: 9, end: 85 },
        { start: 8, end: 85 },
      ],
      fullyContains: true,
    };
    const fullyContains = calculateLine(testOracle.assignment);
    expect(fullyContains).toBe(testOracle.fullyContains);
  });

  test("calculates custom test (3)", () => {
    const testOracle = {
      str: "4-99,11-96", //1-96,8-93
      assignment: [
        { start: 4, end: 99 },
        { start: 11, end: 96 },
      ],
      fullyContains: true,
    };

    const fullyContains = calculateLine(testOracle.assignment);
    expect(fullyContains).toBe(testOracle.fullyContains);
  });

  test("toString assignments correctly (1)", () => {
    const testOracle = {
      assignments: [
        { start: 2, end: 4 },
        { start: 6, end: 8 },
      ],
    };

    const assignmentStrings = assignmentsToString(testOracle.assignments);

    expect(assignmentStrings).toEqual([".234.....", ".....678."]);
  });

  // test("toString assignments correctly (2)", () => {
  //   const testOracle = {
  //     assignments: [
  //       { start: 2, end: 9 },
  //       { start: 4, end: 7 },
  //     ],
  //   };

  //   const assignmentStrings = assignmentsToString(testOracle.assignments);
  //   console.log(`${assignmentStrings[0]}\n${assignmentStrings[1]}`);

  //   // expect(assignmentStrings).toEqual([".234.....", ".....678."]);
  // });
});

describe("part2", () => {
  test("calculates example line (1)", () => {
    const contains = calculateLine(oracle[0].assignment, partlyContainsCalc);
    expect(contains).toBe(oracle[0].contains);
  });
  test("calculates example line (2)", () => {
    const contains = calculateLine(oracle[1].assignment, partlyContainsCalc);
    expect(contains).toBe(oracle[1].contains);
  });
  test("calculates example line (3)", () => {
    const contains = calculateLine(oracle[2].assignment, partlyContainsCalc);
    expect(contains).toBe(oracle[2].contains);
  });
  test("calculates example line (4)", () => {
    const contains = calculateLine(oracle[3].assignment, partlyContainsCalc);
    expect(contains).toBe(oracle[3].contains);
  });
  test("calculates example line (5)", () => {
    const contains = calculateLine(oracle[4].assignment, partlyContainsCalc);
    expect(contains).toBe(oracle[4].contains);
  });
  test("calculates example line (6)", () => {
    const contains = calculateLine(oracle[5].assignment, partlyContainsCalc);
    expect(contains).toBe(oracle[5].contains);
  });
});
