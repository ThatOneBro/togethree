import { useContext, useEffect } from "react";

import type { MutableRefObject } from "react";
import type { Object3D } from "three";

import { CameraContext } from "~/game/camera/context";

import type { CameraAngle } from "~/game/camera/config";

export const useSetCameraFollowTarget = (
  target: MutableRefObject<Object3D | null> | null,
) => {
  const { setCameraFollowTarget } = useContext(CameraContext);
  useEffect(() => {
    const unsubscribe = setCameraFollowTarget(target);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [target, setCameraFollowTarget]);
};

export const useSetCameraAngle = (angle: CameraAngle) => {
  const { setCameraAngle } = useContext(CameraContext);
  useEffect(() => {
    const unsubscribe = setCameraAngle(angle);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [angle, setCameraAngle]);
};
