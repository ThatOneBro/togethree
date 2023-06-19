import { createContext } from "react";

import type { MutableRefObject } from "react";
import type { Object3D } from "three";

import type { CameraAngle } from "~/game/camera/config";

export type CameraContextState = {
  setCameraFollowTarget: (
    target: MutableRefObject<Object3D | null> | null,
  ) => (() => void) | void;
  setCameraAngle: (angle: CameraAngle) => (() => void) | void;
};

export const CameraContext = createContext<CameraContextState>({
  setCameraFollowTarget: () => void 0,
  setCameraAngle: () => void 0,
} as CameraContextState);
