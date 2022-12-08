import { describe, expect, test } from "@jest/globals";
import {
  calculateNumVisibleTrees,
  calculateScenicScore,
  calculateScenicScores,
  getColumn,
  isTreeVisibleInArr,
  parseForest,
} from "./engine";

const oracle = {
  overall: [
    {
      input: `30373
    25512
    65332
    33549
    35390
    `,
      forest: [
        [3, 0, 3, 7, 3],
        [2, 5, 5, 1, 2],
        [6, 5, 3, 3, 2],
        [3, 3, 5, 4, 9],
        [3, 5, 3, 9, 0],
      ],
      numVisibleTrees: 21,
      scenicScores: [
        [0, 0, 0, 0, 0],
        [0, 1, 4, 1, 0],
        [0, 6, 1, 2, 0],
        [0, 1, 8, 3, 0],
        [0, 0, 0, 0, 0],
      ],
    },
  ],
  single: [
    {
      row: [3, 0, 3, 7, 3],
      visibility: [true, false, false, true, true],
      scenicScores: [0, 1, 2, 3, 0],
    },
    {
      row: [0, 5, 5, 3, 5],
      visibility: [true, true, false, false, true],
      scenicScores: [0, 1, 2, 1, 0],
    },
  ],
};

describe("part1", () => {
  test("parses", () => {
    const test = oracle.overall[0];
    const forest = parseForest(test.input);
    expect(forest).toBe(test.forest);
  });

  test("calculates example row (0)", () => {
    const test = oracle.single[0];
    const treeVisArr = test.row.map((tree, i) =>
      isTreeVisibleInArr(test.row, i)
    );
    expect(treeVisArr).toEqual(test.visibility);
  });

  test("calculates example row (1)", () => {
    const test = oracle.single[1];
    const treeVisArr = test.row.map((tree, i) =>
      isTreeVisibleInArr(test.row, i)
    );
    expect(treeVisArr).toEqual(test.visibility);
  });

  test("calculates example col (1)", () => {
    const test = oracle.single[0];
    const treeArr = getColumn(
      test.row.map((n) => [n]),
      0
    );
    const treeVisArr = treeArr.map((tree, i) => isTreeVisibleInArr(treeArr, i));
    expect(treeVisArr).toEqual(test.visibility);
  });

  test("calculates example", () => {
    const test = oracle.overall[0];
    const numVisibleTrees = calculateNumVisibleTrees(test.forest);
    expect(numVisibleTrees).toBe(test.numVisibleTrees);
  });
});

describe("part2", () => {
  test("calculates scenic score row (0)", () => {
    const test = oracle.single[0];
    const scenicScores = test.row.map((treeHeight, i) =>
      calculateScenicScore(test.row, i)
    );

    expect(scenicScores).toEqual(test.scenicScores);
  });
  test("calculates scenic score row (1)", () => {
    const test = oracle.single[1];
    const scenicScores = test.row.map((treeHeight, i) =>
      calculateScenicScore(test.row, i)
    );

    expect(scenicScores).toEqual(test.scenicScores);
  });

  test("calculates scenic scores (1)", () => {
    const test = oracle.overall[0];
    const scenicScores = calculateScenicScores(test.forest);

    expect(scenicScores).toEqual(test.scenicScores);
  });
});
