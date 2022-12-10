import { RopeMap, Location, Motion, Space, Direction, Move } from "./types";

export const moveHeadAndTail = (
  ropeMap: RopeMap,
  headMotions: Motion[]
): RopeMap => {
  //   const tailVisitedMap = new Map<string, boolean>();
  //   const ropeMapMap = new Map<string, Space[]>();

  console.log("== Initial State ==");
  console.log();

  console.log(printMap(ropeMap.map));
  console.log();

  const endRopeMap = headMotions.reduce(
    (ropeMap, motion) => {
      const newRopeMap = applyMotion(ropeMap, motion);
      console.log(`== ${motion.dir} ${motion.numSteps} ==`);
      console.log();

      console.log(printMap(newRopeMap.map));
      return newRopeMap;
    },
    {
      tailVisitedMap: ropeMap.tailVisitedMap,
      map: ropeMap.map,
    }
  );

  return {
    tailVisitedMap: endRopeMap.tailVisitedMap,
    map: endRopeMap.map,
  };
};

export const applyMotion = (ropeMap: RopeMap, headMotion: Motion): RopeMap => {
  // Array.from(Array(10)).map(a => dirToMove(headMotion.dir));

  // Find the head and tail
  //   const startHeadLocation = getLocation("Head", ropeMap.map);
  //   const startTailLocation = getLocation("Tail", ropeMap.map);

  //   console.log(ropeMap.map);

  const headMoveDir = dirToMove(headMotion.dir);

  const finalRopeMap = Array.from(Array(headMotion.numSteps)).reduce(
    (updatedRopeMap: RopeMap, _, stepNum) => {
      // ===Head===
      const currHeadLocation = getLocation("Head", updatedRopeMap.map);

      // Remove head from old space
      updatedRopeMap.map = removeSpace(updatedRopeMap.map, {
        location: currHeadLocation,
        space: "Head",
      });
      // Move Head
      const newHeadLocation = addMoveToLocation(currHeadLocation, headMoveDir);
      // Add head to new space
      updatedRopeMap.map = addSpace(updatedRopeMap.map, {
        location: newHeadLocation,
        space: "Head",
      });

      //   console.log(`H: \n${printMap(updatedRopeMap.map)}`);

      // ===1===
      const spaceLocation1 = getLocation("1", updatedRopeMap.map);
      const isTouchingPrev1 = isTouching(spaceLocation1, newHeadLocation);
      let newSpaceLocation1 = spaceLocation1;
      if (isTouchingPrev1) {
        // Can actually stop, no following knots will change
      } else {
        const move = getMoveFromLocations(spaceLocation1, newHeadLocation);
        newSpaceLocation1 = addMoveToLocation(spaceLocation1, move);
        updatedRopeMap.map = removeSpace(updatedRopeMap.map, {
          location: spaceLocation1,
          space: "1",
        });
        updatedRopeMap.map = addSpace(updatedRopeMap.map, {
          location: newSpaceLocation1,
          space: "1",
        });
      }

      //   console.log(`1: \n${printMap(updatedRopeMap.map)}`);

      let prevUpdatedKnotLocation: Location = newSpaceLocation1;

      for (let knotNum = 2; knotNum < 10; knotNum++) {
        const spaceKnotNum = knotNum.toString() as Space;
        const spaceLocation = getLocation(spaceKnotNum, updatedRopeMap.map);
        const isTouchingPrev = isTouching(spaceLocation, spaceLocation1);
        let newSpaceLocation = spaceLocation;
        const move = getMoveFromLocations(
          spaceLocation,
          prevUpdatedKnotLocation
        );
        newSpaceLocation = addMoveToLocation(spaceLocation, move);
        updatedRopeMap.map = removeSpace(updatedRopeMap.map, {
          location: spaceLocation,
          space: spaceKnotNum,
        });
        updatedRopeMap.map = addSpace(updatedRopeMap.map, {
          location: newSpaceLocation,
          space: spaceKnotNum,
        });

        prevUpdatedKnotLocation = newSpaceLocation;

        if (knotNum === 9)
          updatedRopeMap.tailVisitedMap.set(
            keyFromLocation(newSpaceLocation),
            true
          );
        // console.log(`${knotNum}: \n${printMap(updatedRopeMap.map)}`);
      }
      //   console.log("==========================");
      //   console.log(printMap(updatedRopeMap.map));

      return updatedRopeMap;
    },
    ropeMap
  );

  return finalRopeMap;
};

