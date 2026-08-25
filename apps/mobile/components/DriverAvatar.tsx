import { useState } from "react";
import { Image, Text, View } from "react-native";
import type { Driver } from "@f1-dashboard/types";
import { colors } from "@f1-dashboard/tokens";
import { darkenHex } from "@/lib/color";

export function DriverAvatar({ driver, size = 40 }: { driver: Driver; size?: number }) {
  const [imageFailed, setImageFailed] = useState(false);
  const chipBackground = driver.team_colour ? `#${driver.team_colour}` : colors.textMuted;
  const chipText = darkenHex(chipBackground);

  if (driver.headshot_url && !imageFailed) {
    return (
      <Image
        source={{ uri: driver.headshot_url }}
        onError={() => setImageFailed(true)}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: chipBackground,
        }}
      />
    );
  }

  return (
    <View
      className="items-center justify-center"
      style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: chipBackground }}
    >
      <Text className="text-sm font-medium" style={{ color: chipText }}>
        {driver.name_acronym}
      </Text>
    </View>
  );
}
