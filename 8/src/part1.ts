import { calculateNumVisibleTrees, parseForest } from "./engine";

var fs = require("fs");

const inputs = [
  {
    fileName: "input.txt",
  },
  {
    fileName: "input-example.txt",
  },
];

try {
  const input = inputs[0];
  const data: string = fs.readFileSync(input.fileName, "utf8").toString();

  const forest = parseForest(data);
  const numVisibleTrees = calculateNumVisibleTrees(forest);

  console.log(numVisibleTrees);
} catch (e: any) {
  console.log("Error:", e.stack);
}
