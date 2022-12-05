import { describe, expect, test } from "@jest/globals";
import {
  calculateFinalStacks,
  getTopCratesFromStacks,
  Instruction,
  parseInstructionLine,
  parseStacks,
  Stack,
} from "./engine";

import "./globals.ts";

const oracle: {
  instructionStrings: string[];
  instructions: Instruction[];
  stackStrings: string[];
  stacks: Stack<string>[];
  endStacks: Stack<string>[];
  topCrates: string;
  endStacksMultiMove: Stack<string>[];
  topCratesMultiMove: string;
}[] = [
  {
    instructionStrings: [
      "move 1 from 2 to 1",
      "move 3 from 1 to 3",
      "move 2 from 2 to 1",
      "move 1 from 1 to 2",
    ],
    instructions: [
      { numberToMove: 1, fromStack: 2, toStack: 1 },
      { numberToMove: 3, fromStack: 1, toStack: 3 },
      { numberToMove: 2, fromStack: 2, toStack: 1 },
      { numberToMove: 1, fromStack: 1, toStack: 2 },
    ],
    stackStrings: ["    [D]    ", "[N] [C]    ", "[Z] [M] [P]"],
    stacks: [["Z", "N"], ["M", "C", "D"], ["P"]],
    endStacks: [["C"], ["M"], ["P", "D", "N", "Z"]],
    topCrates: "CMZ",
    endStacksMultiMove: [["M"], ["C"], ["P", "Z", "N", "D"]],
    topCratesMultiMove: "MCD",
  },
];

describe("part1", () => {
  test("Parses Example Instructions (1)", () => {
    const instructions = oracle[0].instructionStrings.map((instructionStr) =>
      parseInstructionLine(instructionStr)
    );

    expect(instructions[0]).toEqual(oracle[0].instructions[0]);
    expect(instructions[1]).toEqual(oracle[0].instructions[1]);
    expect(instructions[2]).toEqual(oracle[0].instructions[2]);
    expect(instructions[3]).toEqual(oracle[0].instructions[3]);
  });
  test("Parses Example Stacks (1)", () => {
    const stacks = parseStacks(oracle[0].stackStrings);
    expect(stacks).toEqual(oracle[0].stacks);
  });

  test("Calculates End Stacks Example (1)", () => {
    const stacks = oracle[0].stacks;
    const endStacks = calculateFinalStacks(stacks, oracle[0].instructions);
    expect(endStacks).toEqual(oracle[0].endStacks);
  });

  test("Calculates Top Crates from Stacks Example (1)", () => {
    const stacks = oracle[0].endStacks;
    const topCrates = getTopCratesFromStacks(stacks);
    expect(topCrates).toEqual(oracle[0].topCrates);
  });

  test("Calculates End Stacks (Multi Move [CrateMover 9001]) Example (1)", () => {
    const stacks = oracle[0].stacks;
    console.log(stacks);

    const endStacks = calculateFinalStacks(
      stacks,
      oracle[0].instructions,
      true
    );
    console.log(endStacks);

    expect(endStacks).toEqual(oracle[0].endStacksMultiMove);
  });

  test("Calculates Top Crates from Stacks (Multi Move [CrateMover 9001]) Example (1)", () => {
    const stacks = oracle[0].endStacksMultiMove;
    const topCrates = getTopCratesFromStacks(stacks);
    expect(topCrates).toEqual(oracle[0].topCratesMultiMove);
  });
});

describe("part2", () => {
  test("calculates example line 1", () => {
    expect(1 + 1).toBe(2);
  });
});
