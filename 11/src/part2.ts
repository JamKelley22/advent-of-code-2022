import {
  adjustWorryLevelAtNoDamage,
  applyTest,
  findLCM,
  getMonkeyStringArraysFromInput,
  getTarget,
  inspectItem,
  monkeysToString,
  parseMonkeyFromStrArr,
} from "./engine";

var fs = require("fs");

var inputs = [
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
  const monkeyStringArrays = getMonkeyStringArraysFromInput(data);

  const monkeys = monkeyStringArrays.monkeys.map((monkeyStrArr) =>
    parseMonkeyFromStrArr(monkeyStrArr)
  );

  const numRounds = 10000;
  const log = false;

  const logRound = [
    1, 20, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000,
  ].map((num) => num - 1);

  for (let round = 0; round < numRounds; round++) {
    if (log) console.log(`============== Round ${round} =============`);
    for (let monkeyNum = 0; monkeyNum < monkeys.length; monkeyNum++) {
      const lcm = findLCM(monkeys.map((monkey) => monkey.test.number));
      let logStr = "";
      const monkey = monkeys[monkeyNum];
      logStr += `Monkey ${monkey.id}\n`;
      // Monkey turn
      if (log) console.log(monkey.id, monkey.items.length);
      while (monkey.items.length > 0) {
        const item = monkey.items.shift();
        logStr += `  Monkey inspects an item with a worry level of ${item?.worryLevel}.\n`;
        // =Inspect Item
        const inspectedItem = inspectItem(monkey, item!, lcm); // Applies op in inspectItem
        monkey.numInspectedItems++;
        logStr += `    Worry level is ${monkey.operation[0].opCode} by ${monkey.operation[0].num} to ${inspectedItem.worryLevel}.\n`;
        // // =Adjust Worry Level at Seeing No Damage
        // const adjustedItem = adjustWorryLevelAtNoDamage(inspectedItem);
        // logStr += `    Monkey gets bored with item. Worry level is divided by 3 to ${adjustedItem.worryLevel}.\n`;
        // =Find next monkey
        const testRes = applyTest(monkey.test, inspectedItem);
        logStr += `    Current worry level is ${
          testRes ? "" : "not"
        } divisible by ${monkey.test.number}.\n`;
        const targetMonkeyId = getTarget(monkey.test.conditional, testRes);
        // =Take Action (throw)
        monkeys[targetMonkeyId].items.push(inspectedItem);
        logStr += `    Item with worry level ${inspectedItem.worryLevel} is thrown to monkey ${targetMonkeyId}.\n`;
      }
      if (log) console.log(logStr);
      logStr = "";
    }
    if (log) console.log(monkeysToString(monkeys));
    if (log) console.log(`=========== End Round ${round} ===========`);
    if (logRound.includes(round)) {
      console.log(`== After round ${round + 1} ==`);
      monkeys.forEach((monkey) => {
        console.log(
          `Monkey ${monkey.id} inspected items ${monkey.numInspectedItems} times.`
        );
      });
    }
  }
  const topMonkeys = monkeys
    .sort((a, b) => b.numInspectedItems - a.numInspectedItems)
    .slice(0, 2);
  if (log) console.log("========= Top Monkeys ===========");

  if (log) console.log(monkeysToString(topMonkeys));
  console.log(
    topMonkeys[0].numInspectedItems * topMonkeys[1].numInspectedItems
  );
} catch (e: any) {
  console.log("Error:", e.stack);
}

// 31648982336 (too low)
