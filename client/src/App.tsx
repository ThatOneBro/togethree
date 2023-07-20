import { useState, Suspense, useRef, useMemo, MutableRefObject } from "react";
import { Canvas } from "@react-three/fiber";
import {
  // Stats,
  Text,
  AdaptiveDpr,
  AdaptiveEvents,
  Preload,
} from "@react-three/drei";

import type { Group, Object3D } from "three";

import { CameraProvider } from "./game/camera/components/CameraProvider";
import { InputsHandler } from "./game/InputsHandler";
import {
  useSetCameraAngle,
  useSetCameraFollowTarget,
} from "./game/camera/hooks/camera-hooks";
import { SkyBox } from "./game/SkyBox";
import { Lights } from "./game/Lights";
import { Player } from "./game/Player";

import type { CameraAngle } from "./game/camera/config";

import "./App.css";

type CameraTarget = "player" | "ship" | "tower";
const cameraAngleConfig: Record<CameraTarget, CameraAngle> = {
  player: "high",
  ship: "ship",
  tower: "lowWide",
} as const;

function App() {
  const [localPlayer] = useState({ username: "Cool" });
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const localPlayerRef = useRef<Group>(null!);
  const [currentTarget, setCurrentTarget] = useState<CameraTarget | null>(
    "player",
  );

  const cameraTargets = useMemo<
    Record<CameraTarget, MutableRefObject<Object3D | null> | null>
  >(
    () => ({
      player: localPlayerRef,
      ship: null,
      tower: null,
    }),
    [localPlayerRef],
  );

  useSetCameraAngle(
    cameraAngleConfig[currentTarget as CameraTarget] || "head-on",
  );

  useSetCameraFollowTarget(
    cameraTargets[currentTarget as CameraTarget] || null,
  );

  return (
    <>
      <Canvas
        dpr={[1, 1.75]}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          // alpha: false,
          // gammaFactor: 2.2,
          // outputEncoding: THREE.sRGBEncoding,
        }}
        shadows
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <Suspense fallback={<Text>Testing</Text>}>
          {/* <Stats className="stats-panel" parent={statsParentRef} /> */}
          <SkyBox />
          <Lights />
          <CameraProvider>
            <InputsHandler>
              {localPlayer && (
                <Player
                  // id={localPlayer.id}
                  local
                  playerData={localPlayer}
                  ref={localPlayerRef}
                />
              )}
              {/* <Boombox
                setRadioOnState={setRadioOnState}
                radioState={radioState}
                fetchRadioOnState={fetchRadioOnState}
              /> */}
            </InputsHandler>
          </CameraProvider>
        </Suspense>
        <Preload all />
      </Canvas>
    </>
  );
}

export default App;
