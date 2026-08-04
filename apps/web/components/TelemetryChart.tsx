"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { CarData } from "@f1-dashboard/types";
import { colors } from "@f1-dashboard/tokens";

export type TelemetryMetric = "speed" | "throttle_brake" | "rpm";

export interface TelemetryChartProps {
  metric: TelemetryMetric;
  data: CarData[];
  color: string;
  /** Shared Y-axis domain so two drivers' charts are visually comparable. */
  domain?: [number, number];
}

const METRIC_LABEL: Record<TelemetryMetric, string> = {
  speed: "Speed",
  throttle_brake: "Throttle / Brake",
  rpm: "RPM",
};

// Normalized to % of lap elapsed (not raw seconds) so two drivers' traces —
// who take different amounts of time to complete the lap — line up at the
// same track position rather than the same wall-clock offset.
function toChartData(data: CarData[]) {
  if (data.length === 0) return [];
  const startTime = new Date(data[0].date).getTime();
  const endTime = new Date(data[data.length - 1].date).getTime();
  const span = endTime - startTime || 1;

  return data.map((point) => ({
    t: ((new Date(point.date).getTime() - startTime) / span) * 100,
    speed: point.speed,
    throttle: point.throttle,
    brake: point.brake,
    rpm: point.rpm,
  }));
}

export function TelemetryChart({ metric, data, color, domain }: TelemetryChartProps) {
  const chartData = toChartData(data);
  const yDomain = domain ?? (metric === "throttle_brake" ? [0, 100] : ["auto", "auto"]);

  return (
    <div className="flex flex-col gap-xs">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-medium text-text-muted">{METRIC_LABEL[metric]}</h4>
        {metric === "throttle_brake" && (
          <div className="flex items-center gap-sm text-xs text-text-muted">
            <span className="flex items-center gap-xs">
              <span className="h-0.5 w-3" style={{ backgroundColor: color }} /> Throttle
            </span>
            <span className="flex items-center gap-xs">
              <span className="h-0.5 w-3 bg-signal-alert" /> Brake
            </span>
          </div>
        )}
      </div>
      <div className="h-24 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="t" hide type="number" domain={[0, 100]} />
            <YAxis hide domain={yDomain} />
            <Tooltip
              contentStyle={{
                backgroundColor: colors.bgPanel,
                border: `1px solid ${colors.borderHairline}`,
                fontSize: 12,
              }}
              labelFormatter={(t) => `${Number(t).toFixed(0)}% of lap`}
            />
            {metric === "throttle_brake" ? (
              <>
                <Line
                  type="monotone"
                  dataKey="throttle"
                  stroke={color}
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="brake"
                  stroke={colors.signalAlert}
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                  dot={false}
                  isAnimationActive={false}
                />
              </>
            ) : (
              <Line
                type="monotone"
                dataKey={metric}
                stroke={color}
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
