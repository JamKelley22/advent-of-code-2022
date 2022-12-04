import { calculateLine, parseLine, assignmentsToString } from "./engine";

var fs = require("fs");

try {
  const data: string = fs.readFileSync("input.txt", "utf8").toString();

  const lines = data.split(/\r?\n/);

  //   let output = "";

  const total = lines.reduce((acc, line) => {
    if (line.length === 0) return acc;
    const assignments = parseLine(line);
    const fullyContains = calculateLine(assignments);
    // if (fullyContains) {
    console.log(line, fullyContains);
    // }
    // output += `${line.toString()} ${fullyContains}\n`;
    // console.log(assignmentsToString(assignments));
    // output += `${assignmentsToString(assignments)
    //   .map((a) => {
    //     if (a.toString().charAt(0) === ",")
    //       return `${a.toString().slice(1, a.toString().length)}\n`;
    //     return `${a.toString()}\n`;
    //   })
    //   .toString()}\n\n`;

    return fullyContains ? ++acc : acc;
  }, 0);

  //   fs.writeFileSync("output.txt", output);

  console.log(total);
} catch (e: any) {
  console.log("Error:", e.stack);
}
