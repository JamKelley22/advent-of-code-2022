export interface IConfig {
  stringToObj: Map<string, Object>;
}

export const defaultConfig: IConfig = {
  stringToObj: new Map<string, Object>([
    ["X", "A"],
    ["Y", "B"],
    ["Z", "C"],
  ]),
};
