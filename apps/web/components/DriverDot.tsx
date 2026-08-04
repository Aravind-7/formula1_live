"use client";

import type { Driver } from "@f1-dashboard/types";
import { colors } from "@f1-dashboard/tokens";
import { teamColor } from "@/lib/telemetry";

export interface DriverDotProps {
  driver: Driver;
  x: number;
  y: number;
  isSelected: boolean;
  isHovered: boolean;
  hasSelection: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onClick: () => void;
}

export function DriverDot({
  driver,
  x,
  y,
  isSelected,
  isHovered,
  hasSelection,
  onHoverStart,
  onHoverEnd,
  onClick,
}: DriverDotProps) {
  const radius = isSelected ? 6 : isHovered ? 5 : 4;
  const opacity = hasSelection && !isSelected ? 0.3 : 1;

  return (
    <circle
      cx={x}
      cy={y}
      r={radius}
      fill={teamColor(driver) ?? colors.textMuted}
      opacity={opacity}
      stroke={isSelected ? colors.accentGold : "none"}
      strokeWidth={isSelected ? 2 : 0}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onClick={onClick}
      className="cursor-pointer transition-opacity"
    />
  );
}
