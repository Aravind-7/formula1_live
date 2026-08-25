"use client";

import type { Driver } from "@f1-dashboard/types";
import { colors } from "@f1-dashboard/tokens";
import { teamColor } from "@f1-dashboard/hooks";

export interface DriverDotProps {
  driver: Driver;
  x: number;
  y: number;
  isSelected: boolean;
  isHovered: boolean;
  hasSelection: boolean;
  onHoverStart: (event: React.MouseEvent<SVGCircleElement>) => void;
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
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`${driver.full_name}${isSelected ? ", selected" : ""}`}
      aria-pressed={isSelected}
      className="cursor-pointer transition-opacity focus:outline focus:outline-2 focus:outline-accent-gold"
    />
  );
}
