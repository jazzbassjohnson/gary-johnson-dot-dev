"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseGameLoopOptions {
  fps?: number;
  onUpdate: (deltaTime: number) => void;
  onRender?: () => void;
}

interface GameLoopControls {
  start: () => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  isRunning: boolean;
  isPaused: boolean;
}

export function useGameLoop({
  fps = 60,
  onUpdate,
  onRender,
}: UseGameLoopOptions): GameLoopControls {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const accumulatorRef = useRef<number>(0);

  const frameTime = 1000 / fps;

  const gameLoop = useCallback(
    (currentTime: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = currentTime;
      }

      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      accumulatorRef.current += deltaTime;

      // Fixed timestep update
      while (accumulatorRef.current >= frameTime) {
        onUpdate(frameTime / 1000); // Convert to seconds
        accumulatorRef.current -= frameTime;
      }

      // Render
      if (onRender) {
        onRender();
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    },
    [frameTime, onUpdate, onRender]
  );

  const start = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    setIsPaused(false);
    lastTimeRef.current = 0;
    accumulatorRef.current = 0;
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [isRunning, gameLoop]);

  const stop = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsRunning(false);
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    if (!isRunning || isPaused) return;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsPaused(true);
  }, [isRunning, isPaused]);

  const resume = useCallback(() => {
    if (!isRunning || !isPaused) return;
    setIsPaused(false);
    lastTimeRef.current = 0;
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [isRunning, isPaused, gameLoop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    start,
    stop,
    pause,
    resume,
    isRunning,
    isPaused,
  };
}
