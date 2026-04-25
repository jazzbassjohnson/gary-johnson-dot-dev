"use client";

import { cn } from "@/lib/utils";
import { type ScoreEntry } from "@/hooks";

interface HighScoreBoardProps {
  scores: ScoreEntry[];
  title?: string;
  className?: string;
}

export function HighScoreBoard({
  scores,
  title = "HIGH SCORES",
  className,
}: HighScoreBoardProps) {
  const displayScores = scores.length > 0
    ? scores.slice(0, 5)
    : [
        { name: "---", score: 0, date: "" },
        { name: "---", score: 0, date: "" },
        { name: "---", score: 0, date: "" },
        { name: "---", score: 0, date: "" },
        { name: "---", score: 0, date: "" },
      ];

  return (
    <div
      className={cn(
        "bg-black border-2 border-games rounded-lg p-4",
        className
      )}
    >
      <h3
        className="text-center text-games mb-4 text-sm"
        style={{ fontFamily: "var(--font-pixel), monospace" }}
      >
        {title}
      </h3>

      <div className="space-y-2">
        {displayScores.map((entry, index) => (
          <div
            key={index}
            className="flex justify-between items-center text-xs"
            style={{ fontFamily: "var(--font-pixel), monospace" }}
          >
            <span className={cn(
              index === 0 ? "text-accent" : "text-games/70"
            )}>
              {index + 1}.
            </span>
            <span className={cn(
              "flex-1 mx-2",
              index === 0 ? "text-accent" : "text-games"
            )}>
              {entry.name || "---"}
            </span>
            <span className={cn(
              index === 0 ? "text-accent" : "text-games"
            )}>
              {entry.score.toString().padStart(6, "0")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
