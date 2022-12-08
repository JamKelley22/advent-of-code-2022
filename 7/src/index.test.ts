import { describe, expect, test } from "@jest/globals";
import util from "util";
import {
  calculateDirSize,
  Command,
  createCommandStringArr,
  createSystemTree,
  Directory,
  File,
  getAllNodeDirs,
  parseCommands,
  SystemResponse,
} from "./engine";
import { Node, Tree } from "./tree";

const jFile = new Node<File>({
  data: { type: "FILE", fileName: "j", size: 4060174 },
});

const dDir = new Node<SystemResponse>({
  data: { type: "DIR", dirName: "d" },
  children: [
    jFile,
    new Node<File>({
      data: { type: "FILE", fileName: "d.log", size: 8033020 },
    }),
    new Node<File>({
      data: { type: "FILE", fileName: "d.ext", size: 5626152 },
    }),
    new Node<File>({
      data: { type: "FILE", fileName: "k", size: 7214296 },
    }),
  ],
});

const aDir = new Node<SystemResponse>({
  data: { type: "DIR", dirName: "a" },
  children: [
    new Node<SystemResponse>({
      data: { type: "DIR", dirName: "e" },
      children: [
        new Node<File>({
          data: { type: "FILE", fileName: "i", size: 584 },
        }),
      ],
    }),
    new Node<File>({
      data: { type: "FILE", fileName: "f", size: 29116 },
    }),
    new Node<File>({
      data: { type: "FILE", fileName: "g", size: 2557 },
    }),
    new Node<File>({
      data: { type: "FILE", fileName: "h.lst", size: 62596 },
    }),
  ],
});

const oracle: {
  commandStrArr: {
    cmdStr: string;
    responses?: string[];
  }[];
  commands: Command<"CD" | "LS">[];
  systemTree: Tree<SystemResponse>;
  input: string;
}[] = [
  {
    commandStrArr: [
      { cmdStr: "$ cd /" },
      {
        cmdStr: "$ ls",
        responses: ["dir a", "14848514 b.txt", "8504156 c.dat", "dir d"],
      },
      { cmdStr: "$ cd a" },
      {
        cmdStr: "$ ls",
        responses: ["dir e", "29116 f", "2557 g", "62596 h.lst"],
      },
      { cmdStr: "$ cd e" },
      { cmdStr: "$ ls", responses: ["584 i"] },
      { cmdStr: "$ cd .." },
      { cmdStr: "$ cd .." },
      { cmdStr: "$ cd d" },
      {
        cmdStr: "$ ls",
        responses: ["4060174 j", "8033020 d.log", "5626152 d.ext", "7214296 k"],
      },
    ],
    commands: [
      { type: "CD", dir: "/" },
      {
        type: "LS",
        responses: [
          { type: "DIR", dirName: "a" },
          { type: "FILE", fileName: "b.txt", size: 14848514 },
          { type: "FILE", fileName: "c.dat", size: 8504156 },
          { type: "DIR", dirName: "d" },
        ],
      },
      { type: "CD", dir: "a" },
      {
        type: "LS",
        responses: [
          { type: "DIR", dirName: "e" },
          { type: "FILE", fileName: "f", size: 29116 },
          { type: "FILE", fileName: "g", size: 2557 },
          { type: "FILE", fileName: "h.lst", size: 62596 },
        ],
      },
      { type: "CD", dir: "e" },
      { type: "LS", responses: [{ type: "FILE", fileName: "i", size: 584 }] },
      { type: "CD", dir: ".." },
      { type: "CD", dir: ".." },
      { type: "CD", dir: "d" },
      {
        type: "LS",
        responses: [
          { type: "FILE", fileName: "j", size: 4060174 },
          { type: "FILE", fileName: "d.log", size: 8033020 },
          { type: "FILE", fileName: "d.ext", size: 5626152 },
          { type: "FILE", fileName: "k", size: 7214296 },
        ],
      },
    ],
    systemTree: {
      root: new Node<SystemResponse>({
        data: { type: "DIR", dirName: "/" },
        parent: undefined,
        children: [
          aDir,
          dDir,
          new Node<File>({
            data: { type: "FILE", fileName: "b.txt", size: 14848514 },
          }),
          new Node<File>({
            data: { type: "FILE", fileName: "c.dat", size: 8504156 },
          }),
        ],
      }),
    },
    input: `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`,
  },
];

describe("part1", () => {
  test("Parses file to commands example (1)", () => {
    const commands = createCommandStringArr(oracle[0].input);
    expect(commands).toEqual(oracle[0].commandStrArr);
  });

  test("Parses commands example (1)", () => {
    const commands = parseCommands(oracle[0].commandStrArr);
    expect(commands).toEqual(oracle[0].commands);
  });

  test("Creates example tree (1)", () => {
    const commands = oracle[0].commands;
    const systemTree = createSystemTree(commands);
    console.log(
      util.inspect(systemTree, false, null, true /* enable colors */)
    );

    const aDir = systemTree.root.children.find(
      (n) => (n.data as Directory).dirName === "a"
    );
    const dDir = systemTree.root.children.find(
      (n) => (n.data as Directory).dirName === "d"
    );

    expect(systemTree.root.children.length).toBe(4);
    expect(
      systemTree.root.children.filter((n) => n.data?.type === "DIR").length
    ).toBe(2);
    expect(
      systemTree.root.children.filter((n) => n.data?.type === "FILE").length
    ).toBe(2);
    expect(aDir).toBeDefined();
    expect(dDir).toBeDefined();
    expect(
      systemTree.root.children.find(
        (n) => (n.data as File).fileName === "b.txt"
      )
    ).toBeDefined();
    expect(
      systemTree.root.children.find(
        (n) => (n.data as File).fileName === "c.dat"
      )
    ).toBeDefined();
    expect(aDir?.children.length).toBe(4);
    expect(dDir?.children.length).toBe(4);
  });

  test("Parses commands example (1)", () => {
    const dirSize = calculateDirSize(dDir);
    expect(dirSize).toEqual(24933642);
  });

  test("Gets all directories", () => {
    const dirs = getAllNodeDirs(oracle[0].systemTree.root);
    expect(dirs.length).toBe(4);
  });
});

describe("part2", () => {
  test("calculates example line 1", () => {
    expect(1 + 1).toBe(2);
  });
});
