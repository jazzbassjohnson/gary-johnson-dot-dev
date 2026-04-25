"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArcadeCabinet, GameCanvas, GameCanvasRef, GameOverModal } from "@/components/games";
import { useHighScores } from "@/hooks";

// Game constants
const CANVAS_WIDTH = 320;
const CANVAS_HEIGHT = 360;
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 50;
const ITEM_SIZE = 30;
const PLAYER_SPEED = 250;

// Fashion items with emoji representations
const FASHION_ITEMS = [
  { id: "shirt", emoji: "👕", name: "Top", color: "#4ecdc4" },
  { id: "pants", emoji: "👖", name: "Pants", color: "#45b7d1" },
  { id: "dress", emoji: "👗", name: "Dress", color: "#f38181" },
  { id: "shoe", emoji: "👠", name: "Shoes", color: "#aa96da" },
  { id: "bag", emoji: "👜", name: "Bag", color: "#fcbad3" },
  { id: "hat", emoji: "🎩", name: "Hat", color: "#2c3e50" },
  { id: "glasses", emoji: "🕶️", name: "Shades", color: "#34495e" },
  { id: "scarf", emoji: "🧣", name: "Scarf", color: "#e74c3c" },
];

// Outfit combinations for orders
const OUTFITS = [
  { items: ["shirt", "pants"], name: "Casual", bonus: 50 },
  { items: ["dress", "shoe"], name: "Elegant", bonus: 60 },
  { items: ["shirt", "pants", "hat"], name: "Dapper", bonus: 80 },
  { items: ["dress", "bag", "shoe"], name: "Glam", bonus: 100 },
  { items: ["shirt", "scarf", "glasses"], name: "Trendy", bonus: 90 },
];

const COLORS = {
  background: "#1a1a2e",
  player: "#00ff88",
  text: "#ffffff",
  orderBg: "#16213e",
  orderComplete: "#00ff00",
  streak: "#ffd700",
};

interface FallingItem {
  id: number;
  itemType: string;
  x: number;
  y: number;
  speed: number;
}

interface OutfitOrder {
  id: number;
  outfit: typeof OUTFITS[0];
  collected: string[];
  timer: number;
}

interface GameState {
  playerX: number;
  items: FallingItem[];
  orders: OutfitOrder[];
  score: number;
  streak: number;
  maxStreak: number;
  lives: number;
  gameOver: boolean;
  started: boolean;
  spawnTimer: number;
  orderTimer: number;
  itemIdCounter: number;
  orderIdCounter: number;
  difficulty: number;
  movingLeft: boolean;
  movingRight: boolean;
}

const createInitialState = (): GameState => ({
  playerX: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
  items: [],
  orders: [],
  score: 0,
  streak: 0,
  maxStreak: 0,
  lives: 3,
  gameOver: false,
  started: false,
  spawnTimer: 0,
  orderTimer: 0,
  itemIdCounter: 0,
  orderIdCounter: 0,
  difficulty: 1,
  movingLeft: false,
  movingRight: false,
});

