import { Bounds, Cave, Point, Space, SpaceTypes, Trace } from "./types";

export const parseTraces = (traceArrStr: string[]): Trace[] => {
  return traceArrStr.map((str) => parseTrace(str));
};

export const parseTrace = (str: string): Trace => {
  const points = str.split(" -> ");
  const path = points.map((point) => {
    const coords = point.split(",");
    return {
      x: parseInt(coords[0]),
      y: parseInt(coords[1]),
    };
  });
  return {
    path: path,
  };
};

export const getAllTraceBounds = (
  traces: Trace[],
  additionalPoint?: Point
): Bounds => {
  const bounds = traces.reduce(
    (bounds, trace) => {
      const traceXPoints = trace.path.map((point) => point.x);
      const traceYPoints = trace.path.map((point) => point.y);
      return {
        x: {
          min: Math.min(bounds.x.min, Math.min(...traceXPoints)),
          max: Math.max(bounds.x.max, Math.max(...traceXPoints)),
        },
        y: {
          min: Math.min(bounds.y.min, Math.min(...traceYPoints)),
          max: Math.max(bounds.y.max, Math.max(...traceYPoints)),
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

  const xMin = Math.min(
      bounds.x.min,
      additionalPoint?.x === undefined
        ? Number.MAX_SAFE_INTEGER
        : additionalPoint.x
    ),
    xMax = Math.max(
      bounds.x.max,
      additionalPoint?.x === undefined
        ? Number.MIN_SAFE_INTEGER
        : additionalPoint.x
    ),
    yMin = Math.min(
      bounds.y.min,
      additionalPoint?.y === undefined
        ? Number.MAX_SAFE_INTEGER
        : additionalPoint?.y
    ),
    yMax = Math.max(
      bounds.y.max,
      additionalPoint?.y === undefined
        ? Number.MIN_SAFE_INTEGER
        : additionalPoint.y
    );

  return {
    x: {
      min: xMin,
      max: xMax,
      size: xMax - xMin + 1,
    },
    y: {
      min: yMin,
      max: yMax,
      size: yMax - yMin + 1,
    },
  };
};

export const constructCave = (
  traces: Trace[],
  floor: boolean = false
): Cave => {
  const sandOrigin: Point = { x: 500, y: 0 };
  let bounds = getAllTraceBounds(traces, sandOrigin);

  const floorY = bounds.y.max + 2;
  if (floor) {
    bounds.x.min -= 200;
    bounds.x.max += 200;
    bounds.x.size += 400;
  }

  const map = Array.from({ length: bounds.y.size + (floor ? 2 : 0) }, (e) =>
    Array<Space>(bounds.x.size).fill(SpaceTypes.get("air")!)
  );
  const sandSourcePoint: Point = {
    x: sandOrigin.x - bounds.x.min,
    y: Math.max(sandOrigin.y - bounds.y.min, 0),
  };
  map[sandSourcePoint.y][sandSourcePoint.x] = SpaceTypes.get("sandSource")!;

  if (floor) {
    // Fill in the floor for *visuals* from min x to max x
    for (let xIndex = 0; xIndex < bounds.x.size; xIndex++) {
      map[floorY][xIndex] = SpaceTypes.get("floor")!;
    }
  }
  //   console.log(caveToString({ map: map, sandSourcePoint: sandSourcePoint }));

  traces.forEach((trace) => {
    // Map over paths
    for (let index = 0; index < trace.path.length - 1; index++) {
      const path = trace.path[index];
      const nextPath = trace.path[index + 1];
      if (path.x === nextPath.x) {
        // Y changes
        for (
          let yIndex = Math.min(path.y, nextPath.y);
          yIndex <= Math.max(path.y, nextPath.y);
          yIndex++
        ) {
          const y = yIndex,
            x = Math.max(path.x - bounds.x.min, 0);
          map[y][x] = SpaceTypes.get("rock")!;
        }
      } else if (path.y === nextPath.y) {
        // X changes
        for (
          let xIndex = Math.min(path.x, nextPath.x);
          xIndex <= Math.max(path.x, nextPath.x);
          xIndex++
        ) {
          const y = path.y,
            x = Math.max(xIndex - bounds.x.min, 0);
          map[y][x] = SpaceTypes.get("rock")!;
        }
      }
    }
  });

  return {
    map: map,
    sandSourcePoint: sandSourcePoint,
    floorHeight: floorY,
  };
};

export const caveToString = (cave: Cave): string => {
  let str = "";
  for (let i = 0; i < cave.map.length; i++) {
    const caveRow = cave.map[i];
    for (let j = 0; j < caveRow.length; j++) {
      const space = caveRow[j];

      str += space ? space.ascii : "*";
    }
    str += "\n";
  }
  return str;
};

export const simulateSandDrop = (
  cave: Cave
): { cave: Cave; intoAbyss: boolean; blockSource: boolean } => {
  let currentPoint: Point = {
    ...cave.sandSourcePoint,
    y: cave.sandSourcePoint.y,
  };

  // Loop until return
  for (let rowIndex = 0; rowIndex < 10000; rowIndex++) {
    // Look one row down
    const downPoint: Point = {
      x: currentPoint.x,
      y: currentPoint.y + 1,
    };
    if (downPoint.y >= cave.map.length) {
      // Reached the abyss, return cave
      return { cave: cave, intoAbyss: true, blockSource: false };
    }
    const downSpace = cave.map[downPoint.y][downPoint.x];
    const downLeftSpace = cave.map[downPoint.y][downPoint.x - 1];
    const downRightSpace = cave.map[downPoint.y][downPoint.x + 1];

    let canMoveDown = !isSolid(downSpace),
      canMoveDownLeft = !isSolid(downLeftSpace),
      canMoveDownRight = !isSolid(downRightSpace);

    if (cave.floorHeight && downPoint.y >= cave.floorHeight) {
      canMoveDown = false;
      canMoveDownLeft = false;
      canMoveDownRight = false;
    }

    if (canMoveDown) {
      if (!downSpace)
        return { cave: cave, intoAbyss: true, blockSource: false };
      // clear current spot
      if (cave.map[currentPoint.y][currentPoint.x].type !== "sandSource")
        cave.map[currentPoint.y][currentPoint.x] = SpaceTypes.get("air")!;
      // advance down
      currentPoint.y++;
      // place sand at new spot
      cave.map[currentPoint.y][currentPoint.x] = SpaceTypes.get("sand")!;
    } else if (canMoveDownLeft) {
      if (!downLeftSpace)
        return { cave: cave, intoAbyss: true, blockSource: false };
      // clear current spot
      if (cave.map[currentPoint.y][currentPoint.x].type !== "sandSource")
        cave.map[currentPoint.y][currentPoint.x] = SpaceTypes.get("air")!;
      // advanceDownLeft
      currentPoint.y++;
      currentPoint.x--;
      // place sand at new spot
      cave.map[currentPoint.y][currentPoint.x] = SpaceTypes.get("sand")!;
    } else if (canMoveDownRight) {
      if (!downRightSpace)
        return { cave: cave, intoAbyss: true, blockSource: false };
      // clear current spot
      if (cave.map[currentPoint.y][currentPoint.x].type !== "sandSource")
        cave.map[currentPoint.y][currentPoint.x] = SpaceTypes.get("air")!;
      // advanceDownRight
      currentPoint.y++;
      currentPoint.x++;
      // place sand at new spot
      cave.map[currentPoint.y][currentPoint.x] = SpaceTypes.get("sand")!;
    } else {
      if (currentPoint.y === cave.sandSourcePoint.y) {
        return { cave: cave, intoAbyss: false, blockSource: true };
      }
      // Can't move, return cave
      return { cave: cave, intoAbyss: false, blockSource: false };
    }
  }
  return { cave: cave, intoAbyss: true, blockSource: false };
};

export const isSolid = (space: Space): boolean => {
  if (!space) return false;
  return (
    space.type === "rock" || space.type === "sand" || space.type === "floor"
  );
};
