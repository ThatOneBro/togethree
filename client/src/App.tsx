import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  // Stats,
  // Text,
  AdaptiveDpr,
  AdaptiveEvents,
  // Sky,
  PositionalAudio,
  Environment,
  Preload,
  Sky,
  // OrbitControls,
} from "@react-three/drei";

import { SkyBox } from "./game/SkyBox";
import { InputsHandler } from "./game/InputsHandler";

import "./App.css";

function App() {
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
        {/* <Stats className="stats-panel" parent={statsParentRef} /> */}
        <Suspense fallback={null}>
          <SkyBox />
        </Suspense>
        {/* <Suspense fallback={null}>
          <group position={[0, 0, 0]}>
            <mesh position={[-52, 0, 52]}>
              <PositionalAudio url={OceanSound} distance={8} />
            </mesh>
            <mesh position={[52, 0, -52]}>
              <PositionalAudio url={OceanSound2} distance={8} />
            </mesh>
          </group>
        </Suspense> */}
        <InputsHandler>
          {/* {localPlayer && (
            <Player
              id={localPlayer.id}
              local
              playerData={localPlayer}
              ref={localPlayerRef}
            />
          )} */}
          {/* <Boombox
            setRadioOnState={setRadioOnState}
            radioState={radioState}
            fetchRadioOnState={fetchRadioOnState}
          /> */}
        </InputsHandler>
        <Preload all />
      </Canvas>
    </>
  );
}

export default App;