export default function StyleRushPage() {
  const canvasRef = useRef<GameCanvasRef>(null);
  const gameStateRef = useRef<GameState>(createInitialState());
  const [displayState, setDisplayState] = useState({ score: 0, gameOver: false, started: false });
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const { addScore, getTopScore, isHighScore } = useHighScores();
  const highScore = getTopScore("style-rush");
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
    setScoreSubmitted(false);
    syncDisplayState();
  }, [syncDisplayState]);

  const startGame = useCallback(() => {
    const state = gameStateRef.current;
    state.started = true;
    // Start with one order
    state.orders.push({
      id: state.orderIdCounter++,
      outfit: OUTFITS[Math.floor(Math.random() * 2)], // Start with simple outfits
      collected: [],
      timer: 30,
    });
    syncDisplayState();
  }, [syncDisplayState]);

  const handleSubmitScore = useCallback((name: string) => {
    addScore("style-rush", gameStateRef.current.score, name);
    setScoreSubmitted(true);
  }, [addScore]);

  const setMovement = useCallback((direction: "left" | "right", active: boolean) => {
    const state = gameStateRef.current;
    if (direction === "left") {
      state.movingLeft = active;
    } else {
      state.movingRight = active;
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

      if (state.started && !state.gameOver) {
        // Move player
        if (state.movingLeft) {
          state.playerX = Math.max(0, state.playerX - PLAYER_SPEED * deltaTime);
        }
        if (state.movingRight) {
          state.playerX = Math.min(CANVAS_WIDTH - PLAYER_WIDTH, state.playerX + PLAYER_SPEED * deltaTime);
        }

        // Spawn items
        state.spawnTimer += deltaTime;
        const spawnRate = Math.max(0.5, 1.5 - state.difficulty * 0.1);
        if (state.spawnTimer >= spawnRate) {
          state.spawnTimer = 0;

          // Spawn items that are needed for current orders more often
          const neededItems = state.orders.flatMap(o =>
            o.outfit.items.filter(item => !o.collected.includes(item))
          );

          let itemType: string;
          if (neededItems.length > 0 && Math.random() > 0.3) {
            itemType = neededItems[Math.floor(Math.random() * neededItems.length)];
          } else {
            itemType = FASHION_ITEMS[Math.floor(Math.random() * FASHION_ITEMS.length)].id;
          }

          state.items.push({
            id: state.itemIdCounter++,
            itemType,
            x: Math.random() * (CANVAS_WIDTH - ITEM_SIZE),
            y: -ITEM_SIZE,
            speed: 80 + state.difficulty * 15,
          });
        }

        // Add new orders
        state.orderTimer += deltaTime;
        const orderRate = Math.max(8, 15 - state.difficulty);
        if (state.orderTimer >= orderRate && state.orders.length < 3) {
          state.orderTimer = 0;
          const availableOutfits = state.difficulty < 3 ? OUTFITS.slice(0, 2) : OUTFITS;
          state.orders.push({
            id: state.orderIdCounter++,
            outfit: availableOutfits[Math.floor(Math.random() * availableOutfits.length)],
            collected: [],
            timer: 25 + (3 - state.orders.length) * 5,
          });
        }

        // Update items
        for (const item of state.items) {
          item.y += item.speed * deltaTime;

          // Check collision with player
          if (
            item.y + ITEM_SIZE > CANVAS_HEIGHT - PLAYER_HEIGHT - 10 &&
            item.y < CANVAS_HEIGHT - 10 &&
            item.x + ITEM_SIZE > state.playerX &&
            item.x < state.playerX + PLAYER_WIDTH
          ) {
            // Caught item - check if needed for any order
            let matched = false;
            for (const order of state.orders) {
              if (
                order.outfit.items.includes(item.itemType) &&
                !order.collected.includes(item.itemType)
              ) {
                order.collected.push(item.itemType);
                state.score += 10 * (1 + state.streak * 0.1);
                state.streak++;
                state.maxStreak = Math.max(state.maxStreak, state.streak);
                matched = true;

                // Check if outfit complete
                if (order.collected.length === order.outfit.items.length) {
                  state.score += order.outfit.bonus * (1 + state.streak * 0.05);
                  state.orders = state.orders.filter(o => o.id !== order.id);

                  // Increase difficulty every 2 completed outfits
                  state.difficulty = Math.min(10, state.difficulty + 0.5);
                }
                break;
              }
            }

            if (!matched) {
              // Caught wrong item
              state.streak = 0;
            }

            // Remove the item
            item.y = CANVAS_HEIGHT + ITEM_SIZE;
          }
        }

        // Update order timers
        for (const order of state.orders) {
          order.timer -= deltaTime;
          if (order.timer <= 0) {
            state.lives--;
            state.streak = 0;
            if (state.lives <= 0) {
              state.gameOver = true;
              syncDisplayState();
            }
          }
        }
        state.orders = state.orders.filter(o => o.timer > 0);

        // Remove off-screen items
        state.items = state.items.filter(item => item.y < CANVAS_HEIGHT + ITEM_SIZE);

        // Sync display periodically
        syncDisplayState();
      }

      // Render
      if (canvas?.ctx) {
        const ctx = canvas.ctx;

        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
        gradient.addColorStop(0, "#1a1a2e");
        gradient.addColorStop(1, "#16213e");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw runway lines
        ctx.strokeStyle = "#ffffff22";
        ctx.lineWidth = 2;
        for (let i = 1; i < 4; i++) {
          ctx.beginPath();
          ctx.moveTo(CANVAS_WIDTH * i / 4, 0);
          ctx.lineTo(CANVAS_WIDTH * i / 4, CANVAS_HEIGHT);
          ctx.stroke();
        }

        // Draw orders panel
        ctx.fillStyle = COLORS.orderBg;
        ctx.fillRect(0, 0, CANVAS_WIDTH, 70);

        ctx.fillStyle = COLORS.text;
        ctx.font = "bold 10px monospace";
        ctx.textAlign = "left";
        ctx.fillText("ORDERS:", 5, 12);

        // Draw each order
        state.orders.forEach((order, index) => {
          const orderX = 5 + index * 105;
          const orderY = 18;

          // Order background
          ctx.fillStyle = order.timer < 5 ? "#ff000044" : "#ffffff11";
          ctx.fillRect(orderX, orderY, 100, 48);

          // Order name
          ctx.fillStyle = order.timer < 5 ? "#ff6b6b" : COLORS.text;
          ctx.font = "bold 8px monospace";
          ctx.fillText(order.outfit.name, orderX + 2, orderY + 10);

          // Timer bar
          const timerWidth = (order.timer / 30) * 96;
          ctx.fillStyle = order.timer < 5 ? "#ff0000" : "#00ff00";
          ctx.fillRect(orderX + 2, orderY + 13, timerWidth, 3);

          // Required items
          order.outfit.items.forEach((itemId, itemIndex) => {
            const item = FASHION_ITEMS.find(f => f.id === itemId);
            const collected = order.collected.includes(itemId);
            const itemX = orderX + 5 + itemIndex * 25;
            const itemY = orderY + 22;

            ctx.fillStyle = collected ? "#00ff0044" : "#ffffff22";
            ctx.fillRect(itemX, itemY, 22, 22);

            ctx.font = "14px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(item?.emoji || "?", itemX + 11, itemY + 17);

            if (collected) {
              ctx.fillStyle = "#00ff00";
              ctx.font = "bold 12px sans-serif";
              ctx.fillText("✓", itemX + 11, itemY + 10);
            }
          });
        });

        // Draw lives
        ctx.fillStyle = COLORS.text;
        ctx.font = "12px sans-serif";
        ctx.textAlign = "right";
        ctx.fillText("❤️".repeat(state.lives), CANVAS_WIDTH - 5, 12);

        // Draw streak
        if (state.streak > 2) {
          ctx.fillStyle = COLORS.streak;
          ctx.font = "bold 10px monospace";
          ctx.textAlign = "center";
          ctx.fillText(`${state.streak}x STREAK!`, CANVAS_WIDTH / 2, 85);
        }

        // Draw falling items
        for (const item of state.items) {
          const fashionItem = FASHION_ITEMS.find(f => f.id === item.itemType);
          if (!fashionItem) continue;

          // Item glow
          ctx.shadowColor = fashionItem.color;
          ctx.shadowBlur = 10;

          ctx.fillStyle = fashionItem.color + "44";
          ctx.beginPath();
          ctx.arc(item.x + ITEM_SIZE / 2, item.y + ITEM_SIZE / 2, ITEM_SIZE / 2, 0, Math.PI * 2);
          ctx.fill();

          ctx.shadowBlur = 0;

          ctx.font = "20px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(fashionItem.emoji, item.x + ITEM_SIZE / 2, item.y + ITEM_SIZE / 2 + 7);
        }

        // Draw player (fashion model/mannequin)
        const playerY = CANVAS_HEIGHT - PLAYER_HEIGHT - 10;

        // Player glow
        ctx.shadowColor = COLORS.player;
        ctx.shadowBlur = 15;

        // Body
        ctx.fillStyle = COLORS.player;
        ctx.beginPath();
        ctx.ellipse(
          state.playerX + PLAYER_WIDTH / 2,
          playerY + 15,
          12,
          12,
          0, 0, Math.PI * 2
        );
        ctx.fill();

        // Torso
        ctx.fillRect(state.playerX + PLAYER_WIDTH / 2 - 8, playerY + 25, 16, 20);

        // Arms holding basket
        ctx.strokeStyle = COLORS.player;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(state.playerX + PLAYER_WIDTH / 2 - 8, playerY + 30);
        ctx.lineTo(state.playerX + 5, playerY + 40);
        ctx.moveTo(state.playerX + PLAYER_WIDTH / 2 + 8, playerY + 30);
        ctx.lineTo(state.playerX + PLAYER_WIDTH - 5, playerY + 40);
        ctx.stroke();

        // Basket/catch zone
        ctx.fillStyle = "#ffffff33";
        ctx.fillRect(state.playerX, playerY + 38, PLAYER_WIDTH, 12);
        ctx.strokeStyle = COLORS.player;
        ctx.strokeRect(state.playerX, playerY + 38, PLAYER_WIDTH, 12);

        ctx.shadowBlur = 0;

        // Start screen
        if (!state.started) {
          ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
          ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

          ctx.fillStyle = "#f38181";
          ctx.font = "bold 20px monospace";
          ctx.textAlign = "center";
          ctx.fillText("STYLE RUSH", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50);

          ctx.fillStyle = COLORS.text;
          ctx.font = "10px monospace";
          ctx.fillText("Catch items to complete", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
          ctx.fillText("outfit orders!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 5);

          ctx.font = "12px sans-serif";
          ctx.fillText("👕 👖 👗 👠 👜", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 25);

          ctx.fillStyle = "#00ff00";
          ctx.font = "10px monospace";
          ctx.fillText("← → or A/D to move", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 55);
          ctx.fillText("Press SPACE to start", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 75);
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
        return;
      }

      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
        e.preventDefault();
        setMovement("left", true);
      }
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
        e.preventDefault();
        setMovement("right", true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
        setMovement("left", false);
      }
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
        setMovement("right", false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [setMovement, startGame]);

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
          title="STYLE RUSH"
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
              isNewHighScore={isHighScore("style-rush", displayState.score)}
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
            Arrow Keys or A/D to move | SPACE to start
          </p>
        </div>

        {/* Mobile Controls */}
        <div className="mt-6 grid grid-cols-3 gap-2 max-w-[250px] mx-auto md:hidden">
          <Button
            variant="outline"
            className="border-games text-games h-16 text-2xl"
            onTouchStart={() => setMovement("left", true)}
            onTouchEnd={() => setMovement("left", false)}
            onMouseDown={() => setMovement("left", true)}
            onMouseUp={() => setMovement("left", false)}
          >
            ←
          </Button>
          <Button
            variant="outline"
            className="border-games text-games h-16"
            onClick={() => { if (!displayState.started) startGame(); }}
          >
            GO
          </Button>
          <Button
            variant="outline"
            className="border-games text-games h-16 text-2xl"
            onTouchStart={() => setMovement("right", true)}
            onTouchEnd={() => setMovement("right", false)}
            onMouseDown={() => setMovement("right", true)}
            onMouseUp={() => setMovement("right", false)}
          >
            →
          </Button>
        </div>
      </div>
    </div>
  );
}
