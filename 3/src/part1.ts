import { defaultConfig } from "./config";
import { calculateLine, parseLine } from "./engine";

var fs = require("fs");

try {
  const data: string = fs.readFileSync("input.txt", "utf8").toString();

  const lines = data.split(/\r?\n/);

  const total = lines.reduce((acc, line) => {
    if (line.length === 0) return acc;
    return calculateLine(parseLine(line, defaultConfig), defaultConfig) + acc;
  }, 0);

  console.log(total);
} catch (e: any) {
  console.log("Error:", e.stack);
}
