"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ArcadeCabinetProps {
  children: ReactNode;
  title: string;
  score?: number;
  highScore?: number;
  className?: string;
}

export function ArcadeCabinet({
  children,
  title,
  score,
  highScore,
  className,
}: ArcadeCabinetProps) {
  return (
    <div
      className={cn(
        "relative bg-black rounded-lg border-4 border-games p-4",
        "shadow-[0_0_30px_rgba(255,165,0,0.3)]",
        className
      )}
    >
      {/* Cabinet Header */}
      <div className="text-center mb-4">
        <h2
          className="text-2xl font-bold text-games glow animate-flicker"
          style={{ fontFamily: "var(--font-pixel), monospace" }}
        >
          {title}
        </h2>

        {/* Score Display */}
        {(score !== undefined || highScore !== undefined) && (
          <div className="flex justify-center gap-8 mt-2">
            {score !== undefined && (
              <div className="text-center">
                <span className="text-xs text-games/70 block">SCORE</span>
                <span
                  className="text-lg text-games font-bold"
                  style={{ fontFamily: "var(--font-pixel), monospace" }}
                >
                  {score.toString().padStart(6, "0")}
                </span>
              </div>
            )}
            {highScore !== undefined && (
              <div className="text-center">
                <span className="text-xs text-games/70 block">HI-SCORE</span>
                <span
                  className="text-lg text-accent font-bold"
                  style={{ fontFamily: "var(--font-pixel), monospace" }}
                >
                  {highScore.toString().padStart(6, "0")}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Screen with scanlines */}
      <div className="relative rounded-lg overflow-hidden bg-black border-2 border-games/50 scanlines">
        {children}
      </div>

      {/* Cabinet Controls Decoration */}
      <div className="mt-4 flex justify-center gap-4">
        <div className="flex gap-2">
          <div className="w-8 h-8 rounded-full bg-games/20 border-2 border-games/50" />
          <div className="w-8 h-8 rounded-full bg-games/20 border-2 border-games/50" />
        </div>
        <div className="w-12 h-12 rounded-full bg-red-500/20 border-2 border-red-500/50" />
      </div>
    </div>
  );
}
