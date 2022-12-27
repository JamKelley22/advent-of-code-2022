import {
  Bounds,
  Cave,
  Interval,
  Point,
  Report,
  Space,
  SpaceTypes,
} from "./types";

export const parseReports = (reportLines: string[]): Report[] => {
  return reportLines.map((reportLine) => parseReport(reportLine));
};

export const parseReport = (reportLine: string): Report => {
  // ex. Sensor at x=2, y=18: closest beacon is at x=-2, y=15
  const nums = reportLine.match(/-?\d+/g)?.map((numStr) => parseInt(numStr));
  if (nums?.length !== 4) {
    throw new Error(
      `Error parsing line, could not find 4 numbers in line: ${reportLine}`
    );
  }
  return {
    sensorPoint: { x: nums[0], y: nums[1] },
    beaconPoint: { x: nums[2], y: nums[3] },
  };
};

export const constructCave = (reports: Report[]): Cave => {
  const caveMap = new Map<string, Space>();

  // Place sensors and beacons
  reports.forEach((report) => {
    caveMap.set(pointToString(report.beaconPoint), {
      ...SpaceTypes.get("beacon")!,
      report: report,
    });
    caveMap.set(pointToString(report.sensorPoint), {
      ...SpaceTypes.get("sensor")!,
      report: report,
    });
  });

  return {
    map: caveMap,
  };
};

export const useSensor = (cave: Cave, point: Point): Cave => {
  const space = cave.map.get(pointToString(point));
  if (space?.type !== "sensor") {
    throw new Error(`Point in cave is not a sensor`);
  }
  const beaconPoint = space.report?.beaconPoint;
  const sensorPoint = space.report?.sensorPoint;
  if (!beaconPoint || !sensorPoint) {
    throw new Error(
      `Sensor point or Beacon point not set for point. Point: ${pointToString(
        point
      )}`
    );
  }

  const dist = manhattanDistance(beaconPoint, sensorPoint);

  let d = dist;
  let yUp = sensorPoint.y;
  const nobeaconSpace = SpaceTypes.get("nobeacon")!;
  // console.log("d", d);

  for (let yDown = sensorPoint.y; d >= 0; yDown++) {
    // if (yDown > 2240825) console.log(yDown);

    // Start at point and mark nobeacon at places from -  Manhattan Distance to + Manhattan Distance
    for (let x = sensorPoint.x - d; x < sensorPoint.x + d + 1; x++) {
      const currSpaceDownKey = pointToString({ x: x, y: yDown });
      const currSpaceDown = cave.map.get(currSpaceDownKey);
      if (!currSpaceDown || currSpaceDown?.type === "unknown") {
        // Set unknowns
        // console.log("currSpaceDownKey", currSpaceDownKey);

        cave.map.set(currSpaceDownKey, nobeaconSpace);
      }

      const currSpaceUpKey = pointToString({ x: x, y: yUp });
      //   if (!currSpaceUpKey) {
      //     console.log("============ Ughhhh ============");
      //   }
      const currSpaceUp = cave.map.get(currSpaceUpKey);

      if (!currSpaceUp || currSpaceUp?.type === "unknown") {
        // Set unknowns
        // console.log("currSpaceUpKey", currSpaceUpKey);

        cave.map.set(currSpaceUpKey, nobeaconSpace);
      }
    }
    d--;
    yUp--;
  }
  return cave;
};

export const getIntervalsAlongY = (
  y: number,
  reports: Report[]
): Interval[] => {
  return reports.reduce((acc, report) => {
    const yDiff = Math.abs(report.sensorPoint.y - y);
    const manhattanDist = manhattanDistance(
      report.beaconPoint,
      report.sensorPoint
    );
    if (yDiff >= manhattanDist) return acc;
    const leftIntervalNum = report.sensorPoint.x - (manhattanDist - yDiff);
    const rightIntervalNum = report.sensorPoint.x + (manhattanDist - yDiff);
    acc.push([leftIntervalNum, rightIntervalNum]);
    return acc;
  }, Array<Interval>());
};

export const trimIntervals = (intervals: Interval[]): Interval[] => {
  return intervals
    .sort((a, b) => a[0] - b[0])
    .map((interval, index) => {
      let min = interval[1];
      for (let i = index; i < intervals.length; i++) {
        const secondInt = intervals[i];
        if (interval[0] === secondInt[0] && interval[1] === secondInt[1]) {
          continue;
        }
        min = Math.min(min, secondInt[0]);
      }
      return [interval[0], min];
    });
};

export const calcUniqueIntervalSpaces = (intervals: Interval[]): number => {
  const trimmedIntervals = trimIntervals(intervals);

  return trimmedIntervals.reduce((total, interval) => {
    total += interval[1] - interval[0];

    return total;
  }, 0);
};

export const manhattanDistance = (p1: Point, p2: Point): number => {
  const px = Math.abs(p1.x - p2.x);
  const py = Math.abs(p1.y - p2.y);
  return px + py;
};

export const caveToString = (cave: Cave): string => {
  let str = "";
  const bounds = getCaveBounds(cave.map);
  for (let numRow = 0; numRow < 2; numRow++) {
    str += "\t";
    for (
      let xIndex = bounds.x.min;
      xIndex < bounds.x.min + bounds.x.size;
      xIndex++
    ) {
      let c = xIndex.toString().charAt(numRow);
      if (c === "0" && numRow !== 1) {
        c = " ";
      }
      str += c || " ";
    }
    str += "\n";
  }

  for (let y = bounds.y.min; y < bounds.y.min + bounds.y.size; y++) {
    str += `${y}\t`;
    for (let x = bounds.x.min; x < bounds.x.min + bounds.x.size; x++) {
      const space = cave.map.get(pointToString({ x: x, y: y }));
      str += space?.ascii || SpaceTypes.get("unknown")?.ascii;
    }
    str += "\n";
  }
  return str;
};

export const getCaveBounds = (caveMap: Map<string, Space>): Bounds => {
  const bounds = [...caveMap].reduce(
    (bounds, pointToSpace) => {
      const point = stringToPoint(pointToSpace[0]);
      return {
        x: {
          min: Math.min(bounds.x.min, point.x),
          max: Math.max(bounds.x.max, point.x),
        },
        y: {
          min: Math.min(bounds.y.min, point.y),
          max: Math.max(bounds.y.max, point.y),
        },
      };
    },
    {
      x: {
        min: Number.MAX_SAFE_INTEGER,
        max: Number.MIN_SAFE_INTEGER,
      },
      y: {
        min: Number.MAX_SAFE_INTEGER,
        max: Number.MIN_SAFE_INTEGER,
      },
    }
  );
  return {
    ...bounds,
    x: { ...bounds.x, size: bounds.x.max - bounds.x.min /* + 1, */ },
    y: { ...bounds.y, size: bounds.y.max - bounds.y.min /* + 1, */ },
  };
};

export const pointToString = (point: Point): string => {
  return `[${point.x},${point.y}]`;
};

export const stringToPoint = (pointStr: string): Point => {
  const strArr = pointStr.substring(1, pointStr.length - 1); // Trim off square brackets
  const xy = strArr.split(",");
  return {
    x: parseInt(xy[0]),
    y: parseInt(xy[1]),
  };
};
