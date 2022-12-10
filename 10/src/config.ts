import { CPU, Instruction, InstructionType, Queue } from "./types";

export const instructionTypeToCyclesToComplete: Map<InstructionType, number> =
  new Map<InstructionType, number>([
    ["addx", 2],
    ["noop", 1],
  ]);

export const defaultCPU: CPU<Instruction> = {
  queue: Array<Instruction>(),
  cyclesPerTick: 2,
  register: undefined,
  livingProcesses: Array<Instruction>(),
  crt: Array<Array<string>>([]),
};
