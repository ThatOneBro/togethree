import { useLayoutEffect, useRef } from "react";
import { PerspectiveCamera } from "@react-three/drei";

import type {
  PerspectiveCamera as PerspectiveCam,
  Object3D,
  Group,
  DirectionalLight,
} from "three";
import type { MutableRefObject } from "react";

import { useFollow } from "~/game/camera/hooks/use-follow";
import type { CameraAngle } from "../config";

// const portraitConfig = {
//   top: 3,
//   left: -3,
//   right: 1,
//   bottom: -1,
//   horizontalRatio: 7,
//   verticalRatio: 4,
// };

// const landscapeConfig = {
//   top: 1,
//   left: -1,
//   right: 2,
//   bottom: -2,
//   horizontalRatio: 10,
//   verticalRatio: 8,
// };

export const Camera = ({
  followTarget,
  angle,
}: {
  followTarget: MutableRefObject<Object3D | null> | null;
  angle: CameraAngle;
}) => {
  const groupRef = useRef<Group | null>(null);
  const lightRef = useRef<DirectionalLight | null>(null);
  const cameraRef = useRef<PerspectiveCam | null>(null);

  useLayoutEffect(() => {
    if (!cameraRef.current) return;
    cameraRef.current.up.set(0, 1, 0);
    cameraRef.current.lookAt(0, 50 + 1, 0);
    cameraRef.current.updateProjectionMatrix();
  }, []);

  useFollow(followTarget, groupRef, cameraRef, angle, lightRef);

  // const {top, left, right, bottom} = useTweaks({
  //     top: 1,
  //     left: -1,
  //     right: 1,
  //     bottom: -1,
  // })
  //
  // const {horizontalRatio, verticalRation} = useTweaks({
  //     horizontalRatio: 10,
  //     verticalRation: 8,
  // })
  //
  // // 1, -1, 1, -1
  // // 10, 8

  // const [width, height] = useWindowSize();

  // const ratio = width / height;

  // const config = width > height ? landscapeConfig : portraitConfig;
  // const { top, left, right, bottom, horizontalRatio, verticalRatio } = config;

  return (
    <group ref={groupRef}>
      <PerspectiveCamera
        ref={cameraRef}
        position={[-15, 15, 15]}
        fov={25}
        far={500}
        makeDefault
      />
    </group>
  );
};
