import { Circle } from "react-native-svg";
import type { Driver } from "@f1-dashboard/types";
import { teamColor } from "@f1-dashboard/hooks";
import { colors } from "@f1-dashboard/tokens";

export interface DriverDotProps {
  driver: Driver;
  x: number;
  y: number;
  isSelected: boolean;
  hasSelection: boolean;
  onPress: () => void;
}

export function DriverDot({ driver, x, y, isSelected, hasSelection, onPress }: DriverDotProps) {
  const radius = isSelected ? 6 : 4;
  const opacity = hasSelection && !isSelected ? 0.3 : 1;

  return (
    <Circle
      cx={x}
      cy={y}
      r={radius}
      fill={teamColor(driver) ?? colors.textMuted}
      opacity={opacity}
      stroke={isSelected ? colors.accentGold : "none"}
      strokeWidth={isSelected ? 2 : 0}
      onPress={onPress}
    />
  );
}
