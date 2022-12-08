import {
  calculateNumVisibleTrees,
  calculateScenicScores,
  parseForest,
} from "./engine";

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
  const scenicScores = calculateScenicScores(forest);

  const highestScenicScore = Math.max(
    ...scenicScores.map((scoreRow) => Math.max(...scoreRow))
  );

  console.log(highestScenicScore);
} catch (e: any) {
  console.log("Error:", e.stack);
}
