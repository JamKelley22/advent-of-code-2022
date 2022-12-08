import { defaultConfig } from "./config";
import { Node, Tree } from "./tree";
import util from "util";

export type Command<T> = {
  type: T;
  dir?: string;
  responses?: SystemResponse[];
};

export type SystemResponse = File | Directory;

export type File = {
  type: "FILE";
  fileName: string;
  size: number;
};

export type Directory = {
  type: "DIR";
  dirName: string;
};

export const parseCommands = (
  commandStrArr: {
    cmdStr: string;
    responses?: string[];
  }[]
): Command<"CD" | "LS">[] => {
  return commandStrArr.map((cmdStrObj) =>
    parseCommand(cmdStrObj.cmdStr, cmdStrObj.responses)
  );
};

export const parseCommand = (
  cmdStr: string,
  responses?: string[]
): Command<"CD" | "LS"> => {
  const splitCmdStr = cmdStr.split(defaultConfig.cmdSep);
  if (splitCmdStr.length < 2) {
    throw new Error(`Command to short to parse. cmd: ${cmdStr}`);
  }
  const startChar = splitCmdStr[0];
  if (startChar !== defaultConfig.cmdStartChar) {
    throw new Error(`Commands must start with "$". cmd: ${cmdStr}`);
  }

  const commandType = splitCmdStr[1];

  if (!defaultConfig.commands.includes(commandType)) {
    throw new Error(`Invalid command type. Command Type: ${commandType}`);
  }

  switch (splitCmdStr[1]) {
    case "ls":
      if (!responses) {
        throw new Error(
          `LS Command type must include responses. Cmd: ${cmdStr}`
        );
      }

      const parsedResponses = parseResponses(responses);
      return {
        type: "LS",
        responses: parsedResponses,
      };
    case "cd":
      if (splitCmdStr.length !== 3) {
        throw new Error(`Command to short to parse (CD type). cmd: ${cmdStr}`);
      }
      const changeDir = splitCmdStr[2];
      return {
        type: "CD",
        dir: changeDir,
      };
    default:
      throw new Error(`Invalid command type. Command Type: ${commandType}`);
  }
};

export const parseResponses = (responseStrArr: string[]): SystemResponse[] => {
  return responseStrArr.map((responseStr) => parseResponse(responseStr));
};

export const parseResponse = (responseStr: string): SystemResponse => {
  const responseStrSplit = responseStr.split(" ");
  if (responseStrSplit.length !== 2) {
    throw new Error(
      `Response incorrect length for parsing (2, sep ' '). response: ${responseStr}`
    );
  }
  if (responseStrSplit[0] === "dir") {
    return {
      type: "DIR",
      dirName: responseStrSplit[1],
    };
  } else {
    const fileSize = parseInt(responseStrSplit[0]);
    if (!fileSize) {
      throw new Error(`Error parsing file size on response: ${responseStr}`);
    }
    return {
      type: "FILE",
      fileName: responseStrSplit[1],
      size: fileSize,
    };
  }
};

// export function createNode(
//   command: Command<"CD" | "LS">
// ): Node<SystemResponse> {
//   return {
//     data: {
//       type: "DIR",
//       dirName: "/",
//     },
//   };
// }

export const createSystemTree = (
  commands: Command<"CD" | "LS">[]
): Tree<SystemResponse> => {
  const rootNode = new Node<SystemResponse>({
    data: {
      type: "DIR",
      dirName: "/",
    },
  });
  const systemTree = new Tree<SystemResponse>(rootNode);
  let cwdNode = rootNode;
  for (let cmdIndex = 1; cmdIndex < commands.length; cmdIndex++) {
    const command = commands[cmdIndex];
    switch (command.type) {
      case "CD":
        if (command.dir === "..") {
          //   console.log(`PWD: ${(cwdNode.data as Directory).dirName} CD: ..`);

          if (!cwdNode.parent) {
            throw new Error(
              `Tried to move up directory but no parent for node. Node: ${cwdNode}`
            );
          }
          cwdNode = cwdNode.parent;
          continue;
        }
        // console.log(
        //   `PWD: ${(cwdNode.data as Directory).dirName} CD: ${command.dir}`
        // );
        let node;
        //Check if dir already exists
        const matchingDir = cwdNode.children
          .filter((node) => node.data?.type === "DIR")
          .find((node) => (node.data as Directory).dirName === command.dir!);

        // Create a node and link to current node dir

        if (!matchingDir) {
          node = new Node<SystemResponse>({
            data: {
              type: "DIR",
              dirName: command.dir!,
            },
            parent: cwdNode,
          });
          cwdNode.children.push(node);
        } else {
          node = matchingDir;
        }

        cwdNode = node;
        break;
      case "LS":
        command.responses?.forEach((response) => {
          let node;
          if (response.type === "DIR") {
            // console.log(
            //   `PWD: ${(cwdNode.data as Directory).dirName} LS DIR: ${
            //     response.dirName
            //   }`
            // );

            // Search cwd to see if already exists
            const matchingDir = cwdNode.children
              .filter((node) => node.data?.type === "DIR")
              .find(
                (node) => (node.data as Directory).dirName === response.dirName
              );
            // console.log(response.dirName, matchingDir);
            // console.log(
            //   cwdNode.children.filter((node) => node.data?.type === "DIR")
            // );

            node =
              matchingDir ??
              new Node<SystemResponse>({
                data: {
                  type: response.type,
                  dirName: response.dirName,
                },
                parent: cwdNode,
              });
          } else {
            // console.log(
            //   `PWD: ${(cwdNode.data as Directory).dirName} LS File: ${
            //     response.fileName
            //   }`
            // );
            node = new Node<SystemResponse>({
              data: {
                type: response.type,
                fileName: response.fileName,
                size: response.size,
              },
              parent: cwdNode,
            });
          }
          cwdNode.children.push(node);
        });
        break;
    }
    // console.log(
    //   util.inspect(systemTree, false, null, true /* enable colors */)
    // );
  }
  return systemTree;
};

export const createCommandStringArr = (
  input: string
): {
  cmdStr: string;
  responses?: string[] | undefined;
}[] => {
  const commands = input
    .split("$")
    .filter((cmdRes) => cmdRes.length)
    .map((cmdRes) => {
      const cmdResArr = cmdRes.split("\n").filter((res) => res.length);
      if (cmdResArr[0].trim() === "ls") {
        return {
          cmdStr: "$ ls",
          responses: cmdResArr.slice(1),
        };
      } else if (cmdResArr[0].trim().includes("cd")) {
        return {
          cmdStr: `$${cmdResArr[0]}`,
        };
      }
      throw new Error("Issue when creating command string array");
    });

  return commands;
};

export const calculateDirSize = (node: Node<SystemResponse>): number => {
  if (node.data?.type === "FILE") {
    return node.data.size;
  }

  return node.children.reduce((acc, node) => acc + calculateDirSize(node), 0);
};

export const getAllNodeDirs = (
  node: Node<SystemResponse>
): Node<SystemResponse>[] => {
  if (node.data?.type === "FILE") return [];

  const dirs: Node<SystemResponse>[] = [];
  const childrenToVisit: Node<SystemResponse>[] = [];

  if (node.data?.type === "DIR") dirs.push(node as Node<SystemResponse>);
  const cwd = node;
  childrenToVisit.push(...cwd.children);
  dirs.push(...childrenToVisit.map((node) => getAllNodeDirs(node)).flat());
  return dirs;
};
