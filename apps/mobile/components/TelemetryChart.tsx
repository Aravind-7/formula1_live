import { Text, View } from "react-native";
import { Polyline, Svg } from "react-native-svg";
import type { CarData } from "@f1-dashboard/types";
import { colors } from "@f1-dashboard/tokens";

export type TelemetryMetric = "speed" | "throttle_brake" | "rpm";

export interface TelemetryChartProps {
  metric: TelemetryMetric;
  data: CarData[];
  color: string;
}

const METRIC_LABEL: Record<TelemetryMetric, string> = {
  speed: "Speed",
  throttle_brake: "Throttle / Brake",
  rpm: "RPM",
};

const CHART_WIDTH = 300;
const CHART_HEIGHT = 80;

// Normalized to % of lap elapsed (not raw seconds), matching the web
// version — see apps/web/components/TelemetryChart.tsx for why.
function toPoints(data: CarData[], key: "speed" | "throttle" | "brake" | "rpm"): string {
  if (data.length === 0) return "";
  const startTime = new Date(data[0].date).getTime();
  const endTime = new Date(data[data.length - 1].date).getTime();
  const span = endTime - startTime || 1;
  const values = data.map((point) => point[key]);
  const min = key === "throttle" || key === "brake" ? 0 : Math.min(...values);
  const max = key === "throttle" || key === "brake" ? 100 : Math.max(...values);
  const valueSpan = max - min || 1;

  return data
    .map((point) => {
      const t = ((new Date(point.date).getTime() - startTime) / span) * CHART_WIDTH;
      const v = CHART_HEIGHT - ((point[key] - min) / valueSpan) * CHART_HEIGHT;
      return `${t},${v}`;
    })
    .join(" ");
}

export function TelemetryChart({ metric, data, color }: TelemetryChartProps) {
  return (
    <View className="gap-xs">
      <View className="flex-row items-center justify-between">
        <Text className="text-xs font-medium text-text-muted">{METRIC_LABEL[metric]}</Text>
        {metric === "throttle_brake" && (
          <View className="flex-row items-center gap-sm">
            <View className="flex-row items-center gap-xs">
              <View className="h-0.5 w-3" style={{ backgroundColor: color }} />
              <Text className="text-xs text-text-muted">Throttle</Text>
            </View>
            <View className="flex-row items-center gap-xs">
              <View className="h-0.5 w-3 bg-signal-alert" />
              <Text className="text-xs text-text-muted">Brake</Text>
            </View>
          </View>
        )}
      </View>
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        {metric === "throttle_brake" ? (
          <>
            <Polyline points={toPoints(data, "throttle")} fill="none" stroke={color} strokeWidth={1.5} />
            <Polyline
              points={toPoints(data, "brake")}
              fill="none"
              stroke={colors.signalAlert}
              strokeWidth={1.5}
            />
          </>
        ) : (
          <Polyline points={toPoints(data, metric)} fill="none" stroke={color} strokeWidth={1.5} />
        )}
      </Svg>
    </View>
  );
}
