export interface Queue<T> {
  push: (item: T) => number;
  shift: () => T | undefined;
  [i: number]: T;
  length: number;
}

export type InstructionType = "addx" | "noop";

export type OnInstructionComplete = (
  instructionType: InstructionType,
  value: number
) => void;

export type Instruction = {
  finishCycle?: number;
  onComplete?: () => void;
  type: InstructionType;
};

export type CPU<T> = {
  queue: Queue<T>;
  cyclesPerTick: number;
  register?: T;
  livingProcesses: Array<T>;
};
