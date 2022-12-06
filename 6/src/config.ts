export interface IConfig {
  packetStartMarkerLength: number;
  messageStartMarkerLength: number;
}

export const defaultConfig: IConfig = {
  packetStartMarkerLength: 4,
  messageStartMarkerLength: 14,
};
