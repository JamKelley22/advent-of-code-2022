import { instructionTypeToCyclesToComplete } from "./config";
import {
  CPU,
  Instruction,
  InstructionType,
  OnInstructionComplete,
} from "./types";

export const parseLine = (
  line: string,
  onComplete?: OnInstructionComplete
): Instruction => {
  if (line.length === 0) {
    throw new Error(`Can not parse empty line> Line: ${line}`);
  }

  const lineSplit = line.split(" "); //Move sep to config
  if (lineSplit.length > 2) {
    throw new Error(`Line not formatted correctly. Line: ${line}`);
  }
  const instructionType = lineSplit[0] as InstructionType; //Check to see if valid type
  let value = 0;
  if (lineSplit.length > 1) {
    value = parseInt(lineSplit[1]); //Check to see if valid num
  }

  return {
    finishCycle: undefined,
    onComplete: onComplete
      ? () => onComplete(instructionType, value)
      : undefined,
    type: instructionType,
  };
};

export const loadInstructions = (
  cpu: CPU<Instruction>,
  instructions: Instruction[]
): CPU<Instruction> => {
  // Load instructions into CPU
  instructions.forEach((ins) => cpu.queue.push(ins));
  return cpu;
};

export const processInstructions = (
  cpu: CPU<Instruction>,
  cycleDuringEvents: Map<number, (cycle: number) => void>,
  getXReg: () => number,
  log: boolean = false
): CPU<Instruction> => {
  // Begin processing instructions
  for (let cycle = 1; cpu.queue.length !== 0; cycle++) {
    const col = cycle % 40;
    const row = Math.floor(cycle / 40);

    // Start cycle
    if (log) console.log(`Cycle: ${cycle}`);

    if (!cpu.register) {
      // Load instruction
      cpu.register = cpu.queue.shift();
      //   console.log(`Loaded: ${cpu.register?.type}`);
      // Process Instruction
      cpu.register!.finishCycle =
        cycle + instructionTypeToCyclesToComplete.get(cpu.register!.type)! - 1;
      //   console.log(cpu.register!.finishCycle);
    }

    // === During ===
    cycleDuringEvents.get(cycle)?.(cycle);
    // Print CRT
    const startXSprite = getXReg();
    if (col >= startXSprite && col < startXSprite + 3) {
      if (!cpu.crt[row]) cpu.crt[row] = [];
      cpu.crt[row].push("*");
    } else {
      if (!cpu.crt[row]) cpu.crt[row] = [];
      cpu.crt[row].push(" ");
    }

    //   cpu.livingProcesses.push(cpu.register);

    if (cpu.register?.finishCycle === cycle) {
      // Preform OnComplete for Process
      cpu.register.onComplete?.();
      cpu.register = undefined;
    }

    // // Decrement any living processes lifetime
    // cpu.livingProcesses = cpu.livingProcesses.map((livingProcess) => {
    //   return {
    //     ...livingProcess,
    //     finishCycle: --livingProcess.cyclesToComplete,
    //   };
    // });

    // Execute any processes which are done
    // cpu.livingProcesses = cpu.livingProcesses.filter((livingProcess) => {
    //   if (livingProcess.finishCycle === cycle) {
    //     // Preform OnComplete for Process
    //     livingProcess.onComplete?.();

    //     // Remove Process from life
    //     return false;
    //   }
    //   return true;
    // });

    // // console.log(cpu.register);
    // console.log(cpu.livingProcesses);

    // console.log("===========================");
  }
  return cpu;
};