export const isTouching = (loc1: Location, loc2: Location): boolean => {
  if (
    Math.abs(loc1.col - loc2.col) <= 1 &&
    Math.abs(loc1.row - loc2.row) <= 1
  ) {
    return true;
  }
  return false;
};

export const getMoveFromLocations = (
  currentLocation: Location,
  moveToLocation: Location
): Move => {
  if (moveToLocation.row - currentLocation.row === 2) {
    return {
      rowChange: subtractToZero(moveToLocation.row - currentLocation.row),
      colChange: moveToLocation.col - currentLocation.col,
    };
  }
  if (moveToLocation.col - currentLocation.col === 2) {
    return {
      rowChange: moveToLocation.row - currentLocation.row,
      colChange: subtractToZero(moveToLocation.col - currentLocation.col),
    };
  }

  return {
    rowChange: subtractToZero(moveToLocation.row - currentLocation.row),
    colChange: subtractToZero(moveToLocation.col - currentLocation.col),
  };
};

export const removeSpace = (
  map: Map<string, Space[]>,
  item: {
    location: Location;
    space: Space;
  }
): Map<string, Space[]> => {
  //   const _map = structuredClone(map);
  const key = keyFromLocation(item.location);
  const updatedArr =
    map.get(key)?.filter((space) => space !== item.space) || [];
  map.set(key, updatedArr);
  return map;
};

export const addSpace = (
  map: Map<string, Space[]>,
  item: {
    location: Location;
    space: Space;
  }
): Map<string, Space[]> => {
  //   const _map = structuredClone(map);
  const key = keyFromLocation(item.location);
  const updatedArr = map.get(key);
  updatedArr?.push(item.space);
  map.set(key, updatedArr || [item.space]);
  return map;
};

// export const applyMotionToSpace = (
//   map: Map<string, Space[]>,
//   motion
// ): Map<string, Space[]> => {};

// export const applyMotion = (ropeMap: RopeMap, headMotion: Motion): RopeMap => {
//   // Array.from(Array(10)).map(a => dirToMove(headMotion.dir));

//   // Find the head and tail
//   //   const startHeadLocation = getLocation("Head", ropeMap.map);
//   //   const startTailLocation = getLocation("Tail", ropeMap.map);

//   //   console.log(ropeMap.map);

//   const headMoveDir = dirToMove(headMotion.dir);

//   const finalRopeMap = Array.from(Array(headMotion.numSteps)).reduce(
//     (updatedRopeMap: RopeMap, _, stepNum) => {
//       //   const newRopeMap = structuredClone(updatedRopeMap);
//       const currHeadLocation = getLocation("Head", updatedRopeMap.map);
//       // const currTailLocation = getLocation("Tail", updatedRopeMap.map);

//       if (!currHeadLocation) {
//         throw new Error(`Could not find Head/tail in map`);
//       }

//       //   if (!newRopeMap.map) throw new Error(`No new rope map???`);

//       // =Move the head=
//       // Mark old location
//       //   console.log(`key: ${keyFromLocation(currHeadLocation)}`);
//       const currHeadLocationKey = keyFromLocation(currHeadLocation);
//       //   if (updatedRopeMap.map.get(currHeadLocationKey) === "Both") {
//       //     updatedRopeMap.map.set(currHeadLocationKey, "Tail");
//       //   } else {
//       //     updatedRopeMap.map.set(currHeadLocationKey, "Empty");
//       //   }
//       const oldArr = [...updatedRopeMap.map.get(currHeadLocationKey)!]
//       const a = .filter(a => a)
//       updatedRopeMap.map.set(currHeadLocationKey, headRemoved);

