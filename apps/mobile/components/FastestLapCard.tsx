import { useMemo } from "react";
import { Text, View } from "react-native";
import { Polyline, Svg } from "react-native-svg";
import type { Lap } from "@f1-dashboard/types";
import { driverMap, useDrivers, useLaps } from "@f1-dashboard/hooks";
import { colors } from "@f1-dashboard/tokens";
import { formatLapTime } from "@/lib/format";
import { Card } from "./Card";

const SPARKLINE_WIDTH = 120;
const SPARKLINE_HEIGHT = 32;

export function FastestLapCard({ sessionKey, live }: { sessionKey: number; live: boolean }) {
  // Always fetch — a finished session has lap data worth showing even when
  // it's not live. `live` only controls whether we keep polling.
  const { data: laps } = useLaps(sessionKey, undefined, {
    refetchInterval: live ? undefined : false,
  });
  const { data: drivers } = useDrivers(sessionKey);
  const driversByNumber = useMemo(() => driverMap(drivers), [drivers]);

  const fastestLap = useMemo<Lap | undefined>(() => {
    const valid = (laps ?? []).filter((lap) => lap.lap_duration !== null && !lap.is_pit_out_lap);
    return valid.reduce<Lap | undefined>((fastest, lap) => {
      if (!fastest || (lap.lap_duration ?? Infinity) < (fastest.lap_duration ?? Infinity)) {
        return lap;
      }
      return fastest;
    }, undefined);
  }, [laps]);

  const sparklinePoints = useMemo(() => {
    if (!fastestLap) return "";
    const recent = (laps ?? [])
      .filter((lap) => lap.driver_number === fastestLap.driver_number && lap.lap_duration !== null)
      .slice(-5)
      .map((lap) => lap.lap_duration as number);
    if (recent.length < 2) return "";

    const min = Math.min(...recent);
    const max = Math.max(...recent);
    const span = max - min || 1;
    return recent
      .map((duration, index) => {
        const x = (index / (recent.length - 1)) * SPARKLINE_WIDTH;
        const y = SPARKLINE_HEIGHT - ((duration - min) / span) * SPARKLINE_HEIGHT;
        return `${x},${y}`;
      })
      .join(" ");
  }, [laps, fastestLap]);

  const driver = fastestLap ? driversByNumber.get(fastestLap.driver_number) : undefined;

  return (
    <Card>
      <Text className="mb-sm text-sm font-medium text-text-muted">Fastest lap</Text>
      {!fastestLap ? (
        <Text className="text-sm text-text-muted">No lap data yet.</Text>
      ) : (
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-base font-medium text-accent-gold">
              {driver?.name_acronym ?? fastestLap.driver_number}
            </Text>
            <Text className="text-sm text-text-primary">{formatLapTime(fastestLap.lap_duration)}</Text>
          </View>
          {sparklinePoints.length > 0 && (
            <Svg width={SPARKLINE_WIDTH} height={SPARKLINE_HEIGHT}>
              <Polyline
                points={sparklinePoints}
                fill="none"
                stroke={colors.accentGold}
                strokeWidth={2}
              />
            </Svg>
          )}
        </View>
      )}
    </Card>
  );
}
