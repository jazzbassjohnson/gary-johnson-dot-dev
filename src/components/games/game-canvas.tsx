"use client";

import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { cn } from "@/lib/utils";

interface GameCanvasProps {
  width: number;
  height: number;
  scale?: number;
  className?: string;
  onInit?: (ctx: CanvasRenderingContext2D) => void;
}

export interface GameCanvasRef {
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  clear: () => void;
}

export const GameCanvas = forwardRef<GameCanvasRef, GameCanvasProps>(
  ({ width, height, scale = 2, className, onInit }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

    useImperativeHandle(ref, () => ({
      canvas: canvasRef.current,
      ctx: ctxRef.current,
      clear: () => {
        if (ctxRef.current) {
          ctxRef.current.fillStyle = "#000";
          ctxRef.current.fillRect(0, 0, width, height);
        }
      },
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Disable image smoothing for crisp pixels
      ctx.imageSmoothingEnabled = false;

      ctxRef.current = ctx;

      if (onInit) {
        onInit(ctx);
      }
    }, [onInit, width, height]);

    return (
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={cn("pixel-perfect", className)}
        style={{
          width: width * scale,
          height: height * scale,
          imageRendering: "pixelated",
        }}
      />
    );
  }
);

GameCanvas.displayName = "GameCanvas";
