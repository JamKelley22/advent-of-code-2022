export interface IConfig {
  cmdStartChar: string;
  cmdSep: string;
  commands: string[];
}

export const defaultConfig: IConfig = {
  cmdStartChar: "$",
  cmdSep: " ",
  commands: ["ls", "cd"],
};