//       const newHeadLocation = addMoveToLocation(currHeadLocation, headMoveDir);
//       const newHeadLocationKey = keyFromLocation(newHeadLocation);
//       // Place in new location
//       if (updatedRopeMap.map.get(newHeadLocationKey) === "Tail") {
//         updatedRopeMap.map.set(newHeadLocationKey, "Both");
//       } else {
//         updatedRopeMap.map.set(newHeadLocationKey, "Head");
//       }

//       // =Determine if the tail needs to move and move=
//       const currTailLocationKey = keyFromLocation(currTailLocation);
//       if (updatedRopeMap.map.get(currTailLocationKey) === "Both") {
//         updatedRopeMap.map.set(currTailLocationKey, "Head");
//       } else {
//         updatedRopeMap.map.set(currTailLocationKey, "Empty");
//       }

//       //todo account for diff of 1 maybe subtract 1 and min(0-1,0)
//       const headTailColDiff = newHeadLocation.col - currTailLocation.col,
//         headTailRowDiff = newHeadLocation.row - currTailLocation.row;

//       // When diag tail just replaces head old spot
//       let newTailLocation;

//       //   console.log(headTailRowDiff, headTailColDiff);

//       if (Math.abs(headTailColDiff) === 2 || Math.abs(headTailRowDiff) === 2) {
//         newTailLocation = currHeadLocation;
//       } else {
//         newTailLocation = addMoveToLocation(currTailLocation, {
//           rowChange: subtractToZero(headTailRowDiff),
//           colChange: subtractToZero(headTailColDiff),
//         });
//       }
//       //   newTailLocation = addMoveToLocation(currTailLocation, {
//       //     rowChange: headTailRowDiff,
//       //     colChange: headTailColDiff,
//       //   });
//       // Place in new location
//       const newTailLocationKey = keyFromLocation(newTailLocation);
//       if (updatedRopeMap.map.get(newTailLocationKey) === "Head") {
//         updatedRopeMap.map.set(newTailLocationKey, "Both");
//       } else {
//         updatedRopeMap.map.set(newTailLocationKey, "Tail");
//       }
//       updatedRopeMap.tailVisitedMap.set(newTailLocationKey, true);

//       //   console.log(printMap(updatedRopeMap.tailVisitedMap));

//       return updatedRopeMap;
//     },
//     ropeMap
//   );

//   return finalRopeMap;
// };

export const subtractToZero = (num: number, cnt: number = 1): number => {
  if (num === 0) return 0;
  if (num > 0) return num - cnt;
  if (num < 0) return num + cnt;
  return num;
};

export const getLocation = (
  space: Extract<
    Space,
    "Head" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | undefined
  >,
  map?: Map<string, Space[]>
): Location => {
  if (!map) return { row: 0, col: 0 };
  if (map.size === 0) return { row: 0, col: 0 };

  const strKey = [...map].find((m) => m[1].includes(space))?.[0];

  if (!strKey) {
    throw new Error(`Error when finding location for Space: ${space}`);
  }
  return locationFromKey(strKey);
};

export const parseMotions = (lines: string[]): Motion[] => {
  return lines.map((line) => {
    const lSplit = line.split(" ");
    if (lSplit.length !== 2) {
      throw new Error(`Error parsing motion. Motion: ${line}`);
    }

    const direction = Direction.find((validName) => validName === lSplit[0]);
    if (!direction) {
      throw new Error(`Error parsing direction of Motion. Motion: ${line}`);
    }

    const numSteps = parseInt(lSplit[1]);

    if (!numSteps || numSteps < 1) {
      throw new Error(`Error parsing numSteps of Motion. Motion: ${line}`);
    }

    return {
      dir: direction,
      numSteps: numSteps,
    };
  });
};

export const addLocations = (a: Location, b: Location): Location => {
  return {
    row: a.row + b.row,
    col: a.col + b.col,
  };
};

