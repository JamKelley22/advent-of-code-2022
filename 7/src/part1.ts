import {
  parseCommands,
  createSystemTree,
  createCommandStringArr,
  getAllNodeDirs,
  calculateDirSize,
  Directory,
} from "./engine";

var fs = require("fs");

const inputs = [
  {
    fileName: "input.txt",
  },
  {
    fileName: "input-example.txt",
  },
];

try {
  const input = inputs[0];
  const data: string = fs.readFileSync(input.fileName, "utf8").toString();
  //   const lines = data.split(/\r?\n/);
  const commandStrArr = createCommandStringArr(data);
  const commands = parseCommands(commandStrArr);
  const systemTree = createSystemTree(commands);

  const directories = getAllNodeDirs(systemTree.root);

  const sizes = directories.map((dir) => {
    return {
      dir: dir,
      name: (dir.data as Directory).dirName,
      size: calculateDirSize(dir),
    };
  });

  const filteredSizes = sizes.filter((nodeSize) => nodeSize.size <= 100000);
  const totalSize = filteredSizes.reduce((acc, nodeSize) => {
    return nodeSize.size + acc;
  }, 0);

  console.log(filteredSizes);

  console.log(totalSize);
} catch (e: any) {
  console.log("Error:", e.stack);
}
