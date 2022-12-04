import { calculateLine, parseLine, partlyContainsCalc } from "./engine";

var fs = require("fs");

try {
  const data: string = fs.readFileSync("input.txt", "utf8").toString();

  const lines = data.split(/\r?\n/);

  const total = lines.reduce((acc, line) => {
    if (line.length === 0) return acc;
    const assignments = parseLine(line);
    const partlyContains = calculateLine(assignments, partlyContainsCalc);

    return partlyContains ? ++acc : acc;
  }, 0);

  console.log(total);
} catch (e: any) {
  console.log("Error:", e.stack);
}
