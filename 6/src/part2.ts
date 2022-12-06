import { defaultConfig } from "./config";
import { calculateStartIndex } from "./engine";

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
  const result = calculateStartIndex(
    data,
    defaultConfig.messageStartMarkerLength
  );
  console.log(result);
} catch (e: any) {
  console.log("Error:", e.stack);
}
