import "./globals";

export interface Queue<T> {
  push: (item: T) => number;
  shift: () => T | undefined;
  [i: number]: T;
  length: number;
}

export class Node<T> {
  data?: T;
  parent?: Node<T>;
  children: Node<T>[];

  constructor(data: { parent?: Node<T>; data?: T; children?: Node<T>[] }) {
    this.data = data.data;
    this.parent = data.parent;
    this.children = data.children ?? [];
  }
}

export type PacketNodeType = "[" | "]" | "[]" | number;
export type PacketChar = "[" | "]" | "[]" | string | ",";

export class Tree<T> {
  root: Node<T>;

  constructor(root: Node<T>) {
    this.root = root;
  }
}

export const parsePacketPairs = (
  packetPairStrings: {
    p1: string;
    p2: string;
  }[]
) => {
  return packetPairStrings.map((pps) => parsePacketPair(pps));
};

export const parsePacketPair = (packetPairString: {
  p1: string;
  p2: string;
}) => {
  return {
    p1: parsePacket(packetPairString.p1),
    p2: parsePacket(packetPairString.p2),
  };
};

export const parsePacket = (packet: string): Tree<PacketNodeType> => {
  const rootNode = new Node<PacketNodeType>({
    parent: undefined,
    data: "[",
    children: undefined,
  });
  const tree = new Tree<PacketNodeType>(rootNode);
  let currNode = rootNode;
  for (let index = 1; index < packet.length; index++) {
    const element = packet.charAt(index) as PacketChar;
    switch (element) {
      case ",":
        // Another one on the array (what about 2 digit)
        break;
      case "[":
        const newNode = new Node({ data: "[", parent: currNode });
        currNode.children.push(newNode);
        newNode.parent = currNode;
        currNode = newNode;

        break;
      case "]":
        // End of part
        if (currNode.data === "[") {
          //   currNode.data = "[]";
          if (!currNode.parent) break;
          else {
            currNode = currNode.parent;
          }
        }
        break;
      case "[]":
        // Reached the end
        if (!currNode.parent) break;
        break;
      default:
        // a number
        let num = element;
        // let nextElem = "";
        let nextElemIndex = index + 1;
        while (nextElemIndex < packet.length) {
          const nextElem = packet.charAt(nextElemIndex) as PacketChar;
          if (Number.isInteger(parseInt(nextElem))) {
            num += nextElem;
            index++;
          } else {
            break;
          }
          nextElemIndex++;
        }
        // console.log(num, parseInt(num));

        const numNode = new Node({
          parent: currNode,
          data: parseInt(num),
          children: undefined,
        });
        currNode.children.push(numNode);
        break;
    }
  }
  return tree;
};

export const astToString = (node: Node<PacketNodeType>): string => {
  const queue: Queue<Node<PacketNodeType>> = Array<Node<PacketNodeType>>();
  let str = "";
  // Left
  queue.push(node);
  while (queue.length != 0) {
    var tempNode = queue.shift();
    // bfs.push(tempNode?.data);
    str += tempNode?.data;
    if (tempNode?.children)
      for (
        let childNodeIndex = 0;
        childNodeIndex < tempNode.children.length;
        childNodeIndex++
      ) {
        const node = tempNode.children[childNodeIndex];
        queue.push(node);
      }
    // while (tempNode?.children && tempNode.children.length !== 0) {
    //   queue.push(tempNode.children.shift()!);
    // }
  }
  return str;
};

export const compareASTs = (
  left: Node<PacketNodeType>,
  right: Node<PacketNodeType>,
  indent: number = 0,
  log: boolean = false
): number => {
  const tabLvl = new Array(indent).fill("\t").join("");
  if (log)
    console.log(
      `${tabLvl}- Compare ${astToString(left)} vs ${astToString(right)}`
    );

  const leftIsInt = Number.isInteger(left.data);
  const rightIsInt = Number.isInteger(right.data);

  //If both values are integers
  if (leftIsInt && rightIsInt) {
    const leftN = left.data as number,
      rightN = right.data as number;

    // the lower integer should come first
    // If the left integer is lower than the right integer,
    // the inputs are in the right order.
    // If the left integer is higher than the right integer,
    // the inputs are not in the right order
    // Otherwise, the inputs are the same integer; continue checking the next part of the input.
    return rightN - leftN;
  }
  // If both values are lists,
  // compare the first value of each list,
  // then the second value, and so on.
  // If the left list runs out of items first,
  // the inputs are in the right order.
  // If the right list runs out of items first,
  // the inputs are not in the right order.
  // If the lists are the same length and no comparison makes a decision about the order,
  // continue checking the next part of the input
  else if (!leftIsInt && !rightIsInt) {
    if (left.children.length === 0 && right.children.length === 0) {
      if (log)
        console.log("Lengths the same === 0", left.children, right.children);

      //   throw new Error("Correct");
      return 0;
    }
    if (left.children.length === 0 && right.children.length !== 0) {
      if (log)
        console.log(
          `${tabLvl}\t- Left side is smaller, so inputs are in the right order`
        );

      return 1;
    }
    if (left.children.length !== 0 && right.children.length === 0) {
      if (log)
        console.log(
          `${tabLvl}\t- Right side is smaller, so inputs are NOT in the right order`
        );
      return -1;
    }
    // if (left.children.length !== 0 && right.children.length !== 0)
    else {
      for (
        let childIndex = 0;
        childIndex < Math.min(left.children.length, right.children.length);
        childIndex++
      ) {
        const res = compareASTs(
          left.children[childIndex],
          right.children[childIndex],
          indent + 1,
          log
        );
        if (res !== 0) {
          if (log) {
            if (res > 0)
              console.log(
                `${tabLvl}\t- Left side is smaller, so inputs are in the right order`
              );
            else
              console.log(
                `${tabLvl}\t- Right side is smaller, so inputs are NOT in the right order`
              );
          }
          return res;
        }
      }
      //   throw new Error("Correct");
      return right.children.length - left.children.length;
    }
  }

  // If exactly one value is an integer,
  //   convert the integer to a list which contains that integer as its only value,
  //   then retry the comparison.
  //   For example, if comparing [0,0,0] and 2,
  //   convert the right value to [2] (a list containing 2);
  //   the result is then found by instead comparing [0,0,0] and [2]
  else {
    if (!leftIsInt) {
      // Right is int, modify

      const newRight = parsePacket(`[${right.data}]`).root;
      newRight.parent = right.parent;
      const res = compareASTs(left, newRight, indent + 1, log);
      //   if (res !== 0) return res;
      return res;
    }
    ///if (!rightIsInt)
    else {
      // Left is int, modify
      const newLeft = parsePacket(`[${left.data}]`).root;
      newLeft.parent = left.parent;
      const res = compareASTs(newLeft, right, indent + 1, log);
      //   if (res !== 0) return res;
      return res;
    }
  }
};
