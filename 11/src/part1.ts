import {
  adjustWorryLevelAtNoDamage,
  applyTest,
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

  for (let round = 0; round < numRounds; round++) {
    // Monkey 0:
    //   Monkey inspects an item with a worry level of 79.
    //     Worry level is multiplied by 19 to 1501.
    //     Monkey gets bored with item. Worry level is divided by 3 to 500.
    //     Current worry level is not divisible by 23.
    //     Item with worry level 500 is thrown to monkey 3.
    //   Monkey inspects an item with a worry level of 98.
    //     Worry level is multiplied by 19 to 1862.
    //     Monkey gets bored with item. Worry level is divided by 3 to 620.
    //     Current worry level is not divisible by 23.
    //     Item with worry level 620 is thrown to monkey 3.
    console.log(`============== Round ${round} =============`);
    for (let monkeyNum = 0; monkeyNum < monkeys.length; monkeyNum++) {
      let logStr = "";
      const monkey = monkeys[monkeyNum];
      logStr += `Monkey ${monkey.id}\n`;
      // Monkey turn
      while (monkey.items.length > 0) {
        const item = monkey.items.shift();
        logStr += `  Monkey inspects an item with a worry level of ${item?.worryLevel}.\n`;
        // =Inspect Item
        const inspectedItem = inspectItem(monkey, item!); // Applies op in inspectItem
        monkey.numInspectedItems++;
        logStr += `    Worry level is ${monkey.operation[0].opCode} by ${monkey.operation[0].num} to ${inspectedItem.worryLevel}.\n`;
        // =Adjust Worry Level at Seeing No Damage
        const adjustedItem = adjustWorryLevelAtNoDamage(inspectedItem);
        logStr += `    Monkey gets bored with item. Worry level is divided by 3 to ${adjustedItem.worryLevel}.\n`;
        // =Find next monkey
        const testRes = applyTest(monkey.test, adjustedItem);
        logStr += `    Current worry level is ${
          testRes ? "" : "not"
        } divisible by ${monkey.test.number}.\n`;
        const targetMonkeyId = getTarget(monkey.test.conditional, testRes);
        // =Take Action (throw)
        monkeys[targetMonkeyId].items.push(adjustedItem);
        logStr += `    Item with worry level ${adjustedItem.worryLevel} is thrown to monkey ${targetMonkeyId}.\n`;
      }
      //   console.log(logStr);
      logStr = "";
    }
    console.log(monkeysToString(monkeys));
    console.log(`=========== End Round ${round} ===========`);
  }
  const topMonkeys = monkeys
    .sort((a, b) => b.numInspectedItems - a.numInspectedItems)
    .slice(0, 2);
  console.log("========= Top Monkeys ===========");

  console.log(monkeysToString(topMonkeys));
  console.log(
    topMonkeys[0].numInspectedItems * topMonkeys[1].numInspectedItems
  );
} catch (e: any) {
  console.log("Error:", e.stack);
}
