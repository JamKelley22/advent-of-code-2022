import { calculateRoundPartTwo, parseRoundPartTwo } from "./engine";
import { classicGameConfig } from "./gameConfig";

var fs = require("fs");

try {
  const data: string = fs.readFileSync("input.txt", "utf8").toString();

  const rounds = data.split(/\r?\n/);

  const total = rounds.reduce((totalScore, round) => {
    if (round.length === 0) return totalScore;
    return (
      calculateRoundPartTwo(
        parseRoundPartTwo(round, classicGameConfig),
        classicGameConfig
      ) + totalScore
    );
  }, 0);

  console.log(total);
} catch (e: any) {
  console.log("Error:", e.stack);
}
