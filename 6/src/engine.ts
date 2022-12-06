import { defaultConfig, IConfig } from "./config";

const isUnique = (str: string[]): boolean => {
  return new Set(str).size === str.length;
};

export const calculateStartIndex = (
  dataBuffer: string,
  startMarkerLength: number = defaultConfig.packetStartMarkerLength
): number => {
  if (dataBuffer.length < startMarkerLength) return -1;

  const startSignalSearchArr: string[] = dataBuffer
    .slice(0, startMarkerLength)
    .split("");

  for (
    let messageIndex = startMarkerLength;
    messageIndex < dataBuffer.length;
    messageIndex++
  ) {
    const unique = isUnique(startSignalSearchArr);
    if (unique) {
      return messageIndex;
    }

    const character = dataBuffer.charAt(messageIndex);
    startSignalSearchArr.push(character);
    startSignalSearchArr.shift();
  }
  return -1;
};
