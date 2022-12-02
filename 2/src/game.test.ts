import { describe, expect, test } from "@jest/globals";

import { classicGameConfig, Outcome } from "./gameConfig";
import {
  calculateRound,
  calculateRoundPartTwo,
  parseRound,
  Round,
  RoundPartTwo,
} from "./engine";

describe("part1", () => {
  test("round parsing works", () => {
    const round = parseRound("A X", classicGameConfig);
    expect(round.myMove).toBe("ROCK");
    expect(round.opponentMove).toBe("ROCK");
  });
  test("round parsing rejects empty correctly", () => {
    expect(() => {
      parseRound("", classicGameConfig);
    }).toThrow(); // Or .toThrow('expectedErrorMessage')
  });
  test("round parsing rejects to many args", () => {
    expect(() => {
      parseRound("A X Y", classicGameConfig);
    }).toThrow(); // Or .toThrow('expectedErrorMessage')
  });
  test("calculates DRAW correctly 1", () => {
    const round: Round = {
      myMove: "ROCK",
      opponentMove: "ROCK",
    };
    const points = calculateRound(round, classicGameConfig);

    expect(points).toBe(4); // 3 for draw and 1 for rock
  });
  test("calculates WIN correctly 1", () => {
    const round: Round = {
      myMove: "PAPER",
      opponentMove: "ROCK",
    };
    const points = calculateRound(round, classicGameConfig);

    expect(points).toBe(8); // 6 for win and 2 for paper
  });
  test("calculates WIN correctly 2", () => {
    const round: Round = {
      myMove: "SCISSORS",
      opponentMove: "PAPER",
    };
    const points = calculateRound(round, classicGameConfig);

    expect(points).toBe(9); // 6 for win and 3 for scissors
  });
  test("calculates LOSS correctly 1", () => {
    const round: Round = {
      myMove: "SCISSORS",
      opponentMove: "ROCK",
    };
    const points = calculateRound(round, classicGameConfig);

    expect(points).toBe(3); // 0 for loss and 3 for scissors
  });
  test("calculates LOSS correctly 2", () => {
    const round: Round = {
      myMove: "PAPER",
      opponentMove: "SCISSORS",
    };
    const points = calculateRound(round, classicGameConfig);

    expect(points).toBe(2); // 0 for loss and 2 for scissors
  });

  test("calculates LOSS correctly 2", () => {
    const round: Round = {
      myMove: "PAPER",
      opponentMove: "SCISSORS",
    };
    const points = calculateRound(round, classicGameConfig);

    expect(points).toBe(2); // 0 for loss and 2 for scissors
  });

  test("parses and calculates 10 rounds correctly (1)", () => {
    const rounds: { round: Round; ans: number }[] = [
      { round: ["C", "X"], ans: 7 }, // Scissors, Rock - 6 + 1 = 7
      { round: ["C", "X"], ans: 7 }, // Scissors, Rock - 6 + 1 = 7
      { round: ["C", "X"], ans: 7 }, // Scissors, Rock - 6 + 1 = 7
      { round: ["A", "Z"], ans: 3 }, // Rock, Scissors - 0 + 3 = 3
      { round: ["C", "X"], ans: 7 }, // Scissors, Rock - 6 + 1 = 7
      { round: ["C", "X"], ans: 7 }, // Scissors, Rock - 6 + 1 = 7
      { round: ["A", "Y"], ans: 8 }, // Rock, Paper - 6 + 2 = 8
      { round: ["B", "X"], ans: 1 }, // Paper, Rock - 0 + 1 = 1
      { round: ["B", "Y"], ans: 5 }, // Paper, Paper - 3 + 2 = 5
      { round: ["B", "Z"], ans: 9 }, // Paper, Scissors - 6 + 3 = 9
    ].map((obj) => {
      return {
        round: {
          myMove: classicGameConfig.stringToMove.get(obj.round[1])!,
          opponentMove: classicGameConfig.stringToMove.get(obj.round[0])!,
        },
        ans: obj.ans,
      };
    });

    const total = rounds.reduce((totalScore, obj) => {
      const roundScore = calculateRound(obj.round, classicGameConfig);
      expect(roundScore).toBe(obj.ans);
      return roundScore + totalScore;
    }, 0);
  });

  test("parses and calculates 10 rounds correctly (2)", () => {
    const rounds: { round: Round; ans: number }[] = [
      { round: ["C", "Y"], ans: 2 }, // Scissors, Paper - 0 + 2 = 2
      { round: ["A", "X"], ans: 4 }, // Rock, Rock - 3 + 1 = 4
      { round: ["C", "X"], ans: 7 }, // Scissors, Rock - 6 + 1 = 7
      { round: ["B", "Z"], ans: 9 }, // Paper, Scissors - 6 + 3 = 9
      { round: ["B", "Y"], ans: 5 }, // Paper, Paper - 3 + 2 = 5
      { round: ["B", "Y"], ans: 5 }, // Paper, Paper - 3 + 2 = 5
      { round: ["C", "Y"], ans: 2 }, // Scissors, Paper - 0 + 2 = 2
      { round: ["C", "X"], ans: 7 }, // Scissors, Rock - 6 + 1 = 7
      { round: ["C", "Y"], ans: 2 }, // Scissors, Paper - 0 + 2 = 2
      { round: ["C", "X"], ans: 7 }, // Scissors, Rock - 6 + 1 = 7
    ].map((obj) => {
      return {
        round: {
          myMove: classicGameConfig.stringToMove.get(obj.round[1])!,
          opponentMove: classicGameConfig.stringToMove.get(obj.round[0])!,
        },
        ans: obj.ans,
      };
    });

    const total = rounds.reduce((totalScore, obj) => {
      const roundScore = calculateRound(obj.round, classicGameConfig);
      expect(roundScore).toBe(obj.ans);
      return roundScore + totalScore;
    }, 0);
  });
  test("parses and calculates example given correctly", () => {
    const rounds: { round: Round; ans: number }[] = [
      { round: ["A", "Y"], ans: 8 }, // Rock, Paper - 6 + 2 = 8
      { round: ["B", "X"], ans: 1 }, // Paper, Rock - 0 + 1 = 1
      { round: ["C", "Z"], ans: 6 }, // Scissors, Scissors - 3 + 3 = 6
    ].map((obj) => {
      return {
        round: {
          myMove: classicGameConfig.stringToMove.get(obj.round[1])!,
          opponentMove: classicGameConfig.stringToMove.get(obj.round[0])!,
        },
        ans: obj.ans,
      };
    });

    const total = rounds.reduce((totalScore, obj) => {
      const roundScore = calculateRound(obj.round, classicGameConfig);
      expect(roundScore).toBe(obj.ans);
      return roundScore + totalScore;
    }, 0);
  });
});

