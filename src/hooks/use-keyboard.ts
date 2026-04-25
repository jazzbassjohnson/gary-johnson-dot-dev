"use client";

import { useCallback, useEffect, useRef } from "react";

type KeyHandler = () => void;
type KeyMap = Record<string, KeyHandler>;

interface UseKeyboardOptions {
  keyMap: KeyMap;
  enabled?: boolean;
  preventDefault?: boolean;
}

export function useKeyboard({
  keyMap,
  enabled = true,
  preventDefault = true,
}: UseKeyboardOptions) {
  const keyMapRef = useRef(keyMap);

  // Update ref when keyMap changes
  useEffect(() => {
    keyMapRef.current = keyMap;
  }, [keyMap]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const handler = keyMapRef.current[event.key] || keyMapRef.current[event.code];

      if (handler) {
        if (preventDefault) {
          event.preventDefault();
        }
        handler();
      }
    },
    [enabled, preventDefault]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
}

// Hook for continuous key detection (useful for games)
export function useKeyboardState(keys: string[]): Record<string, boolean> {
  const keysPressed = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (keys.includes(event.key) || keys.includes(event.code)) {
        keysPressed.current[event.key] = true;
        keysPressed.current[event.code] = true;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (keys.includes(event.key) || keys.includes(event.code)) {
        keysPressed.current[event.key] = false;
        keysPressed.current[event.code] = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [keys]);

  return keysPressed.current;
}
