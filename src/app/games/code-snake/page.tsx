"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArcadeCabinet, GameCanvas, GameCanvasRef, GameOverModal } from "@/components/games";
import { useHighScores } from "@/hooks";

// Game constants
const CANVAS_WIDTH = 320;
const CANVAS_HEIGHT = 240;
const GRID_SIZE = 16;
const COLS = CANVAS_WIDTH / GRID_SIZE;
const ROWS = CANVAS_HEIGHT / GRID_SIZE;
const INITIAL_SPEED = 7.2; // 10% slower than original 8

// Colors (retro palette)
const COLORS = {
  background: "#0a0a0a",
  snake: "#00ff00",
  snakeHead: "#00ff88",
  food: "#00ffff",
  bug: "#ff0000",
  text: "#00ff00",
  grid: "#111111",
};

// Code symbols for collectibles
const CODE_SYMBOLS = ["{ }", "[ ]", "< >", "=>", "( )", "//"];

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Point = { x: number; y: number };

interface GameState {
  snake: Point[];
  direction: Direction;
  nextDirection: Direction;
  food: Point & { symbol: string };
  bugs: Point[];
  score: number;
  gameOver: boolean;
  started: boolean;
  speed: number;
}

const getRandomPosition = (snake: Point[], bugs: Point[]): Point => {
  let pos: Point;
  do {
    pos = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
  } while (
    snake.some((s) => s.x === pos.x && s.y === pos.y) ||
    bugs.some((b) => b.x === pos.x && b.y === pos.y)
  );
  return pos;
};

const createInitialState = (): GameState => ({
  snake: [{ x: 10, y: 7 }],
  direction: "RIGHT",
  nextDirection: "RIGHT",
  food: {
    ...getRandomPosition([{ x: 10, y: 7 }], []),
    symbol: CODE_SYMBOLS[Math.floor(Math.random() * CODE_SYMBOLS.length)]
  },
  bugs: [],
  score: 0,
  gameOver: false,
  started: false,
  speed: INITIAL_SPEED,
});