describe("part2", () => {
  test("calculates ROCK, DRAW correctly", () => {
    const round: RoundPartTwo = {
      opponentMove: "ROCK",
      outcome: "DRAW",
    };
    const points = calculateRoundPartTwo(round, classicGameConfig);

    expect(points).toBe(4); // 3 for draw and 1 for rock
  });
  // test("parses and calculates 10 rounds correctly (2)", () => {
  //   const rounds: { round: Round; ans: number }[] = [
  //     { round: ["C", "Y"], ans: 2 }, // Scissors, Paper - 0 + 2 = 2
  //     { round: ["A", "X"], ans: 4 }, // Rock, Rock - 3 + 1 = 4
  //     { round: ["C", "X"], ans: 7 }, // Scissors, Rock - 6 + 1 = 7
  //     { round: ["B", "Z"], ans: 9 }, // Paper, Scissors - 6 + 3 = 9
  //     { round: ["B", "Y"], ans: 5 }, // Paper, Paper - 3 + 2 = 5
  //     { round: ["B", "Y"], ans: 5 }, // Paper, Paper - 3 + 2 = 5
  //     { round: ["C", "Y"], ans: 2 }, // Scissors, Paper - 0 + 2 = 2
  //     { round: ["C", "X"], ans: 7 }, // Scissors, Rock - 6 + 1 = 7
  //     { round: ["C", "Y"], ans: 2 }, // Scissors, Paper - 0 + 2 = 2
  //     { round: ["C", "X"], ans: 7 }, // Scissors, Rock - 6 + 1 = 7
  //   ].map((obj) => {
  //     return {
  //       round: {
  //         myMove: classicGameConfig.stringToMove.get(obj.round[1])!,
  //         opponentMove: classicGameConfig.stringToMove.get(obj.round[0])!,
  //       },
  //       ans: obj.ans,
  //     };
  //   });

  //   const total = rounds.reduce((totalScore, obj) => {
  //     const roundScore = calculateRound(obj.round, classicGameConfig);
  //     expect(roundScore).toBe(obj.ans);
  //     return roundScore + totalScore;
  //   }, 0);
  // });
  test("calculates example given correctly", () => {
    const rounds: { round: RoundPartTwo; ans: number }[] = [
      { round: ["ROCK", "DRAW"], ans: 4 }, // Rock, ?(ROCK), DRAW - 3 + 1 = 4
      { round: ["PAPER", "LOSE"], ans: 1 }, // Paper, ?(ROCK), LOSE - 0 + 1 = 1
      { round: ["SCISSORS", "WIN"], ans: 7 }, // Scissors, ?(ROCK), WIN - 6 + 1 = 7
    ].map((obj, i) => {
      const opponentMove = obj.round[0];
      const outcome = obj.round[1] as Outcome;
      return {
        round: {
          opponentMove: opponentMove,
          outcome: outcome,
        },
        ans: obj.ans,
      };
    });

    const total = rounds.reduce((totalScore, obj) => {
      const roundScore = calculateRoundPartTwo(obj.round, classicGameConfig);
      expect(roundScore).toBe(obj.ans);
      return roundScore + totalScore;
    }, 0);
  });
});
