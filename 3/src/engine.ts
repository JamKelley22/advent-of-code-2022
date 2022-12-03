import { IConfig } from "./config";

export type Sack = {
  // duplicateItems: Item[];
  // sackContainerItems: Set<Item>[];
  allItemsSet: Set<string>[];
};

export const parseLine = (
  line: string,
  config: IConfig,
  separator?: string
): Sack => {
  const container1End = line.length / 2;
  const containers = [
    line.slice(0, container1End),
    line.slice(container1End, line.length),
  ];

  const allItemsSet = [
    new Set<string>(containers[0]),
    new Set<string>(containers[1]),
  ];
  // const allItems = Array.from(allItemsSet);

  return {
    allItemsSet: allItemsSet,
  };

  // const allSackItems = new Set<Item>();
  // const sackContainerItems = [new Set<Item>(), new Set<Item>()];
  // const duplicateItems = [];

  // for (
  //   let containerIndex = 0;
  //   containerIndex < containers.length;
  //   containerIndex++
  // ) {
  //   const container = containers[containerIndex];
  //   for (let itemIndex = 0; itemIndex < container.length; itemIndex++) {
  //     const itemCharacter = container.charAt(itemIndex);
  //     const item = getItemFromCharacter(itemCharacter);
  //     if (allSackItems.has(item)) {
  //       duplicateItems.push(item);
  //     }
  //     allSackItems.add(item);
  //     sackContainerItems[containerIndex].add(item);
  //   }
  // }

  // return {
  //   duplicateItems: duplicateItems,
  //   sackContainerItems: sackContainerItems,
  //   allItems: allSackItems,
  // };
};

export const parseLinePartTwo = (
  line: string,
  config: IConfig,
  separator?: string
): Set<string> => {
  return new Set<string>(line);
};

const getItemPriority = (itemCharacter: string) => {
  const subtract = itemCharacter == itemCharacter.toUpperCase() ? 38 : 96;
  return itemCharacter.charCodeAt(0) - subtract;
};

export const calculateLine = (sack: Sack, config: IConfig): number => {
  const containerOne = sack.allItemsSet[0];
  const containerTwo = sack.allItemsSet[1];

  const containerTwoItems = Array.from(containerTwo);

  for (
    let containerTwoItemIndex = 0;
    containerTwoItemIndex < containerTwoItems.length;
    containerTwoItemIndex++
  ) {
    const containerTwoItem = containerTwoItems[containerTwoItemIndex];
    if (containerOne.has(containerTwoItem)) {
      return getItemPriority(containerTwoItem);
    }
  }
  return -1;
};

export const calculateLinesPartTwo = (
  group: Array<Set<string>>,
  config: IConfig
): number => {
  // return group.reduce((acc, group) => {
  // const superSetSack = new Set<string>([...group[0], ...group[1]]);
  const sack3 = Array.from(group[2]);
  for (
    let sackThreeIndex = 0;
    sackThreeIndex < sack3.length;
    sackThreeIndex++
  ) {
    const sack3Item = sack3[sackThreeIndex];
    if (group[0].has(sack3Item) && group[1].has(sack3Item)) {
      return getItemPriority(sack3Item);
    }
  }
  return 0;
  // }, 0);
};

export function chunkArray<T>(inputArr: T[], chunkSize: number): T[][] {
  return inputArr.reduce((resultArray: T[][], item, index) => {
    const chunkIndex = Math.floor(index / chunkSize);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []; // start a new chunk
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);
}
