export const COLORS = {
  // yellow: 0xfddd5c,
  yellow: 0xffcc11,
  orange: 0xff7210,
  red: 0xff2025,
  green: 0x3d9900,
  magenta: 0xdc13ff,
  blue: 0x003166,
  teal: 0x008080,
} as const;

export const TEXT_COLORS = {
  yellow: "#ffda00",
  orange: "#ff7210",
  red: "#fe4e52",
  green: "#54d400",
  magenta: "#db72af",
  blue: "#2d91ff",
  teal: "#00cfcf",
} as const;

export type Color = keyof typeof COLORS;
export type TextColor = keyof typeof TEXT_COLORS;
