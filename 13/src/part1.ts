import util from "util";
import { compareASTs, parsePacket } from "./engine";

var fs = require("fs");

var inputs = [
  {
    fileName: "input.txt",
  },
  {
    fileName: "input-example.txt",
  },
  {
    fileName: "input-example2.txt",
  },
];

try {
  const input = inputs[0];
  const data: string = fs.readFileSync(input.fileName, "utf8").toString();

  const packetPairsStr = data.split("\n");

  const packetPairs2D: Array<Array<string>> = [];

  for (let index = 0; index < packetPairsStr.length; index++) {
    const element = packetPairsStr[index];
    if (!packetPairs2D[index]) packetPairs2D[index] = [];
    if (index % 3 === 2) continue;
    console.log(`acc[${Math.floor(index / 3)}][${index % 3}] = ${element};`);
    packetPairs2D[Math.floor(index / 3)][index % 3] = element;
    // console.log(packetPairs2D);

    // console.log(packetPairs2D[Math.floor(index / 3)][index % 3]);
  }

  const actualPacketPairsStr = packetPairs2D.filter((pps) => pps.length !== 0);

  console.log(actualPacketPairsStr);

  const packetPairs = actualPacketPairsStr.map((packetPairsStr) => {
    // console.log(packetPairStr);

    // const packetStrArr = packetPairStr.split("\n");
    return {
      p1: parsePacket(packetPairsStr[0]),
      p2: parsePacket(packetPairsStr[1]),
    };
  });

  //   console.log(packetPairs);

  const results = packetPairs.map((pair) => {
    const res = compareASTs(pair.p1.root, pair.p2.root);
    const correctOrder = res > 0;
    return correctOrder;
  });

  console.log(results);

  const total = results.reduce((sum, res, i) => (res ? sum + i + 1 : sum), 0);
  console.log(total);

  //   console.log(util.inspect(packetPairs, false, null, true));
} catch (e: any) {
  console.log("Error:", e.stack);
}