export default function CodeSnakePage() {
  const canvasRef = useRef<GameCanvasRef>(null);
  const gameStateRef = useRef<GameState>(createInitialState());
  const [displayState, setDisplayState] = useState({ score: 0, gameOver: false, started: false });
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const { addScore, getTopScore, isHighScore } = useHighScores();
  const highScore = getTopScore("code-snake");
  const moveTimerRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

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
    moveTimerRef.current = 0;
    setScoreSubmitted(false);
    syncDisplayState();
  }, [syncDisplayState]);

  const startGame = useCallback(() => {
    gameStateRef.current.started = true;
    syncDisplayState();
  }, [syncDisplayState]);

  const handleSubmitScore = useCallback((name: string) => {
    addScore("code-snake", gameStateRef.current.score, name);
    setScoreSubmitted(true);
  }, [addScore]);

  const changeDirection = useCallback((newDir: Direction) => {
    const state = gameStateRef.current;
    if (!state.started || state.gameOver) return;

    const opposites: Record<Direction, Direction> = {
      UP: "DOWN",
      DOWN: "UP",
      LEFT: "RIGHT",
      RIGHT: "LEFT",
    };

    if (opposites[newDir] !== state.direction) {
      state.nextDirection = newDir;
    }
  }, []);

  // Game loop
  useEffect(() => {
    let lastTime = 0;

    const gameLoop = (currentTime: number) => {
      if (!lastTime) lastTime = currentTime;
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      const state = gameStateRef.current;
      const canvas = canvasRef.current;

      // Update game
      if (state.started && !state.gameOver) {
        moveTimerRef.current += deltaTime;
        const moveInterval = 1 / state.speed;

        if (moveTimerRef.current >= moveInterval) {
          moveTimerRef.current = 0;

          state.direction = state.nextDirection;
          const head = { ...state.snake[0] };

          switch (state.direction) {
            case "UP": head.y -= 1; break;
            case "DOWN": head.y += 1; break;
            case "LEFT": head.x -= 1; break;
            case "RIGHT": head.x += 1; break;
          }

          // Check wall collision
          if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
            state.gameOver = true;
            syncDisplayState();
          }
          // Check self collision
          else if (state.snake.some((s) => s.x === head.x && s.y === head.y)) {
            state.gameOver = true;
            syncDisplayState();
          }
          // Check bug collision
          else if (state.bugs.some((b) => b.x === head.x && b.y === head.y)) {
            state.gameOver = true;
            syncDisplayState();
          }
          else {
            state.snake.unshift(head);

            if (head.x === state.food.x && head.y === state.food.y) {
              state.score += 10;
              state.food = {
                ...getRandomPosition(state.snake, state.bugs),
                symbol: CODE_SYMBOLS[Math.floor(Math.random() * CODE_SYMBOLS.length)],
              };

              if (state.score % 50 === 0 && state.bugs.length < 5) {
                state.bugs.push(getRandomPosition(state.snake, state.bugs));
              }

              // Speed increase is also 10% slower
              if (state.score % 30 === 0) {
                state.speed = Math.min(state.speed + 0.9, 13.5);
              }

              syncDisplayState();
            } else {
              state.snake.pop();
            }
          }
        }
      }

      // Render
      if (canvas?.ctx) {
        const ctx = canvas.ctx;

        ctx.fillStyle = COLORS.background;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.strokeStyle = COLORS.grid;
        ctx.lineWidth = 1;
        for (let x = 0; x <= COLS; x++) {
          ctx.beginPath();
          ctx.moveTo(x * GRID_SIZE, 0);
          ctx.lineTo(x * GRID_SIZE, CANVAS_HEIGHT);
          ctx.stroke();
        }
        for (let y = 0; y <= ROWS; y++) {
          ctx.beginPath();
          ctx.moveTo(0, y * GRID_SIZE);
          ctx.lineTo(CANVAS_WIDTH, y * GRID_SIZE);
          ctx.stroke();
        }

        ctx.fillStyle = COLORS.food;
        ctx.font = "bold 10px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          state.food.symbol,
          state.food.x * GRID_SIZE + GRID_SIZE / 2,
          state.food.y * GRID_SIZE + GRID_SIZE / 2
        );

        ctx.fillStyle = COLORS.bug;
        state.bugs.forEach((bug) => {
          ctx.fillText(
            "BUG",
            bug.x * GRID_SIZE + GRID_SIZE / 2,
            bug.y * GRID_SIZE + GRID_SIZE / 2
          );
        });

        state.snake.forEach((segment, index) => {
          ctx.fillStyle = index === 0 ? COLORS.snakeHead : COLORS.snake;
          ctx.fillRect(
            segment.x * GRID_SIZE + 1,
            segment.y * GRID_SIZE + 1,
            GRID_SIZE - 2,
            GRID_SIZE - 2
          );
        });

        if (!state.started) {
          ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
          ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

          ctx.fillStyle = COLORS.text;
          ctx.font = "bold 16px monospace";
          ctx.textAlign = "center";
          ctx.fillText("CODE SNAKE", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30);

          ctx.font = "10px monospace";
          ctx.fillText("Collect code symbols", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
          ctx.fillText("Avoid the bugs!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 15);

          ctx.fillStyle = COLORS.food;
          ctx.fillText("Press SPACE to start", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
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
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          e.preventDefault();
          changeDirection("UP");
          break;
        case "ArrowDown":
        case "s":
        case "S":
          e.preventDefault();
          changeDirection("DOWN");
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          e.preventDefault();
          changeDirection("LEFT");
          break;
        case "ArrowRight":
        case "d":
        case "D":
          e.preventDefault();
          changeDirection("RIGHT");
          break;
        case " ":
          e.preventDefault();
          if (!gameStateRef.current.started) startGame();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [changeDirection, startGame]);

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
          title="CODE SNAKE"
          score={displayState.score}
          highScore={highScore}
        >
          <div className="relative flex items-center justify-center p-4">
            <GameCanvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              scale={2}
            />

            <GameOverModal
              isOpen={displayState.gameOver}
              score={displayState.score}
              highScore={highScore}
              isNewHighScore={isHighScore("code-snake", displayState.score)}
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
            Arrow Keys or WASD to move | SPACE to start
          </p>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2 max-w-[200px] mx-auto md:hidden">
          <div />
          <Button variant="outline" className="border-games text-games h-12" onClick={() => changeDirection("UP")}>↑</Button>
          <div />
          <Button variant="outline" className="border-games text-games h-12" onClick={() => changeDirection("LEFT")}>←</Button>
          <Button variant="outline" className="border-games text-games h-12" onClick={() => { if (!displayState.started) startGame(); }}>GO</Button>
          <Button variant="outline" className="border-games text-games h-12" onClick={() => changeDirection("RIGHT")}>→</Button>
          <div />
          <Button variant="outline" className="border-games text-games h-12" onClick={() => changeDirection("DOWN")}>↓</Button>
          <div />
        </div>
      </div>
    </div>
  );
}
