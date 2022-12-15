import { describe, expect, test } from "@jest/globals";
import { astToString, compareASTs, parsePacket } from "./engine";
import util from "util";

const oracle = {
  compare: [
    {
      p1: "[1,1,3,1,1]",
      p2: "[1,1,5,1,1]",
      correctOrder: true,
    },
    {
      p1: "[[1],[2,3,4]]",
      p2: "[[1],4]",
      correctOrder: true,
    },
    {
      p1: "[9]",
      p2: "[[8,7,6]]",
      correctOrder: false,
    },
    {
      p1: "[[4,4],4,4]",
      p2: "[[4,4],4,4,4]",
      correctOrder: true,
    },
    {
      p1: "[7,7,7,7]",
      p2: "[7,7,7]",
      correctOrder: false,
    },
    {
      p1: "[]",
      p2: "[3]",
      correctOrder: true,
    },
    {
      p1: "[[[]]]",
      p2: "[[]]",
      correctOrder: false,
    },
    {
      p1: "[1,[2,[3,[4,[5,6,7]]]],8,9]",
      p2: "[1,[2,[3,[4,[5,6,0]]]],8,9]",
      correctOrder: false,
    },
  ],
};

describe("part1", () => {
  test("Parses and unparses", () => {
    const tests = oracle.compare;
    tests.forEach((test) => {
      const re1 = new RegExp(",", "g");
      const re2 = new RegExp("]", "g");

      const str1 = astToString(parsePacket(test.p1).root);
      expect(str1).toBe(test.p1.replace(re1, "").replace(re2, ""));
      const str2 = astToString(parsePacket(test.p2).root);
      expect(str2).toBe(test.p2.replace(re1, "").replace(re2, ""));
    });
  });
  test("calculates examples", () => {
    const tests = oracle.compare;
    tests.forEach((test, i) => {
      const p1 = parsePacket(test.p1);
      const p2 = parsePacket(test.p2);
      const res = compareASTs(p1.root, p2.root, 0, i === 3);
      expect(res === 0).toBe(false);
      const correctOrder = res > 0;
      expect(correctOrder).toBe(test.correctOrder);
    });

    // console.log(util.inspect(packet, false, null, true));
  });
});

describe("part2", () => {
  test("calculates example line 1", () => {
    expect(1 + 1).toBe(2);
  });
});
