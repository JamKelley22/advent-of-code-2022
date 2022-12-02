export type Outcome = "WIN" | "LOSE" | "DRAW";

export interface IGameConfig {
  rulesMatrix: Map<string, Map<string, Outcome>>;
  moveToPoints: Map<string, number>;
  outcomeToPoints: Map<string, number>;
  stringToMove: Map<string, string>;
  stringToOutcome: Map<string, Outcome>;
  moveFromOutcomeRequired: Map<string, string>;
}

type ClassicMove = "ROCK" | "PAPER" | "SCISSORS";
export const classicGameConfig: IGameConfig = {
  rulesMatrix: new Map<ClassicMove, Map<string, Outcome>>([
    [
      "ROCK",
      new Map([
        ["ROCK", "DRAW"],
        ["PAPER", "LOSE"],
        ["SCISSORS", "WIN"],
      ]),
    ],
    [
      "PAPER",
      new Map([
        ["ROCK", "WIN"],
        ["PAPER", "DRAW"],
        ["SCISSORS", "LOSE"],
      ]),
    ],
    [
      "SCISSORS",
      new Map([
        ["ROCK", "LOSE"],
        ["PAPER", "WIN"],
        ["SCISSORS", "DRAW"],
      ]),
    ],
  ]),

  moveToPoints: new Map<ClassicMove, number>([
    ["ROCK", 1],
    ["PAPER", 2],
    ["SCISSORS", 3],
  ]),

  outcomeToPoints: new Map<Outcome, number>([
    ["WIN", 6],
    ["LOSE", 0],
    ["DRAW", 3],
  ]),

  stringToMove: new Map<string, ClassicMove>([
    ["A", "ROCK"],
    ["B", "PAPER"],
    ["C", "SCISSORS"],
    ["X", "ROCK"],
    ["Y", "PAPER"],
    ["Z", "SCISSORS"],
  ]),

  stringToOutcome: new Map<string, Outcome>([
    ["X", "LOSE"],
    ["Y", "DRAW"],
    ["Z", "WIN"],
  ]),

  moveFromOutcomeRequired: new Map<string, ClassicMove>([
    ["ROCKLOSE", "SCISSORS"],
    ["ROCKDRAW", "ROCK"],
    ["ROCKWIN", "PAPER"],

    ["PAPERLOSE", "ROCK"],
    ["PAPERDRAW", "PAPER"],
    ["PAPERWIN", "SCISSORS"],

    ["SCISSORSLOSE", "PAPER"],
    ["SCISSORSDRAW", "SCISSORS"],
    ["SCISSORSWIN", "ROCK"],
  ]),
};
