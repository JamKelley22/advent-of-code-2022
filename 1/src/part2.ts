var fs = require("fs");

try {
  const data: string = fs.readFileSync("input.txt", "utf8").toString();

  const elfSnacks = data.split(/\r?\n/);

  let maxElfCalSumArr: number[] = [],
    currElfCalSum = 0;
  for (let index = 0; index < elfSnacks.length; index++) {
    const element = elfSnacks[index];
    if (element.length) {
      currElfCalSum += parseInt(element);
    } else {
      maxElfCalSumArr.push(currElfCalSum);
      if (maxElfCalSumArr.length > 3)
        maxElfCalSumArr = removeSmallest(maxElfCalSumArr);
      currElfCalSum = 0;
    }
  }
  console.log(
    maxElfCalSumArr,
    maxElfCalSumArr.reduce(
      (previousValue, currentValue) => previousValue + currentValue,
      0
    )
  );
} catch (e: any) {
  console.log("Error:", e.stack);
}

function removeSmallest(arr: number[]): number[] {
  var min = Math.min.apply(null, arr);
  return arr.filter((e) => {
    return e != min;
  });
}
