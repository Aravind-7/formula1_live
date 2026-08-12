import { router, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { isSessionLive, useDrivers, usePositions, useSession } from "@f1-dashboard/hooks";
import { LiveIndicator } from "@/components/LiveIndicator";
import { TrackMap } from "@/components/TrackMap";
import { TrackOverlayPanel } from "@/components/TrackOverlayPanel";

export default function TrackScreen() {
  const { sessionKey: sessionKeyParam, driver: driverParam } = useLocalSearchParams<{
    sessionKey: string;
    driver?: string;
  }>();
  const sessionKey = Number(sessionKeyParam);
  const selectedDriverNumber = driverParam ? Number(driverParam) : undefined;

  const { data: session } = useSession(sessionKey);
  const live = isSessionLive(session);

  const { data: drivers } = useDrivers(sessionKey);
  const { data: positions } = usePositions(sessionKey, { refetchInterval: live ? 5000 : false });

  // Same architecture as web: selection lives in the route params, not in
  // local/global state. setParams behaves like the web's query-param sync.
  const selectDriver = (driverNumber: number) => {
    router.setParams({ driver: String(driverNumber) });
  };
  const clearSelection = () => {
    router.setParams({ driver: undefined });
  };

  return (
    <View className="flex-1 bg-bg-base">
      <View className="flex-row items-center gap-sm border-b border-border-hairline p-lg">
        {live && <LiveIndicator />}
        <Text className="text-lg font-medium text-text-primary">
          {session?.session_name ?? "Loading session…"} — Track Map
        </Text>
      </View>
      <View className="relative flex-1">
        <TrackMap
          sessionKey={sessionKey}
          live={live}
          selectedDriverNumber={selectedDriverNumber}
          onSelectDriver={selectDriver}
          onBackgroundPress={clearSelection}
        />
        <TrackOverlayPanel
          drivers={drivers}
          positions={positions}
          selectedDriverNumber={selectedDriverNumber}
          onSelect={selectDriver}
        />
      </View>
    </View>
  );
}
