"use client";

import * as React from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface Card3DProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"> {
  /** Max tilt in degrees */
  intensity?: number;
  /** Show the moving specular highlight */
  glare?: boolean;
  /** Coloured glow that follows the cursor */
  glow?: boolean;
  /** Classes for the perspective wrapper (grid placement, aspect ratio, sizing) */
  wrapperClassName?: string;
}

/**
 * Interactive 3D card: tilts toward the cursor, lifts on hover, and carries a
 * glare layer. Children can opt into extra depth with `.depth-1/.depth-2/.depth-3`
 * (translateZ), which preserve-3d makes parallax against the card face.
 * Respects prefers-reduced-motion and only tilts for fine pointers.
 */
export const Card3D = React.forwardRef<HTMLDivElement, Card3DProps>(
  ({ className, children, intensity = 8, glare = true, glow = true, wrapperClassName, ...props }, ref) => {
    const reduce = useReducedMotion();
    const mx = useMotionValue(0.5);
    const my = useMotionValue(0.5);
    const spring = { stiffness: 220, damping: 20, mass: 0.6 };
    const rotateX = useSpring(useTransform(my, [0, 1], [intensity, -intensity]), spring);
    const rotateY = useSpring(useTransform(mx, [0, 1], [-intensity, intensity]), spring);
    const gx = useTransform(mx, (v) => `${v * 100}%`);
    const gy = useTransform(my, (v) => `${v * 100}%`);
    const glareBg = useMotionTemplate`radial-gradient(420px circle at ${gx} ${gy}, var(--glare), transparent 55%)`;

    function onMove(e: React.PointerEvent<HTMLDivElement>) {
      if (reduce || e.pointerType !== "mouse") return;
      const r = e.currentTarget.getBoundingClientRect();
      mx.set((e.clientX - r.left) / r.width);
      my.set((e.clientY - r.top) / r.height);
    }
    function onLeave() {
      mx.set(0.5);
      my.set(0.5);
    }

    return (
      <div className={cn("h-full [perspective:1100px]", wrapperClassName)}>
        <motion.div
          ref={ref}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
          whileHover={reduce ? undefined : { y: -6, scale: 1.015 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className={cn(
            "card-3d group/card relative h-full rounded-2xl border border-border bg-card text-card-foreground",
            glow && "card-3d-glow",
            className
          )}
          {...props}
        >
          {glare && !reduce && (
            <motion.div
              aria-hidden
              style={{ background: glareBg }}
              className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
            />
          )}
          {children}
        </motion.div>
      </div>
    );
  }
);
Card3D.displayName = "Card3D";
