import { useState, Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  // Stats,
  Text,
  AdaptiveDpr,
  AdaptiveEvents,
  // Sky,
  // PositionalAudio,
  // Environment,
  Preload,
  // OrbitControls,
} from "@react-three/drei";

import type { Group } from "three";

import { InputsHandler } from "./game/InputsHandler";
import { SkyBox } from "./game/SkyBox";
import { Lights } from "./game/Lights";
import { Player } from "./game/Player";

import "./App.css";

function App() {
  const [localPlayer] = useState({ username: "Cool" });
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const localPlayerRef = useRef<Group>(null!);
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
        </Suspense>
        <Preload all />
      </Canvas>
    </>
  );
}

export default App;
