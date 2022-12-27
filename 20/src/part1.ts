import util from "util";
import { LinkedList } from "./types";

var fs = require("fs");

var inputs = [
  {
    fileName: "input.txt",
  },
  {
    fileName: "input-example.txt",
  },
];

try {
  //   const input = inputs[0]; // Main
  const input = inputs[1]; // Example
  const data: string = fs.readFileSync(input.fileName, "utf8").toString();
  const lines = data.split(/\r?\n/).filter((line) => line.length);

  const nums = lines.map((numStr, index) => {
    return { num: parseInt(numStr), index: index };
  });
  console.log(nums);

  //   const ll = LinkedList.fromArray(nums);

  nums.forEach((numObj, i) => {
    nums.splice(i, 1);
    nums.splice(numObj.num + i, 0, numObj);
  });

  console.log(nums);
} catch (e: any) {
  console.log("Error:", e.stack);
}
