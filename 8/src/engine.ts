export const calculateNumVisibleTrees = (forest: number[][]): number => {
  if (forest.length === 0) return 0;
  if (forest.length === 1) return 1;
  if (forest.length === 2) return 2;

  let numVisibleTrees = 0;
  numVisibleTrees += forest.length * 2;
  numVisibleTrees += (forest[0].length - 2) * 2;

  for (let rowIndex = 1; rowIndex < forest.length - 1; rowIndex++) {
    const row = forest[rowIndex];
    for (let colIndex = 1; colIndex < row.length - 1; colIndex++) {
      //   if (rowIndex === 3 && colIndex === 1) {
      //     console.log(row);
      //     console.log(getColumn(forest, colIndex));
      //   }

      const treeRowVis = isTreeVisibleInArr(
        row,
        colIndex
        // rowIndex === 3 && colIndex === 1
      );

      // console.log(
      //   rowIndex,
      //   colIndex,
      //   row[colIndex],
      //   treeColVis ? "col" : "row"
      // );

      if (treeRowVis) {
        numVisibleTrees++;
        continue;
      }
      const treeColVis = isTreeVisibleInArr(
        getColumn(forest, colIndex),
        rowIndex
        // rowIndex === 3 && colIndex === 1
      );
      if (treeColVis) {
        numVisibleTrees++;
        continue;
      }
    }
  }

  return numVisibleTrees;
};

export const calculateScenicScores = (forest: number[][]): number[][] => {
  return forest.map((row, rowIndex) => {
    return row.map((treeHeight, colIndex) => {
      const hScenicScore = calculateScenicScore(row, colIndex);
      const vScenicScore = calculateScenicScore(
        getColumn(forest, colIndex),
        rowIndex
      );
      return hScenicScore * vScenicScore;
    });
  });
};

export const calculateScenicScore = (row: number[], i: number): number => {
  if (i === 0 || i === row.length - 1) return 0;

  const left = row.slice(0, i).reverse();
  const right = row.slice(i + 1, row.length);
  let leftScore = 0,
    rightScore = 0;

  for (let leftIndex = 0; leftIndex < left.length; leftIndex++) {
    const treeHeight = left[leftIndex];
    leftScore++;
    if (treeHeight >= row[i]) {
      break;
    }
  }

  for (let rightIndex = 0; rightIndex < right.length; rightIndex++) {
    const treeHeight = right[rightIndex];
    rightScore++;
    if (treeHeight >= row[i]) {
      break;
    }
  }

  return leftScore * rightScore;
};

export const isTreeVisibleInArr = (
  row: number[],
  i: number,
  log: boolean = false
): boolean => {
  if (i === 0 || i === row.length - 1) return true;
  if (log) console.log(i);

  const maxHeightTreeLeft = Math.max(...row.slice(0, i));
  if (log) console.log("left", maxHeightTreeLeft);

  if (row[i] > maxHeightTreeLeft) return true;
  const maxHeightTreeRight = Math.max(...row.slice(i + 1, row.length));
  if (log) console.log("right", maxHeightTreeRight);

  if (row[i] > maxHeightTreeRight) return true;
  return false;
};

export const parseForest = (forest: string): number[][] => {
  const rows = forest.split("\n").filter((line) => line.length > 0);
  return rows.map((row) => row.split("").map((n) => parseInt(n)));
};

export const getColumn = (forest: number[][], colIndex: number): number[] => {
  return forest.map((value) => value[colIndex]);
};
