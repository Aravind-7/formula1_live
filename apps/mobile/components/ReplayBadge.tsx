import { Text, View } from "react-native";

// Deliberately not a pulsing dot like LiveIndicator — replay must never be
// visually confusable with genuine live data.
export function ReplayBadge() {
  return (
    <View className="rounded border border-border-hairline bg-bg-panel px-sm py-xs">
      <Text className="text-xs font-medium text-text-muted">Replay</Text>
    </View>
  );
}
