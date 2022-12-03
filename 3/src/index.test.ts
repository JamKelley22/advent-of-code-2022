import { describe, expect, test } from "@jest/globals";
import { defaultConfig } from "./config";
import { calculateLine, calculateLinesPartTwo, parseLine } from "./engine";

describe("part1", () => {
  test("calculates example line 1", () => {
    const sack = parseLine("vJrwpWtwJgWrhcsFMMfFFhFp", defaultConfig);
    const duplicatePriority = calculateLine(sack, defaultConfig);
    expect(duplicatePriority).toBe(16); //p
  });
  test("calculates example line 2", () => {
    const sack = parseLine("jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL", defaultConfig);
    const duplicatePriority = calculateLine(sack, defaultConfig);
    expect(duplicatePriority).toBe(38); //L
  });

  test("calculates example line 3", () => {
    const sack = parseLine("PmmdzqPrVvPwwTWBwg", defaultConfig);
    const duplicatePriority = calculateLine(sack, defaultConfig);
    expect(duplicatePriority).toBe(42); //P
  });
  test("calculates example line 4", () => {
    const sack = parseLine("wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn", defaultConfig);
    const duplicatePriority = calculateLine(sack, defaultConfig);
    expect(duplicatePriority).toBe(22); //v
  });
  test("calculates example line 5", () => {
    const sack = parseLine("ttgJtRGJQctTZtZT", defaultConfig);
    const duplicatePriority = calculateLine(sack, defaultConfig);
    expect(duplicatePriority).toBe(20); //t
  });
  test("calculates example line 6", () => {
    const sack = parseLine("CrZsJsPPZsGzwwsLwLmpwMDw", defaultConfig);
    const duplicatePriority = calculateLine(sack, defaultConfig);
    expect(duplicatePriority).toBe(19); //s
  });
});

describe("part2", () => {
  test("Calculates example group 1", () => {
    const group = [
      new Set<string>("vJrwpWtwJgWrhcsFMMfFFhFp"),
      new Set<string>("jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL"),
      new Set<string>("PmmdzqPrVvPwwTWBwg"),
    ];
    const priority = calculateLinesPartTwo(group, defaultConfig);
    expect(priority).toBe(18);
  });
  test("Calculates example group 2", () => {
    const group = [
      new Set<string>("wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn"),
      new Set<string>("ttgJtRGJQctTZtZT"),
      new Set<string>("CrZsJsPPZsGzwwsLwLmpwMDw"),
    ];
    const priority = calculateLinesPartTwo(group, defaultConfig);
    expect(priority).toBe(52);
  });
});
