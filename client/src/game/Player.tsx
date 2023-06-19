import { useState, useRef, forwardRef } from "react";
import { Html } from "@react-three/drei";
import { proxy } from "valtio";
import { Vector3 } from "three";

import type { ForwardedRef, MutableRefObject } from "react";
import type { Group } from "three";

import { Robot } from "./models/Robot/Robot";
import { useController } from "./hooks/use-controller";

import type { ControllerState } from "./hooks/use-controller";

const LocalController = ({
  // id,
  // fwdRef,
  innerRef,
  localState,
}: {
  // id: string;
  // fwdRef: MutableRefObject<Group>;
  innerRef: MutableRefObject<Group>;
  localState: ControllerState;
}) => {
  useController(innerRef, localState);
  return null;
};

type PlayerData = { username: string };

function useLocalState() {
  const [state] = useState(
    proxy<ControllerState>({
      position: new Vector3(),
      moving: false,
      jumping: false,
    }),
  );
  return state;
}

export const Player = forwardRef(
  (
    {
      id = "localPlayer",
      local = false,
      playerData = null,
      // position,
      fwdInnerRef,
    }: {
      id?: string;
      local: boolean;
      playerData: PlayerData | null;
      // position: [number, number, number];
      fwdInnerRef?: MutableRefObject<Group> | null;
    },
    ref: ForwardedRef<Group> | null,
  ) => {
    const localStateProxy = useLocalState();
    // const localState = useSnapshot(localStateProxy);

    const localRef = useRef<Group>(null!);
    const usedRef = (ref as MutableRefObject<Group>) || localRef;
    const innerRef = useRef<Group>(null!);
    const usedInnerRef = fwdInnerRef || innerRef;

    return (
      <>
        {/* {local ? ( */}
        {local ? (
          <LocalController
            // id={id}
            // fwdRef={usedRef}
            innerRef={usedInnerRef}
            localState={localStateProxy}
          />
        ) : // ) : (
        //   <RemotePlayerController
        //     id={id}
        //     fwdRef={usedRef}
        //     innerRef={usedInnerRef}
        //     walking={playerData.walking || false}
        //     jumping={playerData.jumping || false}
        //     localState={localState}
        //     snapshotRef={snapshotRef}
        //   />
        null}
        <group ref={usedRef} position={localStateProxy.position}>
          {/* {local && (
            <PlayerEditor
              id={id}
              playerData={playerData}
              updatePreview={updatePreview}
            />
          )} */}
          {playerData && (
            <group position={[0, 3.25, 0]}>
              <Html center>
                <div
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    paddingLeft: "5px",
                    paddingRight: "5px",
                    paddingTop: 2,
                    paddingBottom: 2,
                    borderRadius: 3,
                    // color: TEXT_COLORS[playerData.appearance.color],
                    color: "#eee",
                    fontSize: 13,
                    fontWeight: 400,
                    fontFamily: "Inter",
                    userSelect: "none",
                    position: "relative",
                  }}
                >
                  {playerData.username}
                </div>
              </Html>
            </group>
          )}
          {/* {message && (
            <group position={[0.75, 3.25, 0.75]}>
              <Html>
                <div
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    minHeight: "60px",
                    padding: "10px 15px",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: 14,
                    position: "relative",
                    overflow: "auto",
                  }}
                >
                  {playerData && (
                    <h2
                      className="player-name"
                      style={{
                        color: TEXT_COLORS[playerData.appearance.color],
                        fontWeight: 500,
                        padding: 0,
                        display: "inline-block",
                      }}
                    >
                      {playerData.user.username}
                    </h2>
                  )}
                  <div style={{ display: "flex", maxWidth: "300px" }}>
                    <p
                      style={{
                        display: "inline-block",
                        wordWrap: "break-word",
                        flex: 1,
                      }}
                    >
                      {message.content}
                    </p>
                  </div>
                </div>
              </Html>
            </group>
          )} */}
          <group ref={usedInnerRef}>
            <Robot
              color="blue"
              moving={localStateProxy.moving}
              jumping={localStateProxy.jumping}
              // scale={[playerWide ? 0.6 : 0.3, 0.3, 0.3]}
              // hat={playerHat}
            />
          </group>
        </group>
      </>
    );
  },
);
