"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Gamepad2, Code, Music, Shirt, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { HighScoreBoard } from "@/components/games";
import { useHighScores } from "@/hooks";

const games = [
  {
    id: "code-snake",
    title: "CODE SNAKE",
    description: "Collect code symbols, avoid the bugs!",
    icon: Code,
    href: "/games/code-snake",
    color: "software",
    instructions: "Arrow keys to move",
  },
  {
    id: "rhythm-keys",
    title: "RHYTHM KEYS",
    description: "Hit the notes to the beat!",
    icon: Music,
    href: "/games/rhythm-keys",
    color: "music",
    instructions: "D, F, J, K keys",
  },
  {
    id: "style-rush",
    title: "STYLE RUSH",
    description: "Catch items to complete outfit orders!",
    icon: Shirt,
    href: "/games/style-rush",
    color: "operations",
    instructions: "← → to move",
  },
];

export default function GamesPage() {
  const { getScores, getTopScore } = useHighScores();

  return (
    <div className="min-h-screen theme-arcade">
      {/* Arcade Header */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--games)_0%,_transparent_70%)] opacity-10" />
        </div>

        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex p-4 rounded-2xl bg-games/20 mb-6">
              <Gamepad2 className="w-10 h-10 text-games" />
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-games glow animate-flicker"
              style={{ fontFamily: "var(--font-pixel), monospace" }}
            >
              GARY&apos;S ARCADE
            </h1>

            <p className="text-lg text-games/70 max-w-xl mx-auto">
              Step into the retro zone! Play career-themed arcade games
              and compete for high scores.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Game Selection */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <Link href={game.href}>
                  <Card className="group cursor-pointer bg-black border-2 border-games/50 hover:border-games transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,165,0,0.3)] overflow-hidden">
                    <CardContent className="p-0">
                      {/* Cabinet Top */}
                      <div className={`bg-gradient-to-b from-${game.color}/30 to-transparent p-6 text-center`}>
                        <div className={`inline-flex p-4 rounded-xl bg-${game.color}/20 text-${game.color} mb-4 group-hover:scale-110 transition-transform`}>
                          <game.icon className="w-8 h-8" />
                        </div>

                        <h3
                          className="text-xl font-bold text-games group-hover:text-accent transition-colors"
                          style={{ fontFamily: "var(--font-pixel), monospace" }}
                        >
                          {game.title}
                        </h3>
                      </div>

                      {/* Screen Preview */}
                      <div className="mx-4 mb-4 rounded-lg bg-black border border-games/30 p-4 scanlines aspect-video flex items-center justify-center">
                        <div className="text-center">
                          <game.icon className="w-12 h-12 text-games/50 mx-auto mb-2 animate-pulse-glow" />
                          <p className="text-games/50 text-xs">
                            {game.description}
                          </p>
                        </div>
                      </div>

                      {/* Score & Controls */}
                      <div className="px-4 pb-4">
                        <div className="flex justify-between items-center text-xs mb-3">
                          <span className="text-games/70">HI-SCORE:</span>
                          <span
                            className="text-accent font-bold"
                            style={{ fontFamily: "var(--font-pixel), monospace" }}
                          >
                            {getTopScore(game.id as "code-snake" | "rhythm-keys" | "style-rush")
                              .toString()
                              .padStart(6, "0")}
                          </span>
                        </div>

                        <div className="text-center">
                          <span
                            className="text-xs text-games/50"
                            style={{ fontFamily: "var(--font-pixel), monospace" }}
                          >
                            {game.instructions}
                          </span>
                        </div>
                      </div>

                      {/* Insert Coin Button */}
                      <div className="p-4 border-t border-games/30">
                        <div className="text-center">
                          <span
                            className="text-games animate-pulse text-sm"
                            style={{ fontFamily: "var(--font-pixel), monospace" }}
                          >
                            INSERT COIN
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* High Scores Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              <Trophy className="w-6 h-6 text-accent" />
              <h2
                className="text-2xl text-accent text-center"
                style={{ fontFamily: "var(--font-pixel), monospace" }}
              >
                HALL OF FAME
              </h2>
              <Trophy className="w-6 h-6 text-accent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <HighScoreBoard
                scores={getScores("code-snake")}
                title="CODE SNAKE"
              />
              <HighScoreBoard
                scores={getScores("rhythm-keys")}
                title="RHYTHM KEYS"
              />
              <HighScoreBoard
                scores={getScores("style-rush")}
                title="STYLE RUSH"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Instructions */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3
              className="text-lg text-games mb-4"
              style={{ fontFamily: "var(--font-pixel), monospace" }}
            >
              HOW TO PLAY
            </h3>
            <div className="space-y-2 text-games/70 text-sm">
              <p>Select a game cabinet to start playing</p>
              <p>Use keyboard controls (desktop) or touch (mobile)</p>
              <p>Your high scores are saved locally</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
