import { Text, View } from "react-native";
import { Circle, Polyline, Svg } from "react-native-svg";
import type { Lap } from "@f1-dashboard/types";
import { colors } from "@f1-dashboard/tokens";

export interface LapTimeChartProps {
  laps: Lap[];
}

const CHART_WIDTH = 300;
const CHART_HEIGHT = 100;

function bestOf(values: (number | null)[]): number | undefined {
  const valid = values.filter((value): value is number => value !== null);
  return valid.length > 0 ? Math.min(...valid) : undefined;
}

export function LapTimeChart({ laps }: LapTimeChartProps) {
  const validLaps = laps.filter((lap) => lap.lap_duration !== null && !lap.is_pit_out_lap);

  if (validLaps.length === 0) {
    return <Text className="text-sm text-text-muted">No lap data yet.</Text>;
  }

  const personalBest = bestOf(validLaps.map((lap) => lap.lap_duration));
  const bestSector1 = bestOf(validLaps.map((lap) => lap.duration_sector_1));
  const bestSector2 = bestOf(validLaps.map((lap) => lap.duration_sector_2));
  const bestSector3 = bestOf(validLaps.map((lap) => lap.duration_sector_3));

  const durations = validLaps.map((lap) => lap.lap_duration as number);
  const min = Math.min(...durations);
  const max = Math.max(...durations);
  const span = max - min || 1;

  const points = validLaps.map((lap, index) => {
    const x = (index / Math.max(1, validLaps.length - 1)) * CHART_WIDTH;
    const y = CHART_HEIGHT - (((lap.lap_duration as number) - min) / span) * CHART_HEIGHT;
    const hasBestSector =
      lap.duration_sector_1 === bestSector1 ||
      lap.duration_sector_2 === bestSector2 ||
      lap.duration_sector_3 === bestSector3;
    const isPersonalBest = lap.lap_duration === personalBest;
    const color = hasBestSector ? colors.signalPurple : isPersonalBest ? colors.signalGreen : colors.signalAmber;
    return { x, y, color, lap: lap.lap_number };
  });

  const polylinePoints = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <View className="gap-xs">
      <View className="flex-row items-center justify-between">
        <Text className="text-xs font-medium text-text-muted">Lap times</Text>
        <View className="flex-row items-center gap-sm">
          <View className="flex-row items-center gap-xs">
            <View className="h-2 w-2 rounded-full bg-signal-purple" />
            <Text className="text-xs text-text-muted">Fastest sector</Text>
          </View>
          <View className="flex-row items-center gap-xs">
            <View className="h-2 w-2 rounded-full bg-signal-green" />
            <Text className="text-xs text-text-muted">Personal best</Text>
          </View>
        </View>
      </View>
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        <Polyline points={polylinePoints} fill="none" stroke={colors.borderHairline} strokeWidth={1} />
        {points.map((point) => (
          <Circle key={point.lap} cx={point.x} cy={point.y} r={3} fill={point.color} />
        ))}
      </Svg>
    </View>
  );
}
