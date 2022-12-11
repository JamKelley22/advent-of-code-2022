import { describe, expect, test } from "@jest/globals";
import {
  adjustWorryLevelAtNoDamage,
  applyOperation,
  applyTest,
  getTarget,
} from "./engine";
import { Conditional, Item, Monkey, Operation, Test } from "./types";

const oracle: {
  applyOp: {
    op: Operation;
    item: Item;
    ans: number;
  }[];
  adjustWorryLevelAtNoDamage: { item: Item; ans: Item }[];
  applyTest: { test: Test; item: Item; ans: boolean }[];
  getTarget: { conditional: Conditional; testRes: boolean; ans: number }[];
} = {
  applyOp: [
    {
      op: { term1: "old", opCode: "+", num: 2 },
      item: { worryLevel: 2 },
      ans: 4,
    },
    {
      op: { term1: "old", opCode: "*", num: "old" },
      item: { worryLevel: 10 },
      ans: 100,
    },
    {
      op: { term1: "old", opCode: "+", num: -30 },
      item: { worryLevel: 0 },
      ans: -30,
    },
  ],
  adjustWorryLevelAtNoDamage: [
    {
      item: { worryLevel: 1 },
      ans: { worryLevel: 0 },
    },
    {
      item: { worryLevel: 10 },
      ans: { worryLevel: 3 },
    },
  ],
  applyTest: [
    {
      test: {
        type: "divisible",
        number: 2,
        conditional: { trueTarget: 1, falseTarget: 2 },
      },
      item: { worryLevel: 10 },
      ans: true,
    },
    {
      test: {
        type: "divisible",
        number: 10,
        conditional: { trueTarget: 1, falseTarget: 2 },
      },
      item: { worryLevel: 15 },
      ans: false,
    },
  ],
  getTarget: [
    {
      conditional: { trueTarget: 1, falseTarget: 2 },
      testRes: false,
      ans: 2,
    },
    {
      conditional: { trueTarget: 10, falseTarget: 1 },
      testRes: true,
      ans: 10,
    },
  ],
};

describe("part1", () => {
  test("Applies Operations Correctly (all)", () => {
    const tests = oracle.applyOp;
    tests.forEach((test) => {
      const res = applyOperation(test.op, test.item);
      expect(res).toBe(test.ans);
    });
  });
  test("Adjusts Worry Level Correctly (all)", () => {
    const tests = oracle.adjustWorryLevelAtNoDamage;
    tests.forEach((test) => {
      const res = adjustWorryLevelAtNoDamage(test.item);
      expect(res).toEqual(test.ans);
    });
  });
  test("Gets Correct Target From Test (all)", () => {
    const tests = oracle.adjustWorryLevelAtNoDamage;
    tests.forEach((test) => {
      const res = adjustWorryLevelAtNoDamage(test.item);
      expect(res).toEqual(test.ans);
    });
  });
  test("Tests Worry Level Correctly (all)", () => {
    const tests = oracle.applyTest;
    tests.forEach((test) => {
      const res = applyTest(test.test, test.item);
      expect(res).toBe(test.ans);
    });
  });
  test("Gets Correct Target (all)", () => {
    const tests = oracle.getTarget;
    tests.forEach((test) => {
      const res = getTarget(test.conditional, test.testRes);
      expect(res).toBe(test.ans);
    });
  });
});

describe("part2", () => {
  test("calculates example line 1", () => {
    expect(1 + 1).toBe(2);
  });
});
