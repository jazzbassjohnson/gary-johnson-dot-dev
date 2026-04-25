"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArcadeCabinet, GameCanvas, GameCanvasRef, GameOverModal } from "@/components/games";
import { useHighScores } from "@/hooks";

// Game constants
const CANVAS_WIDTH = 320;
const CANVAS_HEIGHT = 400;
const LANE_COUNT = 4;
const LANE_WIDTH = CANVAS_WIDTH / LANE_COUNT;
const NOTE_HEIGHT = 20;
const HIT_ZONE_Y = CANVAS_HEIGHT - 60;
const HIT_ZONE_HEIGHT = 30;

// Colors
const LANE_COLORS = ["#ff6b6b", "#4ecdc4", "#ffe66d", "#95e1d3"];
const COLORS = {
  background: "#0a0a0a",
  hitZone: "#333333",
  hitZoneActive: "#666666",
  text: "#ffffff",
  perfect: "#00ff00",
  great: "#ffff00",
  miss: "#ff0000",
};

// Keys for each lane
const LANE_KEYS = ["d", "f", "j", "k"];

// Musical notes for each lane (pentatonic scale - sounds good together)
const LANE_FREQUENCIES = [261.63, 329.63, 392.0, 523.25]; // C4, E4, G4, C5

// Audio context helper
class AudioManager {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;

  init() {
    if (this.audioContext) return;
    this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0.3;
    this.gainNode.connect(this.audioContext.destination);
  }

  playNote(frequency: number, duration: number = 0.15) {
    if (!this.audioContext || !this.gainNode) return;

    const oscillator = this.audioContext.createOscillator();
    const noteGain = this.audioContext.createGain();

    oscillator.type = "square"; // Retro 8-bit sound
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

    noteGain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    noteGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.connect(noteGain);
    noteGain.connect(this.gainNode);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  playHitSound(rating: string, laneIndex: number) {
    const baseFreq = LANE_FREQUENCIES[laneIndex];
    const duration = rating === "PERFECT" ? 0.2 : rating === "GREAT" ? 0.15 : 0.1;
    this.playNote(baseFreq, duration);

    // Add harmony for perfect hits
    if (rating === "PERFECT") {
      setTimeout(() => this.playNote(baseFreq * 1.5, 0.1), 50);
    }
  }

  playMissSound() {
    if (!this.audioContext || !this.gainNode) return;

    const oscillator = this.audioContext.createOscillator();
    const noteGain = this.audioContext.createGain();

    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(100, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.2);

    noteGain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    noteGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

    oscillator.connect(noteGain);
    noteGain.connect(this.gainNode);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }

  playBeatPulse(beatIndex: number) {
    if (!this.audioContext || !this.gainNode) return;

    // Subtle bass pulse on the beat
    const oscillator = this.audioContext.createOscillator();
    const noteGain = this.audioContext.createGain();

    oscillator.type = "sine";
    const freq = beatIndex % 4 === 0 ? 80 : 60; // Accent every 4th beat
    oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);

    noteGain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    noteGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

    oscillator.connect(noteGain);
    noteGain.connect(this.gainNode);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }
}

interface Note {
  id: number;
  lane: number;
  y: number;
  hit: boolean;
  missed: boolean;
}

interface GameState {
  notes: Note[];
  score: number;
  combo: number;
  maxCombo: number;
  health: number;
  gameOver: boolean;
  started: boolean;
  lastHitRating: string | null;
  ratingTimer: number;
  activeLanes: boolean[];
  noteIdCounter: number;
  spawnTimer: number;
  beatTimer: number;
  beatCount: number;
}

const createInitialState = (): GameState => ({
  notes: [],
  score: 0,
  combo: 0,
  maxCombo: 0,
  health: 100,
  gameOver: false,
  started: false,
  lastHitRating: null,
  ratingTimer: 0,
  activeLanes: [false, false, false, false],
  noteIdCounter: 0,
  spawnTimer: 0,
  beatTimer: 0,
  beatCount: 0,
});

