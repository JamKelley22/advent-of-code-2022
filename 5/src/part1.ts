import {
  calculateFinalStacks,
  getTopCratesFromStacks,
  parseInstructionLine,
  parseStacks,
} from "./engine";

import "./globals.js";

var fs = require("fs");

const inputs = [
  {
    fileName: "input.txt",
    stackStringEnd: 8,
    instructionsStart: 10,
  },
  {
    fileName: "input-example.txt",
    stackStringEnd: 3,
    instructionsStart: 5,
  },
];

try {
  const input = inputs[0];
  const data: string = fs.readFileSync(input.fileName, "utf8").toString();

  const lines = data.split(/\r?\n/);

  const stackStrings = lines.slice(0, input.stackStringEnd);
  const stacks = parseStacks(stackStrings);

  //   console.log(stacks);

  const instructions = lines
    .slice(input.instructionsStart, lines.length - 1)
    .map((line) => {
      return parseInstructionLine(line);
    });

  const endStacks = calculateFinalStacks(stacks, instructions);
  //   console.log(endStacks);

  const topCrates = getTopCratesFromStacks(endStacks);

  console.log(topCrates);
} catch (e: any) {
  console.log("Error:", e.stack);
}
