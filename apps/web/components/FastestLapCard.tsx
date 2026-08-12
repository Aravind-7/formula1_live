"use client";

import { useMemo } from "react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import type { Lap } from "@f1-dashboard/types";
import { driverMap, useDrivers, useLaps } from "@f1-dashboard/hooks";
import { colors } from "@f1-dashboard/tokens";
import { formatLapTime } from "@/lib/format";

export function FastestLapCard({ sessionKey, live }: { sessionKey: number; live: boolean }) {
  const { data: laps } = useLaps(sessionKey, undefined, { enabled: live });
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

  const sparkline = useMemo(() => {
    if (!fastestLap) return [];
    return (laps ?? [])
      .filter((lap) => lap.driver_number === fastestLap.driver_number && lap.lap_duration !== null)
      .slice(-5)
      .map((lap) => ({ lap: lap.lap_number, duration: lap.lap_duration as number }));
  }, [laps, fastestLap]);

  const driver = fastestLap ? driversByNumber.get(fastestLap.driver_number) : undefined;

  return (
    <div className="flex h-full flex-col gap-sm">
      <h3 className="text-sm font-medium text-text-muted">Fastest lap</h3>
      {!fastestLap ? (
        <p className="text-sm text-text-muted">No lap data yet.</p>
      ) : (
        <>
          <div>
            <p className="text-base font-medium text-accent-gold">
              {driver?.name_acronym ?? fastestLap.driver_number}
            </p>
            <p className="text-sm text-text-primary">{formatLapTime(fastestLap.lap_duration)}</p>
          </div>
          {sparkline.length > 1 && (
            <div className="h-12 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparkline}>
                  <Line
                    type="monotone"
                    dataKey="duration"
                    stroke={colors.accentGold}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
}
