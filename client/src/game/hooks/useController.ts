import { useCallback, useRef } from "react";
import { useFrame } from "@react-three/fiber";

import { Vec2 } from "@togethree/util";

import type { RefObject } from "react";
import type { Group, Vector3 } from "three";
import type { RenderCallback, RootState } from "@react-three/fiber";

import { controllerState } from "../../state/inputs";
import { degToRad, lerpRadians, vectorToAngle } from "../../util/angles";

const velocity = new Vec2(0, 0);

export type ControllerState = {
  position: Vector3;
  moving: boolean;
  jumping: boolean;
};

export const useController = (
  // uuid: string,
  // ref: RefObject<Group>,
  innerRef: RefObject<Group>,
  localState: ControllerState,
) => {
  const localRef = useRef({
    angle: degToRad(-45),
    lastVel: { x: 0, y: 0 },
    currentVel: { x: 0, y: 0 },
  });

  const getMoveVelocity = useCallback(() => {
    // if (joystickState.active) {
    //   localRef.current.currentVel.x = -joystickState.xVel;
    //   localRef.current.currentVel.y = joystickState.yVel;
    // } else {
    localRef.current.currentVel.x = -controllerState.horizontal;
    localRef.current.currentVel.y = controllerState.vertical;
    // }
    return localRef.current.currentVel;
  }, []);

  const onFrame = useCallback(
    (_: RootState, delta: number) => {
      const { x: xVel, y: yVel } = getMoveVelocity();
      const moving = xVel !== 0 || yVel !== 0;
      let newAngle = localRef.current.angle;

      if (moving) {
        const angle = vectorToAngle(xVel, yVel);
        localRef.current.angle = angle;
        newAngle = angle;
      }

      if (innerRef.current) {
        // eslint-disable-next-line no-param-reassign
        innerRef.current.rotation.y = lerpRadians(
          innerRef.current.rotation.y,
          newAngle,
          delta * 10,
        );
      }

      localState.moving = moving;
      localState.jumping = controllerState.jumping;

      if (!xVel && !yVel) {
        localRef.current.lastVel.x = 0;
        localRef.current.lastVel.y = 0;
        return;
      }

      velocity.set(xVel * 1500 * delta, yVel * 1500 * delta);
      localRef.current.lastVel.x = xVel;
      localRef.current.lastVel.y = yVel;
    },
    [innerRef, localRef, getMoveVelocity, localState],
  ) satisfies RenderCallback;

  useFrame(onFrame);
};
