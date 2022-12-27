import {
  calcUniqueIntervalSpaces,
  caveToString,
  constructCave,
  getCaveBounds,
  getIntervalsAlongY,
  parseReports,
  stringToPoint,
  trimIntervals,
  useSensor,
} from "./engine";
import util from "util";

var fs = require("fs");

var inputs = [
  {
    fileName: "input.txt",
    y: 2000000,
  },
  {
    fileName: "input-example.txt",
    y: 10,
  },
];

try {
  const input = inputs[0]; // Main
  // const input = inputs[1]; // Example
  const data: string = fs.readFileSync(input.fileName, "utf8").toString();
  const lines = data.split(/\r?\n/).filter((line) => line.length);
  const reports = parseReports(lines);

  const intervals = getIntervalsAlongY(input.y, reports);
  const trimmedInts = trimIntervals(intervals);
  console.log(trimmedInts);

  const res = calcUniqueIntervalSpaces(intervals);

  console.log(res);

  // for (let index = -2; index < 22; index++) {
  //   const intervals = getIntervalsAlongY(index, reports);
  //   const trimmedInts = trimIntervals(intervals);
  //   // console.log(trimmedInts);

  //   const res = calcUniqueIntervalSpaces(intervals);
  //   console.log(index, res);
  // }

  // //=====================================================

  let cave = constructCave(reports);

  // console.log("============= Cave Constructed =============");

  // //   console.log(getCaveBounds(cave.map));
  // //   console.log(caveToString(cave));

  // reports.forEach((report) => {
  //   cave = useSensor(cave, report.sensorPoint);
  // });

  // console.log("============= Updated All Sensors =============");

  // console.log(caveToString(cave));

  const nobeaconPoints = [...cave.map].filter((pair) => {
    const point = stringToPoint(pair[0]);
    return point.y === input.y && pair[1].type === "beacon";
  });

  console.log(nobeaconPoints.length);
} catch (e: any) {
  console.log("Error:", e.stack);
}
