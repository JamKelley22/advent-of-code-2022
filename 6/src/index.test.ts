import { describe, expect, test } from "@jest/globals";
import { defaultConfig } from "./config";

import { calculateStartIndex } from "./engine";

const oracle: {
  dataStreamBuffer: string;
  packetStartIndex: number;
  messageStartIndex: number;
}[] = [
  {
    dataStreamBuffer: "mjqjpqmgbljsphdztnvjfqwrcgsmlb",
    packetStartIndex: 7,
    messageStartIndex: 19,
  },
  {
    dataStreamBuffer: "bvwbjplbgvbhsrlpgdmjqwftvncz",
    packetStartIndex: 5,
    messageStartIndex: 23,
  },
  {
    dataStreamBuffer: "nppdvjthqldpwncqszvftbrmjlhg",
    packetStartIndex: 6,
    messageStartIndex: 23,
  },
  {
    dataStreamBuffer: "nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg",
    packetStartIndex: 10,
    messageStartIndex: 29,
  },
  {
    dataStreamBuffer: "zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw",
    packetStartIndex: 11,
    messageStartIndex: 26,
  },
];

describe("part1", () => {
  test("calculates example line (1)", () => {
    const ans = oracle[0];
    const packet = calculateStartIndex(ans.dataStreamBuffer);
    expect(packet).toBe(ans.packetStartIndex);
  });
  test("calculates example line (2)", () => {
    const ans = oracle[1];
    const packet = calculateStartIndex(ans.dataStreamBuffer);
    expect(packet).toBe(ans.packetStartIndex);
  });
  test("calculates example line (3)", () => {
    const ans = oracle[2];
    const packet = calculateStartIndex(ans.dataStreamBuffer);
    expect(packet).toBe(ans.packetStartIndex);
  });
  test("calculates example line (4)", () => {
    const ans = oracle[3];
    const packet = calculateStartIndex(ans.dataStreamBuffer);
    expect(packet).toBe(ans.packetStartIndex);
  });
  test("calculates example line (5)", () => {
    const ans = oracle[4];
    const packet = calculateStartIndex(ans.dataStreamBuffer);
    expect(packet).toBe(ans.packetStartIndex);
  });
});

describe("part2", () => {
  test("calculates example line (1)", () => {
    const ans = oracle[0];
    const messageStartIndex = calculateStartIndex(
      ans.dataStreamBuffer,
      defaultConfig.messageStartMarkerLength
    );
    expect(messageStartIndex).toBe(ans.messageStartIndex);
  });
  test("calculates example line (2)", () => {
    const ans = oracle[1];
    const messageStartIndex = calculateStartIndex(
      ans.dataStreamBuffer,
      defaultConfig.messageStartMarkerLength
    );
    expect(messageStartIndex).toBe(ans.messageStartIndex);
  });
  test("calculates example line (3)", () => {
    const ans = oracle[2];
    const messageStartIndex = calculateStartIndex(
      ans.dataStreamBuffer,
      defaultConfig.messageStartMarkerLength
    );
    expect(messageStartIndex).toBe(ans.messageStartIndex);
  });
  test("calculates example line (4)", () => {
    const ans = oracle[3];
    const messageStartIndex = calculateStartIndex(
      ans.dataStreamBuffer,
      defaultConfig.messageStartMarkerLength
    );
    expect(messageStartIndex).toBe(ans.messageStartIndex);
  });
  test("calculates example line (5)", () => {
    const ans = oracle[4];
    const messageStartIndex = calculateStartIndex(
      ans.dataStreamBuffer,
      defaultConfig.messageStartMarkerLength
    );
    expect(messageStartIndex).toBe(ans.messageStartIndex);
  });
});
