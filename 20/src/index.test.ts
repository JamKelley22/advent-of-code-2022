import { describe, expect, test } from "@jest/globals";
import { LinkedList } from "./types";

const oracle = {
  linkedList: [
    {
      arr: [1, 3, 4],
      res: "1 -> 3 -> 4",
    },
  ],
};

describe("part1", () => {
  test("Array to LinkedList", () => {
    const tests = oracle.linkedList;
    tests.forEach((test) => {
      const res = LinkedList.fromArray(test.arr);
      expect(res.toString()).toBe(test.res);
    });
  });
});

describe("part2", () => {
  test("calculates example line 1", () => {
    expect(1 + 1).toBe(2);
  });
});
