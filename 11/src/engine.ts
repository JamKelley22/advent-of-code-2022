import {
  Conditional,
  Item,
  Monkey,
  OpCode,
  opCodes,
  Operation,
  Test,
} from "./types";
import util from "util";

export const getMonkeyStringArraysFromInput = (input: string) => {
  const lines = input.split(/\r?\n/);
  return lines.reduce(
    (obj, line) => {
      if (line.length === 0) {
        return {
          ...obj,
          i: ++obj.i,
        };
      }
      if (!obj.monkeys[obj.i]) obj.monkeys[obj.i] = [];
      obj.monkeys[obj.i].push(line.trim());
      return obj;
    },
    { i: 0, monkeys: Array<Array<string>>() }
  );
};

export const parseMonkeyFromStrArr = (monkeyStrArr: string[]): Monkey => {
  if (monkeyStrArr.length !== 6) {
    throw new Error(
      `Incorrect num lines to parse monkey. Monkey string array: ${monkeyStrArr.length}`
    );
  }
  // Parse Id
  const id = parseInt(monkeyStrArr[0].charAt(7));

  // Parse Items
  const itemIdArr = monkeyStrArr[1]
    .split(":")[1]
    .split(",")
    .map((numStr) => {
      return {
        worryLevel: parseInt(numStr),
      };
    });

  // Parse Operation
  const opStr = monkeyStrArr[2].split(/old(.*)/s);
  const maybeOpCode = opStr[1].charAt(1);
  const opCode: OpCode | undefined = opCodes.find(
    (validName) => validName === maybeOpCode
  );
  if (!opCode) {
    throw new Error(`Could not parse opCode: ${maybeOpCode}`);
  }
  const opNumStr = opStr[1].slice(3);
  const opNum = Object.is(parseInt(opNumStr), NaN) ? "old" : parseInt(opNumStr);

  // Parse Test
  const testNum = parseInt(monkeyStrArr[3].split("by")[1]);
  // =Parse True test
  const trueTarget = parseInt(monkeyStrArr[4].split("monkey")[1]);
  const falseTarget = parseInt(monkeyStrArr[5].split("monkey")[1]);

  return {
    items: itemIdArr,
    id: id,
    operation: [
      {
        term1: "old",
        opCode: opCode,
        num: opNum,
      },
    ],
    test: {
      type: "divisible",
      number: testNum,
      conditional: {
        // op: "throw",
        trueTarget: trueTarget,
        falseTarget: falseTarget,
      },
    },
    numInspectedItems: 0,
  };
};

export const applyOperation = (
  op: Operation,
  item: Item,
  mod?: number
): number => {
  switch (op.opCode) {
    case "*":
      const multiplier = op.num === "old" ? item.worryLevel : op.num;
      return multiply(item.worryLevel, multiplier, mod);
    case "+":
      const addition = op.num === "old" ? item.worryLevel : op.num;
      return item.worryLevel + addition;
    default:
      throw new Error(
        `OpCode not implemented in applyOperation function. OpCode: ${op.opCode}`
      );
  }
};

export const inspectItem = (monkey: Monkey, item: Item, lcm?: number): Item => {
  const newWorryLevel = monkey.operation.reduce((newWorryLevel, op) => {
    return newWorryLevel + applyOperation(op, item, lcm);
  }, 0);
  return {
    worryLevel: newWorryLevel,
  };
};

export const adjustWorryLevelAtNoDamage = (item: Item): Item => {
  return {
    worryLevel: Math.floor(item.worryLevel / 3),
  };
};

export const applyTest = (test: Test, item: Item): boolean => {
  //   if (test.op !== "throw") {
  //     throw new Error(
  //       `Test op not implemented in testWorryLevelAndGetTarget function with '${test.type}' test type. Op: ${test.conditional.op}`
  //     );
  //   }
  switch (test.type) {
    case "divisible":
      const res = item.worryLevel / test.number;
      return Number.isInteger(res);
    default:
      throw new Error(
        `Test type not implemented in testWorryLevelAndGetTarget function. Test Type: ${test.type}`
      );
  }
};

export const getTarget = (
  conditional: Conditional,
  testRes: boolean
): number => {
  if (testRes) {
    return conditional.trueTarget;
  }
  return conditional.falseTarget;
};

export const monkeysToString = (monkeys: Monkey[]): string => {
  const trimmedMonkeys = monkeys.map((monkey) => {
    return {
      monkey: monkey.id,
      items: (monkey.items as unknown as { worryLevel: number }[]).map(
        (item) => item.worryLevel
      ),
      numInspectedItems: monkey.numInspectedItems,
    };
  });
  return util.inspect(trimmedMonkeys, false, null, true /* enable colors */);
};

export function gcd(a: number, b: number): number {
  return !b ? a : gcd(b, a % b);
}

// Partly from Accepted answer https://stackoverflow.com/questions/31302054/how-to-find-the-least-common-multiple-of-a-range-of-numbers
// StackOverflow user: rgbchris (https://stackoverflow.com/users/1613023/rgbchris)
export const findLCM = (nums: number[]): number => {
  if (nums.includes(0))
    throw new Error(
      `The LCM of zero does not exist. Remove 0's and try again.`
    );

  //   return nums.reduce((acc, num) => acc * num);
  const min = nums.sort()[0];

  function lcm(a: number, b: number): number {
    return (a * b) / gcd(a, b);
  }

  var multiple = min;
  nums.forEach(function (n) {
    multiple = lcm(multiple, n);
  });

  return multiple;
};

export const multiply = (num1: number, num2: number, mod?: number): number => {
  if (!mod) return num1 * num2;
  return (num1 * num2) % mod;
};
export const divide = (
  numerator: number,
  denominator: number,
  mod?: number
): number => {
  if (!mod) return numerator / denominator;
  return (numerator / denominator) % mod;
};
