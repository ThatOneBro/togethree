import { useRef } from "react";
import { CameraHelper } from "three";
import { useHelper } from "@react-three/drei";

import type { Light, LightShadow, Camera } from "three";

export const ShadowHelper = ({
  light,
}: {
  light: Light<LightShadow<Camera>>;
}) => {
  const ref = useRef(light.shadow.camera);

  useHelper(ref, CameraHelper);

  return null;
};