export default function RhythmKeysPage() {
  const canvasRef = useRef<GameCanvasRef>(null);
  const gameStateRef = useRef<GameState>(createInitialState());
  const [displayState, setDisplayState] = useState({ score: 0, gameOver: false, started: false });
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const { addScore, getTopScore, isHighScore } = useHighScores();
  const highScore = getTopScore("rhythm-keys");
  const animationFrameRef = useRef<number | null>(null);
  const audioManagerRef = useRef<AudioManager | null>(null);

  const syncDisplayState = useCallback(() => {
    const state = gameStateRef.current;
    setDisplayState({
      score: state.score,
      gameOver: state.gameOver,
      started: state.started,
    });
  }, []);

  const resetGame = useCallback(() => {
    gameStateRef.current = createInitialState();
    setScoreSubmitted(false);
    syncDisplayState();
  }, [syncDisplayState]);

  const startGame = useCallback(() => {
    // Initialize audio on user interaction
    if (!audioManagerRef.current) {
      audioManagerRef.current = new AudioManager();
    }
    audioManagerRef.current.init();
    gameStateRef.current.started = true;
    syncDisplayState();
  }, [syncDisplayState]);

  const handleSubmitScore = useCallback((name: string) => {
    addScore("rhythm-keys", gameStateRef.current.score, name);
    setScoreSubmitted(true);
  }, [addScore]);

  const handleKeyPress = useCallback((laneIndex: number) => {
    const state = gameStateRef.current;
    if (!state.started || state.gameOver) return;

    state.activeLanes[laneIndex] = true;

    // Find closest unhit note in lane within hit zone
    const notesInLane = state.notes.filter(
      (n) => n.lane === laneIndex && !n.hit && !n.missed
    );

    if (notesInLane.length === 0) return;

    const closestNote = notesInLane.reduce((closest, note) => {
      const noteDistance = Math.abs(note.y - HIT_ZONE_Y);
      const closestDistance = Math.abs(closest.y - HIT_ZONE_Y);
      return noteDistance < closestDistance ? note : closest;
    });

    const distance = Math.abs(closestNote.y - HIT_ZONE_Y);

    if (distance > HIT_ZONE_HEIGHT * 2) return;

    let rating: string;
    let scoreAdd: number;

    if (distance < 10) {
      rating = "PERFECT";
      scoreAdd = 100;
    } else if (distance < 25) {
      rating = "GREAT";
      scoreAdd = 75;
    } else if (distance < 40) {
      rating = "GOOD";
      scoreAdd = 50;
    } else {
      rating = "OK";
      scoreAdd = 25;
    }

    closestNote.hit = true;
    state.combo += 1;
    state.maxCombo = Math.max(state.maxCombo, state.combo);
    const multiplier = Math.min(Math.floor(state.combo / 10) + 1, 4);
    state.score += scoreAdd * multiplier;
    state.health = Math.min(state.health + 2, 100);
    state.lastHitRating = rating;
    state.ratingTimer = 0.5;

    // Play hit sound
    audioManagerRef.current?.playHitSound(rating, laneIndex);

    syncDisplayState();
  }, [syncDisplayState]);

  const handleKeyRelease = useCallback((laneIndex: number) => {
    gameStateRef.current.activeLanes[laneIndex] = false;
  }, []);

  // Game loop
  useEffect(() => {
    let lastTime = 0;
    const BPM = 120;
    const spawnInterval = 60 / BPM;
    const beatInterval = 60 / BPM;
    const noteSpeed = 200;

    const gameLoop = (currentTime: number) => {
      if (!lastTime) lastTime = currentTime;
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      const state = gameStateRef.current;
      const canvas = canvasRef.current;

      if (state.started && !state.gameOver) {
        // Update rating timer
        if (state.ratingTimer > 0) {
          state.ratingTimer -= deltaTime;
          if (state.ratingTimer <= 0) {
            state.lastHitRating = null;
          }
        }

        // Beat pulse for background rhythm
        state.beatTimer += deltaTime;
        if (state.beatTimer >= beatInterval) {
          state.beatTimer = 0;
          state.beatCount++;
          audioManagerRef.current?.playBeatPulse(state.beatCount);
        }

        // Spawn notes
        state.spawnTimer += deltaTime;
        if (state.spawnTimer >= spawnInterval) {
          state.spawnTimer = 0;
          if (Math.random() > 0.6) {
            const lane = Math.floor(Math.random() * LANE_COUNT);
            state.notes.push({
              id: state.noteIdCounter++,
              lane,
              y: -NOTE_HEIGHT,
              hit: false,
              missed: false,
            });
          }
        }

        // Update notes
        for (const note of state.notes) {
          if (note.hit || note.missed) continue;
          note.y += noteSpeed * deltaTime;

          if (note.y > CANVAS_HEIGHT) {
            note.missed = true;
            state.health -= 10;
            state.combo = 0;
            audioManagerRef.current?.playMissSound();

            if (state.health <= 0) {
              state.health = 0;
              state.gameOver = true;
              syncDisplayState();
            }
          }
        }

        // Remove old notes
        state.notes = state.notes.filter((n) => n.y < CANVAS_HEIGHT + NOTE_HEIGHT);
      }

      // Render
      if (canvas?.ctx) {
        const ctx = canvas.ctx;

        ctx.fillStyle = COLORS.background;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw lanes
        for (let i = 0; i < LANE_COUNT; i++) {
          const x = i * LANE_WIDTH;
          ctx.fillStyle = state.activeLanes[i]
            ? `${LANE_COLORS[i]}33`
            : `${LANE_COLORS[i]}11`;
          ctx.fillRect(x, 0, LANE_WIDTH, CANVAS_HEIGHT);

          ctx.strokeStyle = LANE_COLORS[i];
          ctx.lineWidth = 1;
          ctx.strokeRect(x, 0, LANE_WIDTH, CANVAS_HEIGHT);
        }

        // Draw hit zone
        for (let i = 0; i < LANE_COUNT; i++) {
          const x = i * LANE_WIDTH;
          ctx.fillStyle = state.activeLanes[i] ? COLORS.hitZoneActive : COLORS.hitZone;
          ctx.fillRect(x + 2, HIT_ZONE_Y, LANE_WIDTH - 4, HIT_ZONE_HEIGHT);

          ctx.fillStyle = LANE_COLORS[i];
          ctx.font = "bold 16px monospace";
          ctx.textAlign = "center";
          ctx.fillText(LANE_KEYS[i].toUpperCase(), x + LANE_WIDTH / 2, HIT_ZONE_Y + HIT_ZONE_HEIGHT / 2 + 6);
        }

        // Draw notes
        for (const note of state.notes) {
          if (note.hit || note.missed) continue;
          const x = note.lane * LANE_WIDTH + 4;
          ctx.fillStyle = LANE_COLORS[note.lane];
          ctx.fillRect(x, note.y, LANE_WIDTH - 8, NOTE_HEIGHT);
        }

        // Draw health bar
        ctx.fillStyle = "#333";
        ctx.fillRect(10, 10, 100, 10);
        ctx.fillStyle = state.health > 30 ? "#00ff00" : "#ff0000";
        ctx.fillRect(10, 10, state.health, 10);

        // Draw combo
        if (state.combo > 0) {
          ctx.fillStyle = COLORS.text;
          ctx.font = "bold 14px monospace";
          ctx.textAlign = "center";
          ctx.fillText(`${state.combo}x COMBO`, CANVAS_WIDTH / 2, 30);
        }

        // Draw rating
        if (state.lastHitRating) {
          ctx.fillStyle =
            state.lastHitRating === "PERFECT" ? COLORS.perfect :
            state.lastHitRating === "GREAT" ? COLORS.great : COLORS.text;
          ctx.font = "bold 20px monospace";
          ctx.textAlign = "center";
          ctx.fillText(state.lastHitRating, CANVAS_WIDTH / 2, HIT_ZONE_Y - 20);
        }

        // Draw start screen
        if (!state.started) {
          ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
          ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

          ctx.fillStyle = COLORS.text;
          ctx.font = "bold 16px monospace";
          ctx.textAlign = "center";
          ctx.fillText("RHYTHM KEYS", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);

          ctx.font = "10px monospace";
          ctx.fillText("Hit the notes as they", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 10);
          ctx.fillText("reach the target zone!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 5);

          ctx.fillStyle = "#ffff00";
          ctx.fillText("Keys: D  F  J  K", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);

          ctx.fillStyle = "#00ff00";
          ctx.fillText("Press SPACE to start", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60);
        }
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [syncDisplayState]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        if (!gameStateRef.current.started) startGame();
        else if (gameStateRef.current.gameOver) resetGame();
        return;
      }

      const laneIndex = LANE_KEYS.indexOf(e.key.toLowerCase());
      if (laneIndex !== -1) {
        e.preventDefault();
        handleKeyPress(laneIndex);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const laneIndex = LANE_KEYS.indexOf(e.key.toLowerCase());
      if (laneIndex !== -1) {
        handleKeyRelease(laneIndex);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyPress, handleKeyRelease, startGame, resetGame]);

  return (
    <div className="min-h-screen theme-arcade py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" asChild className="text-games hover:text-accent">
            <Link href="/games">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Arcade
            </Link>
          </Button>
        </div>

        <ArcadeCabinet
          title="RHYTHM KEYS"
          score={displayState.score}
          highScore={highScore}
        >
          <div className="relative flex items-center justify-center p-4">
            <GameCanvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              scale={1.5}
            />

            <GameOverModal
              isOpen={displayState.gameOver}
              score={displayState.score}
              highScore={highScore}
              isNewHighScore={isHighScore("rhythm-keys", displayState.score)}
              onRestart={resetGame}
              onSubmitScore={handleSubmitScore}
              scoreSubmitted={scoreSubmitted}
            />
          </div>
        </ArcadeCabinet>

        <div className="mt-6 text-center">
          <p className="text-games/70 text-sm mb-2" style={{ fontFamily: "var(--font-pixel), monospace" }}>
            CONTROLS
          </p>
          <p className="text-games/50 text-xs">
            D, F, J, K keys to hit notes | SPACE to start/restart
          </p>
        </div>

        {/* Mobile Controls */}
        <div className="mt-6 grid grid-cols-4 gap-2 max-w-[320px] mx-auto md:hidden">
          {LANE_KEYS.map((key, i) => (
            <Button
              key={key}
              variant="outline"
              className="h-16 text-lg font-bold"
              style={{ borderColor: LANE_COLORS[i], color: LANE_COLORS[i] }}
              onTouchStart={() => handleKeyPress(i)}
              onTouchEnd={() => handleKeyRelease(i)}
              onMouseDown={() => handleKeyPress(i)}
              onMouseUp={() => handleKeyRelease(i)}
            >
              {key.toUpperCase()}
            </Button>
          ))}
        </div>

        {!displayState.started && (
          <div className="mt-4 text-center md:hidden">
            <Button variant="arcade" onClick={startGame}>
              START GAME
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
