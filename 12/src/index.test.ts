import { describe, expect, test } from "@jest/globals";
import { createGraph, parseGrid } from "./engine";
import util from "util";

const oracle: {
  parse: {
    input: string;
    edges: { from: number[]; to: number[]; edge: boolean }[];
  }[];
} = {
  parse: [
    {
      input: `Sab
              abc
              acc`,
      edges: [
        { from: [0, 0], to: [0, 1], edge: true },
        { from: [0, 0], to: [1, 0], edge: true },

        { from: [0, 1], to: [0, 2], edge: true },
        { from: [0, 1], to: [1, 1], edge: true },
        { from: [0, 1], to: [0, 0], edge: true },

        { from: [0, 2], to: [0, 1], edge: true },
        { from: [0, 2], to: [1, 2], edge: true },

        //======================================

        { from: [1, 0], to: [0, 0], edge: true },
        { from: [1, 0], to: [1, 1], edge: true },
        { from: [1, 0], to: [2, 0], edge: true },

        { from: [1, 1], to: [0, 1], edge: true },
        { from: [1, 1], to: [1, 2], edge: true },
        { from: [1, 1], to: [2, 1], edge: true },
        { from: [1, 1], to: [1, 0], edge: true },

        { from: [1, 2], to: [0, 2], edge: true },
        { from: [1, 2], to: [2, 2], edge: true },
        { from: [1, 2], to: [1, 1], edge: true },

        //======================================

        { from: [2, 0], to: [1, 0], edge: true },
        { from: [2, 0], to: [2, 1], edge: false },

        { from: [2, 1], to: [1, 1], edge: true },
        { from: [2, 1], to: [2, 2], edge: true },
        { from: [2, 1], to: [2, 0], edge: false },

        { from: [2, 2], to: [1, 2], edge: true },
        { from: [2, 2], to: [2, 1], edge: true },
      ],
    },
  ],
};

describe("part1", () => {
  test("Parses and Creates Graph", () => {
    const test = oracle.parse[0];
    const grid = parseGrid(test.input);
    const graph = createGraph(grid);
    // console.log(util.inspect(graph.nodes, false, 4, true /* enable colors */));

    // const obj = graph.dijkstras();
    // console.log(util.inspect(obj, false, 3, true));

    test.edges.forEach((edge) => {
      expect(
        graph.hasEdge(
          grid[edge.from[0]][edge.from[1]],
          grid[edge.to[0]][edge.to[1]]
        )
      ).toBe(edge.edge);
    });
  });
});

describe("part2", () => {
  test("calculates example line 1", () => {
    expect(1 + 1).toBe(2);
  });
});
