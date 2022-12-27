import {
  caveToString,
  constructCave,
  parseTraces,
  simulateSandDrop,
} from "./engine";
import util from "util";

var fs = require("fs");

const keypress = async () => {
  process.stdin.setRawMode(true);
  return new Promise((resolve) =>
    process.stdin.once("data", () => {
      process.stdin.setRawMode(false);
      resolve(null);
    })
  );
};

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
  const input = inputs[1];
  const data: string = fs.readFileSync(input.fileName, "utf8").toString();

  const traces = parseTraces(data.split("\n").filter((l) => l.length));
  const cave = constructCave(traces);
  //   const caveStr = caveToString(cave);
  let updatedCave = cave;
  for (let index = 0; index < 1000000; index++) {
    const { cave, intoAbyss } = simulateSandDrop(updatedCave);
    updatedCave = cave;
    console.log(caveToString(updatedCave));
    if (intoAbyss) {
      console.log(index, true);
      break;
    }
  }

  //   console.log(caveStr);
} catch (e: any) {
  console.log("Error:", e.stack);
}
