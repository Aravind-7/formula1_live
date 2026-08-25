import { Text, View } from "react-native";
import type { Driver } from "@f1-dashboard/types";
import { teamColor } from "@f1-dashboard/hooks";
import { colors } from "@f1-dashboard/tokens";
import { darkenHex } from "@/lib/color";
import { formatGap } from "@/lib/format";
import { DriverAvatar } from "./DriverAvatar";

export interface DriverHeaderProps {
  driver: Driver | undefined;
  position: number | undefined;
  gapToLeader: number | string | null | undefined;
}

export function DriverHeader({ driver, position, gapToLeader }: DriverHeaderProps) {
  if (!driver) {
    return <Text className="text-sm text-text-muted">Loading driver…</Text>;
  }

  const chipBackground = teamColor(driver) ?? colors.textMuted;
  const chipText = darkenHex(chipBackground);

  return (
    <View className="flex-row items-center gap-md">
      <DriverAvatar driver={driver} size={56} />
      <View className="flex-1">
        <Text className="text-lg font-medium text-text-primary">{driver.full_name}</Text>
        <View
          className="mt-xs self-start rounded px-sm py-xs"
          style={{ backgroundColor: chipBackground }}
        >
          <Text className="text-xs font-medium" style={{ color: chipText }}>
            {driver.team_name}
          </Text>
        </View>
      </View>
      <View className="items-end">
        {position !== undefined && (
          <Text className="font-medium text-text-primary">P{position}</Text>
        )}
        <Text className="text-sm text-text-muted">{formatGap(gapToLeader)}</Text>
      </View>
    </View>
  );
}
