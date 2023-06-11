export const INPUT_KEY_CODES = {
  w: 87,
  d: 68,
  s: 83,
  a: 65,
  up: 38,
  right: 39,
  left: 37,
  down: 40,
  space: 32,
} as const;

export const INPUT_CODE_TO_KEY = {
  87: "w",
  68: "d",
  83: "s",
  65: "a",
  38: "up",
  39: "right",
  37: "left",
  40: "down",
  32: "space",
} as const;

export const INPUT_CONFIG = {
  up: [INPUT_KEY_CODES.w, INPUT_KEY_CODES.up],
  down: [INPUT_KEY_CODES.s, INPUT_KEY_CODES.down],
  left: [INPUT_KEY_CODES.a, INPUT_KEY_CODES.left],
  right: [INPUT_KEY_CODES.d, INPUT_KEY_CODES.right],
  jump: [INPUT_KEY_CODES.space],
} as const;
// } satisfies {
//   up: string[];
//   down: string[];
//   left: string[];
//   right: string[];
//   jump: string[];
// }

export type ValidInputCode = keyof typeof INPUT_CODE_TO_KEY;
export type InputKey = keyof typeof INPUT_CONFIG;
