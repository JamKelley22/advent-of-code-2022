import {
  defaultStartHeadLocation,
  defaultStartRopeMap,
  defaultStartTailLocation,
} from "./config";
import { moveHeadAndTail, parseMotions, printMap } from "./engine";

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
  const input = inputs[1];
  const data: string = fs.readFileSync(input.fileName, "utf8").toString();
  const lines = data.split(/\r?\n/).filter((line) => line.length);

  const headMotions = parseMotions(lines);
  const endRopeMap = moveHeadAndTail(defaultStartRopeMap, headMotions);

  console.log(printMap(endRopeMap.map));
  console.log(
    [...endRopeMap.tailVisitedMap].filter(
      (visitedLocation) => visitedLocation[1]
    ).length
  );
} catch (e: any) {
  console.log("Error:", e.stack);
}
