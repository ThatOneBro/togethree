import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import type { MutableRefObject } from "react";
import type { RootState } from "@react-three/fiber";

import { lerpRadians } from "~/util/angles";
import {
  fovConfig,
  posConfig,
  angleConfig,
  rotationConfig,
} from "~/game/camera/config";

import type {
  CameraAngle,
  CameraFov,
  CameraPosition,
  CameraRotation,
} from "~/game/camera/config";

const PROJECTION_UPDATE_RATE = 3;
const newCameraPos = new THREE.Vector3();
const followTargetPos = new THREE.Vector3();
const lastLookAtPos = new THREE.Vector3();

const getNewCameraFov = (angle: CameraAngle) => {
  return fovConfig[angle as CameraFov] ?? fovConfig.default;
};

const getNewCameraPos = (angle: CameraAngle, yPos: number) => {
  const pos = posConfig[angle as CameraPosition] ?? posConfig.default;
  return newCameraPos.set(pos.x, yPos, pos.z);
};

export const useFollow = (
  followTargetRef: MutableRefObject<THREE.Object3D | null> | null,
  groupRef: MutableRefObject<THREE.Group | null>,
  cameraRef: MutableRefObject<THREE.PerspectiveCamera | null>,
  angle: CameraAngle,
  lightRef: MutableRefObject<THREE.DirectionalLight | null>,
) => {
  const callCounterRef = useRef<number>(0);

  const onFrame = (_: RootState, delta: number) => {
    const followTarget = followTargetRef?.current ?? null;
    if (!followTarget) return;

    const group = groupRef.current;
    if (!group) return;

    followTarget.getWorldPosition(followTargetPos);

    const yPos = angleConfig[angle as CameraAngle] || followTargetPos.y;

    group.position.lerp(followTargetPos, 1 - 0.000037 ** delta);
    // group.position.lerp(followTargetPos, 0.15);
    group.rotation.y = lerpRadians(
      group.rotation.y,
      rotationConfig[angle as CameraRotation] || rotationConfig.default,
      // 0.15,
      1 - 0.000037 ** delta,
    );

    const camera = cameraRef.current;
    if (camera) {
      camera.position.lerp(getNewCameraPos(angle, yPos), 1 - 0.000037 ** delta);
      // camera.position.lerp(getNewCameraPos(angle, yPos), 0.15);
      // camera.lookAt(lastLookAtPos.x ? lastLookAtPos.lerp(group.position, 0.15) : group.position);
      camera.lookAt(
        lastLookAtPos.x
          ? lastLookAtPos.lerp(group.position, 1 - 0.000037 ** delta)
          : group.position,
      );

      camera.fov = THREE.MathUtils.lerp(
        camera.fov,
        getNewCameraFov(angle),
        1 - 0.000037 ** delta,
      );

      if (callCounterRef.current % PROJECTION_UPDATE_RATE === 0) {
        camera.updateProjectionMatrix();
      }
    }

    if (lightRef && lightRef.current) {
      const light = lightRef.current;
      light.target.position.x = group.position.x;
      light.target.position.y = group.position.y;
      light.target.position.z = group.position.z;
      light.target.updateMatrixWorld();
    }
  };

  useFrame(onFrame);
};
