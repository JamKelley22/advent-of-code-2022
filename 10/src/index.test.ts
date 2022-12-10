import { describe, expect, test } from "@jest/globals";
import { defaultCPU } from "./config";
import { loadInstructions, parseLine } from "./engine";
import { CPU, Instruction } from "./types";

const oracle: {
  parse: { instructionStr: string; instruction: Instruction }[];
  load: {
    instructions: Instruction[];
    cpuCyclesAfter: CPU<Instruction>[];
  }[];
} = {
  parse: [
    {
      instructionStr: "addx 15",
      instruction: {
        finishCycle: undefined,
        onComplete: undefined,
        type: "addx",
      },
    },
    {
      instructionStr: "noop",
      instruction: {
        finishCycle: undefined,
        onComplete: undefined,
        type: "noop",
      },
    },
  ],
  load: [
    {
      instructions: [
        { finishCycle: undefined, onComplete: undefined, type: "addx" },
        { finishCycle: undefined, onComplete: undefined, type: "noop" },
      ],
      cpuCyclesAfter: [
        {
          queue: Array<Instruction>(),
          cyclesPerTick: defaultCPU.cyclesPerTick,
          register: undefined,
          livingProcesses: [],
          crt: [[]],
        },
      ],
    },
  ],
};

describe("part1", () => {
  test("parses line (0)", () => {
    const test = oracle.parse[0];
    const ins = parseLine(test.instructionStr);
    // expect(ins.cyclesToComplete).toBe(test.instruction.cyclesToComplete);
    expect(ins.type).toBe(test.instruction.type);
  });
  test("parses line (1)", () => {
    const test = oracle.parse[0];
    const ins = parseLine(test.instructionStr);
    // expect(ins.cyclesToComplete).toBe(test.instruction.cyclesToComplete);
    expect(ins.type).toBe(test.instruction.type);
  });

  test("loads instructions (0)", () => {
    const test = oracle.load[0];
    const cpu = defaultCPU;
    const instructions = loadInstructions(cpu, test.instructions);
    expect(instructions).toEqual(test.cpuCyclesAfter[0]);
  });
});

describe("part2", () => {
  test("calculates example line 1", () => {
    expect(1 + 1).toBe(2);
  });
});
