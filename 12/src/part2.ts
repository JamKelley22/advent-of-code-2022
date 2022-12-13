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
  const input = inputs[1];
  const data: string = fs.readFileSync(input.fileName, "utf8").toString();
  const lines = data.split(/\r?\n/).filter((line) => line.length);
} catch (e: any) {
  console.log("Error:", e.stack);
}
