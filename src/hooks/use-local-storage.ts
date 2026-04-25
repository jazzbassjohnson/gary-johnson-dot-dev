"use client";

import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}

// Score entry with name
export interface ScoreEntry {
  name: string;
  score: number;
  date: string;
}

// High scores with names
interface HighScores {
  "code-snake": ScoreEntry[];
  "rhythm-keys": ScoreEntry[];
  "style-rush": ScoreEntry[];
}

const DEFAULT_SCORES: HighScores = {
  "code-snake": [],
  "rhythm-keys": [],
  "style-rush": [],
};

export function useHighScores() {
  const [scores, setScores] = useLocalStorage<HighScores>(
    "gary-arcade-scores-v2",
    DEFAULT_SCORES
  );

  const addScore = useCallback(
    (game: keyof HighScores, score: number, name: string = "AAA") => {
      setScores((prev) => {
        const entry: ScoreEntry = {
          name: name.toUpperCase().slice(0, 3) || "AAA",
          score,
          date: new Date().toISOString(),
        };

        const gameScores = [...prev[game], entry]
          .sort((a, b) => b.score - a.score)
          .slice(0, 10); // Keep top 10

        return {
          ...prev,
          [game]: gameScores,
        };
      });
    },
    [setScores]
  );

  const getTopScore = useCallback(
    (game: keyof HighScores): number => {
      return scores[game][0]?.score || 0;
    },
    [scores]
  );

  const getScores = useCallback(
    (game: keyof HighScores): ScoreEntry[] => {
      return scores[game];
    },
    [scores]
  );

  const isHighScore = useCallback(
    (game: keyof HighScores, score: number): boolean => {
      const gameScores = scores[game];
      if (gameScores.length < 10) return score > 0;
      return score > (gameScores[gameScores.length - 1]?.score || 0);
    },
    [scores]
  );

  return {
    scores,
    addScore,
    getTopScore,
    getScores,
    isHighScore,
  };
}
