export type Instruction = {
  numberToMove: number;
  fromStack: number;
  toStack: number;
};

export interface Stack<T> {
  push: (item: T) => number;
  pop: () => T | undefined;
  [i: number]: T;
  length: number;
  //   slice: (start?: number, end?: number) => T[];
  splice(start: number, deleteCount?: number): T[];
}

// export class Stack<T> implements IStack<T> {
//     stack: T[];
//     constructor(arr?: T[]) {
//       this.stack = arr || [];
//     }
//     [i: number]: T;
//     push: (item: T) => number;
//     pop: () => T | undefined;
//     length: number;
//   }

export const parseInstructionLine = (line: string): Instruction => {
  // https://stackoverflow.com/questions/609574/get-the-first-integers-in-a-string-with-javascript
  const nums = line
    .match(/^\d+|\d+\b|\d+(?=\w)/g)
    ?.map((numStr) => parseInt(numStr));

  if (!nums) {
    throw new Error(`Issue when parsing the instruction line: ${line}`);
  }

  return {
    numberToMove: nums[0],
    fromStack: nums[1],
    toStack: nums[2],
  };
};

export const parseStacks = (stackLevelStrings: string[]): Stack<string>[] => {
  if (stackLevelStrings.length === 0) return [];

  const numStacks = Math.floor(stackLevelStrings[0].length / 3);

  const stacks: Stack<string>[] = Array(numStacks);

  //   console.log(stacks);

  for (let level = stackLevelStrings.length - 1; level >= 0; level--) {
    const stackString = stackLevelStrings[level];
    // console.log(stackString);

    for (let stackIndex = 0; stackIndex < stacks.length; stackIndex++) {
      if (!stacks[stackIndex]) {
        const a: Stack<string> = [] as string[];

        stacks[stackIndex] = a;
      }
      const crateString = stackString.charAt(stackIndex * 4 + 1);
      //   console.log(crateString);

      if (crateString !== " ") stacks[stackIndex].push(crateString);
      //   console.log(stacks);
    }
  }
  //   console.log(stacks);

  return stacks;
};

export const calculateFinalStacks = (
  stacks: Stack<string>[],
  instructions: Instruction[],
  canMoveMultipleCratesAtOnce: boolean = false
): Stack<string>[] => {
  // Copy stacks to make sure we are not modifying original
  const _stacks = structuredClone(stacks);
  // Apply all movements from instructions to stacks in order
  for (
    let instructionIndex = 0;
    instructionIndex < instructions.length;
    instructionIndex++
  ) {
    const instruction = instructions[instructionIndex];
    // Apply single instruction
    if (canMoveMultipleCratesAtOnce) {
      // CrateMover 9001 (Stack with option to take(num: number) from the top)
      const crates = _stacks[instruction.fromStack - 1].splice(
        _stacks[instruction.fromStack - 1].length - instruction.numberToMove,
        instruction.numberToMove
      );
      if (!_stacks[instruction.toStack - 1]) {
        _stacks[instruction.toStack - 1] = [] as string[];
      }
      crates.forEach((crate) => _stacks[instruction.toStack - 1].push(crate));
    } else {
      // CrateMover 9000 (Just a plain stack)
      for (
        let crateMoveNum = 0;
        crateMoveNum < instruction.numberToMove;
        crateMoveNum++
      ) {
        const crate = _stacks[instruction.fromStack - 1].pop();
        if (crate) {
          if (!_stacks[instruction.toStack - 1]) {
            _stacks[instruction.toStack - 1] = [] as string[];
          }
          _stacks[instruction.toStack - 1].push(crate);
        }
      }
    }
  }
  return _stacks;
};

export const getTopCratesFromStacks = (stacks: Stack<string>[]): string => {
  const topCrates = stacks.reduce((crates, stack) => {
    return (crates += stack[stack.length - 1]);
  }, "");
  return topCrates;
};
