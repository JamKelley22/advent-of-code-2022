export type Assignment = {
  start: number;
  end: number;
};

export const parseLine = (line: string): Assignment[] => {
  const assignments = line.split(",");
  if (assignments.length !== 2) {
    throw new Error(
      `Incorrect number of assignments on single line or error parsing. Line: ${line}`
    );
  }

  const parsedAssignments: Assignment[] = assignments.map((assignmentStr) => {
    const searchSpan = assignmentStr.split("-");
    if (searchSpan.length !== 2) {
      throw new Error(
        `Incorrect number of search spans for elf (eg. 2-3-4) on assignment or error parsing. Assignment: ${assignmentStr}`
      );
    }

    return {
      start: parseInt(searchSpan[0]),
      end: parseInt(searchSpan[1]),
    };
  });

  return parsedAssignments;
};

export const fullyContainsCalc = (assignments: Assignment[]): boolean => {
  //[0].start > [1].start && [0].end > [1].end
  if (
    assignments[0].start > assignments[1].start &&
    assignments[0].end > assignments[1].end
  ) {
    return false;
  }

  //[0].start < [1].start && [0].end < [1].end
  if (
    assignments[0].start < assignments[1].start &&
    assignments[0].end < assignments[1].end
  ) {
    return false;
  }
  return true;
};

export const partlyContainsCalc = (assignments: Assignment[]): boolean => {
  //[1].end < [0].start
  if (assignments[1].end < assignments[0].start) {
    return false;
  }

  //[0].end < [1].start
  if (assignments[0].end < assignments[1].start) {
    return false;
  }
  return true;
};

export const calculateLine = (
  assignments: Assignment[],
  containsOp: (assignments: Assignment[]) => boolean = fullyContainsCalc
): boolean => {
  if (assignments.length !== 2) {
    throw new Error(
      `Incorrect number of assignments given. # Assignments given: ${assignments.length}`
    );
  }

  return containsOp(assignments);

  //   const lowestStartAssignment = assignments.reduce(
  //     (acc, assignment, i) => {
  //       if (assignment.start < acc.lowestStart)
  //         return {
  //           lowestStartAssignmentIndex: i,
  //           lowestStart: assignment.start,
  //         };
  //       return {
  //         lowestStartAssignmentIndex: acc.lowestStartAssignmentIndex,
  //         lowestStart: acc.lowestStart,
  //       };
  //     },
  //     {
  //       lowestStartAssignmentIndex: Number.MAX_SAFE_INTEGER,
  //       lowestStart: Number.MAX_SAFE_INTEGER,
  //     }
  //   );

  //   const shiftedAssignments = assignments.map((assignment) => {
  //     const shift =
  //       assignments[lowestStartAssignment.lowestStartAssignmentIndex].start - 1;
  //     return {
  //       start: assignment.start - shift,
  //       end: assignment.end - shift,
  //     };
  //   });

  //   const highestStartAssignmentIndex =
  //     lowestStartAssignment.lowestStartAssignmentIndex === 1 ? 0 : 1;

  //   if (
  //     shiftedAssignments[highestStartAssignmentIndex].end >
  //     shiftedAssignments[lowestStartAssignment.lowestStartAssignmentIndex].end
  //   ) {
  //     return false;
  //   }

  //   return true;
};

export const assignmentsToString = (assignments: Assignment[]) => {
  const maxAssignmentEndIndex = assignments.reduce(
    (maxAssignmentEnd, assignment, i) => {
      if (assignment.end > maxAssignmentEnd) return i;
      return maxAssignmentEnd;
    },
    Number.MIN_SAFE_INTEGER
  );

  const assignmentStrings = assignments.map((assignment) => {
    let assignmentStr = "";
    for (
      let index = 1;
      index < assignments[maxAssignmentEndIndex].end + 2;
      index++
    ) {
      if (index >= assignment.start && index <= assignment.end) {
        assignmentStr += index > 9 ? `|${index}|` : `${index}`;
      } else {
        assignmentStr += index > 9 ? "|..|" : ".";
      }
    }
    return assignmentStr;
  });

  return assignmentStrings;

  //   assignmentStrings.forEach((assignmentString) => {
  //     console.log(assignmentString);
  //   });
};
