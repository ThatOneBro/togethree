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
