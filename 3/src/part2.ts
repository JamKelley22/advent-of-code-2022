import { defaultConfig } from "./config";
import {
  calculateLine,
  calculateLinesPartTwo,
  chunkArray,
  parseLine,
  parseLinePartTwo,
} from "./engine";

var fs = require("fs");

try {
  const data: string = fs.readFileSync("input.txt", "utf8").toString();

  const lines = data.split(/\r?\n/);

  const sacks = lines.map((line) => parseLinePartTwo(line, defaultConfig));

  const groups = chunkArray(sacks, 3);

  // calculateLinesPartTwo(groups);

  console.log(groups);

  const total = groups.reduce((acc, group) => {
    if (group.length !== 3) return acc;
    return calculateLinesPartTwo(group, defaultConfig) + acc;
  }, 0);

  console.log(total);
} catch (e: any) {
  console.log("Error:", e.stack);
}
