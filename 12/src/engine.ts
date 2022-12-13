import { defaultComparator, Graph, Node } from "./types";

export const charToHeight = (char: string): number => {
  if (char.length !== 1)
    throw new Error("Can not parse char with length !== 1. Char: " + char);
  let realChar = char;
  if (char === "S") realChar = "a";
  if (char === "E") realChar = "z";

  return realChar.charCodeAt(0) - "a".charCodeAt(0);
};

export type NodeData = {
  height: number;
  isStart: boolean;
  isBestSignal: boolean;
  i?: number;
  j?: number;
};

export const parseGrid = (data: string): NodeData[][] => {
  const grid = data
    .split(/\r?\n/)
    .filter((line) => line.length)
    .map((line) => line.trim().split(""));

  const nodeGrid: NodeData[][] = [];

  for (let i = 0; i < grid.length; i++) {
    const row = grid[i];
    nodeGrid[i] = [];
    for (let j = 0; j < row.length; j++) {
      const char = row[j];
      nodeGrid[i][j] = {
        height: charToHeight(char),
        isBestSignal: char === "E",
        isStart: char === "S",
        i: i,
        j: j,
      };
    }
  }

  return nodeGrid;
};

export const createGraph = (nodeGrid: NodeData[][]): Graph<NodeData> => {
  const graph: Graph<NodeData> = new Graph<NodeData>(
    (a, b) => a.height - b.height
  );

  for (let row = 0; row < nodeGrid.length; row++) {
    for (let col = 0; col < nodeGrid[row].length; col++) {
      const currentNode = nodeGrid[row][col];
      graph.addNode(currentNode);
      if (col > 0) {
        // Left
        const leftNode = nodeGrid[row][col - 1];
        if (Math.abs(currentNode.height - leftNode.height) < 2)
          graph.addEdge(currentNode, leftNode);
      }
      if (col < nodeGrid[row].length - 1) {
        // Right
        const rightNode = nodeGrid[row][col + 1];
        if (Math.abs(currentNode.height - rightNode.height) < 2)
          graph.addEdge(currentNode, rightNode);
      }
      if (row > 0) {
        // Top
        const topNode = nodeGrid[row - 1][col];
        if (Math.abs(currentNode.height - topNode.height) < 2)
          graph.addEdge(currentNode, topNode);
      }
      if (row < nodeGrid.length - 1) {
        // Bottom
        const bottomNode = nodeGrid[row + 1][col];
        if (Math.abs(currentNode.height - bottomNode.height) < 2)
          graph.addEdge(currentNode, bottomNode);
      }
    }
  }

  return graph;
};
