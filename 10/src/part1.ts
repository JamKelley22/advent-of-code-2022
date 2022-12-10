import { defaultCPU } from "./config";
import { loadInstructions, parseLine, processInstructions } from "./engine";
import { InstructionType } from "./types";

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
  const lines = data.split(/\r?\n/).filter((line) => line.length);

  let total = 1;

  // Create virtual CPU
  let cpu = defaultCPU;
  // Parse all instructions
  const instructions = lines.map((line) =>
    parseLine(line, (instructionType: InstructionType, value?: number) => {
      if (instructionType === "addx") {
        total += value || 0;
      }
      console.log(
        `===Finished: ${instructionType}.\tValue: ${value}.\tTotal: ${total}`
      );
    })
  );

  //20th, 60th, 100th, 140th, 180th, and 220th

  let final = 0;

  cpu = loadInstructions(cpu, instructions);
  cpu = processInstructions(
    cpu,
    new Map<number, (cycle: number) => void>([
      [
        20,
        (cycle) => {
          console.log(total, total * cycle);
          final += total * cycle;
        },
      ],
      [
        60,
        (cycle) => {
          console.log(total, total * cycle);
          final += total * cycle;
        },
      ],
      [
        100,
        (cycle) => {
          console.log(total, total * cycle);
          final += total * cycle;
        },
      ],
      [
        140,
        (cycle) => {
          console.log(total, total * cycle);
          final += total * cycle;
        },
      ],
      [
        180,
        (cycle) => {
          console.log(total, total * cycle);
          final += total * cycle;
        },
      ],
      [
        220,
        (cycle) => {
          console.log(total, total * cycle);
          final += total * cycle;
        },
      ],
    ])
  );

  console.log(final);
} catch (e: any) {
  console.log("Error:", e.stack);
}
