import { useCallback, useState } from "react";

import type { MutableRefObject } from "react";
import type { Object3D } from "three";

import { Camera } from "~/game/camera/components/Camera";
import { CameraContext } from "~/game/camera/context";

import type { CameraAngle } from "~/game/camera/config";

export const CameraProvider = ({ children }: { children: JSX.Element }) => {
  const [followTarget, setFollowTarget] =
    useState<MutableRefObject<Object3D | null> | null>(null);
  const [cameraAngle, setAngle] = useState<CameraAngle>("high");

  const setCameraFollowTarget = useCallback(
    (target: MutableRefObject<Object3D | null> | null) => {
      setFollowTarget(target);

      const unsubscribe = () => {
        setFollowTarget(null);
      };

      return unsubscribe;
    },
    [setFollowTarget],
  );

  const setCameraAngle = useCallback(
    (angle: CameraAngle) => {
      setAngle(angle);

      const unsubscribe = () => {
        setAngle("high");
      };

      return unsubscribe;
    },
    [setAngle],
  );

  return (
    <CameraContext.Provider
      value={{
        setCameraFollowTarget,
        setCameraAngle,
      }}
    >
      <Camera followTarget={followTarget} angle={cameraAngle} />
      {children}
    </CameraContext.Provider>
  );
};
