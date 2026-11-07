export const T = {
  bg0: "#041216",
  bg1: "#071F26",
  panel: "rgba(11, 40, 47, 0.78)",
  panelSolid: "#0B2A31",
  border: "rgba(94, 200, 255, 0.16)",
  borderStrong: "rgba(47, 211, 181, 0.42)",
  teal: "#2FD3B5",
  tealDim: "rgba(47, 211, 181, 0.14)",
  male: "#5EC8FF",
  maleDim: "rgba(94, 200, 255, 0.14)",
  female: "#FF8FA3",
  femaleDim: "rgba(255, 143, 163, 0.14)",
  amber: "#FFC857",
  amberDim: "rgba(255, 200, 87, 0.13)",
  red: "#FF6B6B",
  redDim: "rgba(255, 107, 107, 0.13)",
  text: "#EAF7F5",
  muted: "#93B4B2",
  dim: "#5F807E",
  font: '"Noto Sans CJK SC", "Noto Sans SC", "Source Han Sans SC", sans-serif',
};

export const speakerColor = (s: "M" | "F") => (s === "M" ? T.male : T.female);
export const speakerName = (s: "M" | "F") => (s === "M" ? "阿哲" : "小林");
