export function chunkArray<T>(inputArr: T[], chunkSize: number): T[][] {
  return inputArr.reduce((resultArray: T[][], item, index) => {
    const chunkIndex = Math.floor(index / chunkSize);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);
}

// export function readAllLines(
//   path: string,
//   fs: {
//     readFileSync: (
//       path: string,
//       options?: { encoding?: string; flag?: string }
//     ) => string;
//   }
// ): string[] {
//     const data: string = fs.readFileSync("input.txt", "utf8").toString();
// }

// import { open } from 'node:fs/promises';

// const file = await open('./some/file/to/read');

// for await (const line of file.readLines()) {
//   console.log(line);
// }
