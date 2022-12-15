import { describe, expect, test } from "@jest/globals";
import { createGraph, parseGrid } from "./engine";
import util from "util";

var fs = require("fs");

var inputs = [
  {
    fileName: "input.txt",
  },
  {
    fileName: "input-example.txt",
  },
  {
    fileName: "input-example2.txt",
  },
];

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

  test("run", () => {
    const input = inputs[0];
    const data: string = fs.readFileSync(input.fileName, "utf8").toString();
    const grid = parseGrid(data);
    const graph = createGraph(grid);
    //   console.log(util.inspect(graph.nodes, false, 4, true /* enable colors */));
    const startNode = [...graph.nodes].find((node) => node[1].data.isStart);
    const endNode = [...graph.nodes].find((node) => node[1].data.isBestSignal);

    if (!startNode || !endNode) {
      throw new Error(`Cound not find start or end node`);
    }

    const obj = graph.dijkstras(/*startNode[0], endNode[0]*/);
    //   console.log(obj);

    //   console.log(util.inspect(obj, false, 3, true));
    const bestSignalIndex = obj.nodes.findIndex((node) => node[0].isBestSignal);
    //   const bestSignalNode = obj.nodes.find((node) => node[0].isBestSignal);
    //   console.log(util.inspect(bestSignalNode, false, 4, true));

    //   console.log(obj.dist);
    //   console.log(bestSignalIndex);

    console.log(obj.dist[bestSignalIndex]);
  });
});

describe("part2", () => {
  test("calculates example line 1", () => {
    expect(1 + 1).toBe(2);
  });
});
