"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Lap } from "@f1-dashboard/types";
import { colors } from "@f1-dashboard/tokens";
import { formatLapTime } from "@/lib/format";

export interface LapTimeChartProps {
  laps: Lap[];
}

interface DotProps {
  cx?: number;
  cy?: number;
  index?: number;
}

function bestOf(values: (number | null)[]): number | undefined {
  const valid = values.filter((value): value is number => value !== null);
  return valid.length > 0 ? Math.min(...valid) : undefined;
}

export function LapTimeChart({ laps }: LapTimeChartProps) {
  const validLaps = laps.filter((lap) => lap.lap_duration !== null && !lap.is_pit_out_lap);

  if (validLaps.length === 0) {
    return <p className="text-sm text-text-muted">No lap data yet.</p>;
  }

  const personalBest = bestOf(validLaps.map((lap) => lap.lap_duration));
  const bestSector1 = bestOf(validLaps.map((lap) => lap.duration_sector_1));
  const bestSector2 = bestOf(validLaps.map((lap) => lap.duration_sector_2));
  const bestSector3 = bestOf(validLaps.map((lap) => lap.duration_sector_3));

  const chartData = validLaps.map((lap) => ({
    lap: lap.lap_number,
    duration: lap.lap_duration as number,
    isPersonalBest: lap.lap_duration === personalBest,
    hasBestSector:
      lap.duration_sector_1 === bestSector1 ||
      lap.duration_sector_2 === bestSector2 ||
      lap.duration_sector_3 === bestSector3,
  }));

  function dotColor(index: number): string {
    const point = chartData[index];
    if (point.hasBestSector) return colors.signalPurple;
    if (point.isPersonalBest) return colors.signalGreen;
    return colors.signalAmber;
  }

  return (
    <div className="flex flex-col gap-xs">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-medium text-text-muted">Lap times</h4>
        <div className="flex items-center gap-sm text-xs text-text-muted">
          <span className="flex items-center gap-xs">
            <span className="h-2 w-2 rounded-full bg-signal-purple" /> Fastest sector
          </span>
          <span className="flex items-center gap-xs">
            <span className="h-2 w-2 rounded-full bg-signal-green" /> Personal best
          </span>
          <span className="flex items-center gap-xs">
            <span className="h-2 w-2 rounded-full bg-signal-amber" /> Slower
          </span>
        </div>
      </div>
      <div className="h-32 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="lap" tick={{ fontSize: 10, fill: colors.textMuted }} />
            <YAxis hide domain={["auto", "auto"]} />
            <Tooltip
              contentStyle={{
                backgroundColor: colors.bgPanel,
                border: `1px solid ${colors.borderHairline}`,
                fontSize: 12,
              }}
              formatter={(value) => formatLapTime(typeof value === "number" ? value : null)}
              labelFormatter={(lap) => `Lap ${lap}`}
            />
            <Line
              type="monotone"
              dataKey="duration"
              stroke={colors.borderHairline}
              strokeWidth={1}
              isAnimationActive={false}
              dot={({ cx, cy, index }: DotProps) =>
                cx !== undefined && cy !== undefined && index !== undefined ? (
                  <circle key={index} cx={cx} cy={cy} r={3} fill={dotColor(index)} />
                ) : (
                  <g key={index} />
                )
              }
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
