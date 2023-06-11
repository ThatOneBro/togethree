import { useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Vec2 } from "@togethree/util";

import type { ReactNode } from "react";

import { degToRad, vectorToAngle } from "../util/angles";
import {
  controllerState,
  rawInputState,
  updateKeyState,
} from "../state/inputs";
import { angleToVector } from "../util/vectors";
import { INPUT_CONFIG, INPUT_CODE_TO_KEY } from "../config/inputs";

import type { InputKey, ValidInputCode } from "../config/inputs";

const vector = new Vec2(0, 0);

function isKeyActive(key: InputKey): boolean {
  // Get key codes for this key
  const keys = INPUT_CONFIG[key];
  // Find is one of the mappings is currently active
  for (let i = 0; i < keys.length; i += 1) {
    if (rawInputState[INPUT_CODE_TO_KEY[keys[i]]]) {
      return true;
    }
  }
  return false;
}

function calculateControllerInput() {
  const up = isKeyActive("up");
  const down = isKeyActive("down");
  const left = isKeyActive("left");
  const right = isKeyActive("right");
  const jump = isKeyActive("jump");

  const vertical = up ? 1 : down ? -1 : 0;
  const horizontal = right ? 1 : left ? -1 : 0;

  if (vertical !== 0 || horizontal !== 0) {
    vector.set(horizontal, vertical);

    const originalAngle = vectorToAngle(horizontal, vertical);
    const rotatedAngle = originalAngle + degToRad(45);
    const [xVel, yVel] = angleToVector(rotatedAngle);

    controllerState.active = true;
    controllerState.horizontal = xVel * -1;
    controllerState.vertical = yVel * -1;
  } else {
    controllerState.active = false;
    controllerState.horizontal = 0;
    controllerState.vertical = 0;
  }
  controllerState.jumping = jump;
}

export const InputsHandler = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const keyDownListener = (e: KeyboardEvent) => {
      const key = INPUT_CODE_TO_KEY[e.keyCode as ValidInputCode];
      if (key !== undefined) {
        updateKeyState(key, true);
      }
    };
    const keyUpListener = (e: KeyboardEvent) => {
      const key = INPUT_CODE_TO_KEY[e.keyCode as ValidInputCode];
      if (key !== undefined) {
        updateKeyState(key, false);
      }
    };
    document.addEventListener("keydown", keyDownListener);
    document.addEventListener("keyup", keyUpListener);

    return () => {
      document.removeEventListener("keydown", keyDownListener);
      document.removeEventListener("keyup", keyUpListener);
    };
  }, []);
  useFrame(calculateControllerInput);
  return <>{children}</>;
};
