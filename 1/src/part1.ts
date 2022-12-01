var fs = require("fs");

try {
  const data: string = fs.readFileSync("input.txt", "utf8").toString();

  const elfSnacks = data.split(/\r?\n/);

  let maxElfCalSum = 0,
    currElfCalSum = 0;
  for (let index = 0; index < elfSnacks.length; index++) {
    const element = elfSnacks[index];
    if (element.length) {
      currElfCalSum += parseInt(element);
    } else {
      maxElfCalSum = Math.max(currElfCalSum, maxElfCalSum);
      currElfCalSum = 0;
    }
  }
  console.log(maxElfCalSum);
} catch (e: any) {
  console.log("Error:", e.stack);
}
