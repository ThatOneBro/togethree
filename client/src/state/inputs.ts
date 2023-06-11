export const controllerState = {
  active: false,
  horizontal: 0,
  vertical: 0,
  jumping: false,
} as {
  active: boolean;
  horizontal: number;
  vertical: number;
  jumping: boolean;
};

type RawInputState = {
  w: boolean;
  a: boolean;
  s: boolean;
  d: boolean;
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  space: boolean;
};

export type RawInputKey = keyof RawInputState;

export const rawInputState = {
  w: false,
  a: false,
  s: false,
  d: false,
  up: false,
  down: false,
  left: false,
  right: false,
  space: false,
} as RawInputState;

export function updateInputState(state: Partial<RawInputState>) {
  for (const key in state) {
    if (state[key as RawInputKey] === undefined) continue;
    rawInputState[key as RawInputKey] = state[key as RawInputKey] as boolean;
  }
}

export function updateKeyState(k: RawInputKey, v: boolean) {
  rawInputState[k] = v;
}
