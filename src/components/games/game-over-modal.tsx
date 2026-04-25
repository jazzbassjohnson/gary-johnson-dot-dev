"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RotateCcw, Home, Trophy } from "lucide-react";
import Link from "next/link";

interface GameOverModalProps {
  isOpen: boolean;
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  onRestart: () => void;
  onSubmitScore: (name: string) => void;
  scoreSubmitted?: boolean;
}

export function GameOverModal({
  isOpen,
  score,
  highScore,
  isNewHighScore,
  onRestart,
  onSubmitScore,
  scoreSubmitted = false,
}: GameOverModalProps) {
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(scoreSubmitted);

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmitScore(name.trim().toUpperCase().slice(0, 3));
      setSubmitted(true);
    }
  };

  const handleRestart = () => {
    setName("");
    setSubmitted(false);
    onRestart();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/90 flex items-center justify-center z-10 rounded-lg"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="text-center p-8 max-w-sm w-full"
          >
            <h2
              className="text-3xl text-games mb-4 glow"
              style={{ fontFamily: "var(--font-pixel), monospace" }}
            >
              GAME OVER
            </h2>

            {isNewHighScore && !submitted && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.3 }}
                className="text-accent mb-4 flex items-center justify-center gap-2"
                style={{ fontFamily: "var(--font-pixel), monospace" }}
              >
                <Trophy className="w-5 h-5" />
                NEW HIGH SCORE!
                <Trophy className="w-5 h-5" />
              </motion.div>
            )}

            <div className="space-y-2 mb-6">
              <div
                className="text-games text-xl"
                style={{ fontFamily: "var(--font-pixel), monospace" }}
              >
                SCORE: {score.toString().padStart(6, "0")}
              </div>
              <div
                className="text-games/70 text-sm"
                style={{ fontFamily: "var(--font-pixel), monospace" }}
              >
                BEST: {Math.max(highScore, score).toString().padStart(6, "0")}
              </div>
            </div>

            {/* Name Entry */}
            {!submitted && score > 0 && (
              <div className="mb-6">
                <p
                  className="text-games/70 text-xs mb-2"
                  style={{ fontFamily: "var(--font-pixel), monospace" }}
                >
                  ENTER YOUR INITIALS
                </p>
                <div className="flex justify-center gap-2 mb-3">
                  <input
                    type="text"
                    maxLength={3}
                    value={name}
                    onChange={(e) => setName(e.target.value.toUpperCase().replace(/[^A-Z]/g, ""))}
                    placeholder="AAA"
                    className="w-24 h-12 text-center text-2xl bg-black border-2 border-games text-games rounded-lg focus:outline-none focus:border-accent uppercase"
                    style={{ fontFamily: "var(--font-pixel), monospace" }}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && name.trim()) {
                        handleSubmit();
                      }
                    }}
                  />
                </div>
                <Button
                  variant="arcade"
                  onClick={handleSubmit}
                  disabled={!name.trim()}
                  className="w-full"
                >
                  SUBMIT SCORE
                </Button>
              </div>
            )}

            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <p
                  className="text-accent text-sm"
                  style={{ fontFamily: "var(--font-pixel), monospace" }}
                >
                  SCORE SAVED!
                </p>
              </motion.div>
            )}

            <div className="flex flex-col gap-3">
              <Button
                variant="arcade"
                onClick={handleRestart}
                className="w-full"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                PLAY AGAIN
              </Button>
              <Button
                variant="outline"
                asChild
                className="w-full border-games text-games hover:bg-games/20"
              >
                <Link href="/games">
                  <Home className="w-4 h-4 mr-2" />
                  BACK TO ARCADE
                </Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
