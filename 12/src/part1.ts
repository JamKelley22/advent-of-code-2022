import { parseGrid, createGraph, NodeData } from "./engine";
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

try {
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
} catch (e: any) {
  console.log("Error:", e.stack);
}
