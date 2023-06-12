import { useCallback, useEffect, useRef } from "react";
import type { AnimationAction, AnimationMixer, Event } from "three";

export const useHandleAnimation = (
  actions: Record<string, AnimationAction | null>,
  mixer: AnimationMixer,
  moving: boolean,
  jumping: boolean,
) => {
  const currentAnimationRef = useRef<{
    key: string | null;
    animation: AnimationAction | null;
    finished: boolean;
    delayTimer: NodeJS.Timeout | null;
  }>({
    key: null,
    animation: null,
    finished: false,
    delayTimer: null,
  });

  const playAnimation = useCallback(
    (
      animation: AnimationAction,
      fadeInDuration: number,
      fadeDuration: number,
      key: string,
      {
        delay = 0,
        playOnce = false,
        onEnd = null,
      }: {
        delay?: number;
        playOnce?: boolean;
        onEnd?: (() => void) | null;
      } = {},
    ) => {
      const currentAnimation = currentAnimationRef.current;
      if (currentAnimation.animation) {
        if (!animation) {
          if (currentAnimation.key === "jump")
            currentAnimation.animation.repetitions = 1;
          return;
        }
        currentAnimation.animation.fadeOut(fadeDuration);
      } else {
        // eslint-disable-next-line no-param-reassign
        fadeInDuration = 0;
      }

      if (!animation) return;

      if (currentAnimation.delayTimer) {
        clearTimeout(currentAnimation.delayTimer);
        currentAnimation.delayTimer = null;
      }

      if (delay) {
        currentAnimation.delayTimer = setTimeout(() => {
          playAnimation(animation, fadeInDuration, fadeDuration, key);
        }, delay);
        return;
      }

      animation.reset().setEffectiveWeight(1).fadeIn(fadeInDuration);

      // eslint-disable-next-line no-param-reassign
      animation.repetitions = playOnce ? 1 : Infinity;
      animation.play();

      currentAnimation.animation = animation;
      currentAnimation.key = key;
      currentAnimation.finished = false;

      if (onEnd) {
        const listener = (e: Event) => {
          if (e.action === animation) {
            onEnd();
            mixer.removeEventListener("finished", listener);
          }
        };
        mixer.addEventListener("finished", listener);
      }
    },
    [currentAnimationRef, mixer],
  );

  useEffect(() => {
    if (jumping) {
      playAnimation(actions.Jump!, 250 / 1000, 250 / 1000, "jump");
    } else {
      if (moving) {
        playAnimation(actions.Running!, 250 / 1000, 250 / 1000, "walk");
      } else {
        // @ts-ignore
        playAnimation(null);
        // playAnimation(actions.Standing, 250 / 1000, 250 / 1000, 'standing', { playOnce: true });
        playAnimation(actions.Idle!, 250 / 1000, 250 / 1000, "idle", {
          delay: 5000,
        });
      }
    }
  }, [actions, mixer, moving, jumping, playAnimation]);
};
