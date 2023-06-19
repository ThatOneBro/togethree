import { degToRad } from "~/util/angles";

export const angleConfig = {
  // high: 25
  high: 15,
  ship: 90,
  lowWide: -5,
} as const;

export type CameraAngle = keyof typeof angleConfig;

export const posConfig = {
  lowWide: {
    x: -90,
    z: 90,
  },
  ship: {
    x: -45,
    z: 45,
  },
  default: {
    x: -15,
    z: 15,
  },
} as const;

export type CameraPosition = keyof typeof posConfig;

export const fovConfig = {
  high: 35,
  // high: 25,
  default: 25,
} as const;

export type CameraFov = keyof typeof fovConfig;

export const rotationConfig = {
  ship: degToRad(45),
  lowWide: degToRad(12),
  default: 0,
} as const;

export type CameraRotation = keyof typeof rotationConfig;