export const addMoveToLocation = (loc: Location, move: Move): Location => {
  return {
    row: loc.row + move.rowChange,
    col: loc.col + move.colChange,
  };
};

export const dirToMove = (dir: Direction): Move => {
  switch (dir) {
    case "D":
      return {
        rowChange: -1,
        colChange: 0,
      };
    case "L":
      return {
        rowChange: 0,
        colChange: -1,
      };
    case "R":
      return {
        rowChange: 0,
        colChange: 1,
      };
    case "U":
      return {
        rowChange: 1,
        colChange: 0,
      };
    default:
      return {
        rowChange: -1,
        colChange: -1,
      };
  }
};

export const keyFromLocation = (loc: Location): string => {
  return `[${loc.row},${loc.col}]`;
};
export const locationFromKey = (str: string): Location => {
  const prepend = str.charAt(0) !== "[" ? "[" : "";
  const append = str.charAt(str.length - 1) !== "]" ? "]" : "";
  const locArr = JSON.parse(prepend + str + append);
  return { row: locArr[0], col: locArr[1] };
};

export const getMinMaxRowColOfMap = (
  map: Map<string, Space[] | boolean>
): {
  lowestRowNum: number;
  lowestColNum: number;
  highestRowNum: number;
  highestColNum: number;
} => {
  return [...map].reduce(
    (maxes, pair) => {
      maxes.lowestColNum = Math.min(
        maxes.lowestColNum,
        locationFromKey(pair[0]).col
      );
      maxes.lowestRowNum = Math.min(
        maxes.lowestRowNum,
        locationFromKey(pair[0]).row
      );
      maxes.highestColNum = Math.max(
        maxes.highestColNum,
        locationFromKey(pair[0]).col
      );
      maxes.highestRowNum = Math.max(
        maxes.highestRowNum,
        locationFromKey(pair[0]).row
      );

      return maxes;
    },
    {
      lowestRowNum: Number.MAX_SAFE_INTEGER,
      lowestColNum: Number.MAX_SAFE_INTEGER,
      highestRowNum: Number.MIN_SAFE_INTEGER,
      highestColNum: Number.MIN_SAFE_INTEGER,
    }
  );
};

export const normalizeMap = (
  map: Map<string, Space[]>
): Map<string, Space[]> => {
  const { lowestRowNum, lowestColNum, highestColNum, highestRowNum } =
    getMinMaxRowColOfMap(map);

  const rowShift = highestRowNum - lowestRowNum - 1,
    colShift = highestColNum - lowestColNum - 1;

  const newMap = new Map<string, Space[]>();

  //   console.log(rowShift, colShift);

  [...map].forEach((pair) => {
    const loc = locationFromKey(pair[0]);
    loc.col -= colShift;
    loc.row -= rowShift;
    // console.log(loc);

    newMap.set(keyFromLocation(loc), map.get(pair[0]) || []);
  });

  return newMap;
};

export const printMap = (map: Map<string, Space[] | boolean>): string => {
  const { lowestRowNum, lowestColNum, highestColNum, highestRowNum } =
    getMinMaxRowColOfMap(map);
  const numRows = highestRowNum - lowestRowNum + 1,
    numCols = highestColNum - lowestColNum + 1;

  let printMap = "";
  for (let rowIndex = numRows - 1; rowIndex >= 0; rowIndex--) {
    for (let colIndex = 0; colIndex < numCols; colIndex++) {
      const space = map.get(keyFromLocation({ row: rowIndex, col: colIndex }));
      let c;
      if (typeof space === "boolean") {
        c = space ? "#" : ".";
      } else {
        c =
          space
            ?.sort((a, b) => {
              if (a === "Head") return -1;
              if (b === "Head") return 1;
              if (a === undefined) return 1;
              if (b === undefined) return -1;

              return parseInt(a) - parseInt(b);
            })[0]
            ?.charAt(0) || ".";
      }
      printMap += space ? c : ".";
    }
    printMap += "\n";
  }

  return printMap;
};
