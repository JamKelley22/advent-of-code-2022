import { IGameConfig, Outcome } from "./gameConfig";

export type Round = {
  myMove: string;
  opponentMove: string;
};

export type RoundPartTwo = {
  opponentMove: string;
  outcome: Outcome;
};

export const parseRound = (
  round: string,
  config: IGameConfig,
  separator?: string
): Round => {
  const roundSplit = round.split(separator || " ");
  if (roundSplit.length != 2) {
    throw new Error(
      `Incorrect format on round given. Expected like 'A Y', got ${round}.`
    );
  }

  const myMoveString = roundSplit[1];
  const myMove = config.stringToMove.get(myMoveString);
  if (!myMove)
    throw new Error(`Error when parsing player move. Move: ${myMoveString}`);

  const opponentMoveString = roundSplit[0];
  const opponentMove = config.stringToMove.get(opponentMoveString);
  if (!opponentMove)
    throw new Error(
      `Error when parsing player move. Move: ${opponentMoveString}`
    );

  return {
    myMove: myMove,
    opponentMove: opponentMove,
  };
};

export const parseRoundPartTwo = (
  round: string,
  config: IGameConfig,
  separator?: string
): RoundPartTwo => {
  const roundSplit = round.split(separator || " ");
  if (roundSplit.length != 2) {
    throw new Error(
      `Incorrect format on round given. Expected like 'A Y', got ${round}.`
    );
  }

  const outcomeString = roundSplit[1];

  const requiredOutcome = config.stringToOutcome.get(outcomeString);
  if (!requiredOutcome)
    throw new Error(
      `Error when parsing outcome required. Outcome: ${requiredOutcome}`
    );

  const opponentMoveString = roundSplit[0];
  const opponentMove = config.stringToMove.get(opponentMoveString);
  if (!opponentMove)
    throw new Error(
      `Error when parsing player move. Move: ${opponentMoveString}`
    );

  return {
    opponentMove: opponentMove,
    outcome: requiredOutcome,
  };
};

export const calculateRound = (round: Round, config: IGameConfig): number => {
  // Determine player outcome
  const outcome = config.rulesMatrix.get(round.myMove)?.get(round.opponentMove);
  if (!outcome)
    throw new Error(
      `Error when computing round outcome. Round: m1:${round.myMove} m2:${round.opponentMove}`
    );

  // Get points for round based on outcome
  const roundPoints = config.outcomeToPoints.get(outcome);
  if (!roundPoints && roundPoints !== 0)
    throw new Error(
      `Error when computing outcome points. Outcome: ${outcome.toString()}`
    );

  // Get points for playing given move
  const myMovePoints = config.moveToPoints.get(round.myMove);
  if (!myMovePoints)
    throw new Error(`Error when computing move points. Move: ${round.myMove}`);

  return roundPoints + myMovePoints;
};

export const calculateRoundPartTwo = (
  round: RoundPartTwo,
  config: IGameConfig
): number => {
  // Get points for round based on outcome
  const roundPoints = config.outcomeToPoints.get(round.outcome);
  if (!roundPoints && roundPoints !== 0)
    throw new Error(
      `Error when computing outcome points. Outcome: ${round.outcome}`
    );

  // Determine move required
  const requiredMove = config.moveFromOutcomeRequired.get(
    round.opponentMove + round.outcome
  );
  if (!requiredMove)
    throw new Error(
      `Error when computing required move for outcome. OpponentMove: ${round.opponentMove} RequiredOutcome: ${round.outcome}`
    );

  // Get points for playing given move
  const myMovePoints = config.moveToPoints.get(requiredMove);
  if (!myMovePoints)
    throw new Error(`Error when computing move points. Move: ${requiredMove}`);

  return roundPoints + myMovePoints;
};
