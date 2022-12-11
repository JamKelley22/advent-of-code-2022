export interface Queue<T> {
  push: (item: T) => number;
  shift: () => T | undefined;
  [i: number]: T;
  length: number;
}

export type Item = {
  worryLevel: number;
};
export const opCodes = ["*", "+"] as const;
export type OpCode = typeof opCodes[number];

export type Operation = {
  term1: "old";
  opCode: OpCode;
  num: number | "old";
};

export type Conditional = {
  //   op: "throw";
  trueTarget: number;
  falseTarget: number;
};

export type Test = {
  type: "divisible";
  number: number;
  conditional: Conditional;
};

export type Monkey = {
  id: number;
  items: Queue<Item>;
  operation: Operation[];
  test: Test;
  numInspectedItems: number;
};
