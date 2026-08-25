"use client";

import { useMemo } from "react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import type { Lap } from "@f1-dashboard/types";
import { driverMap, useDrivers, useLaps } from "@f1-dashboard/hooks";
import { colors } from "@f1-dashboard/tokens";
import { formatLapTime } from "@/lib/format";
import { DataState } from "./DataState";
import { SkeletonBlock } from "./SkeletonBlock";

export function FastestLapCard({ sessionKey, live }: { sessionKey: number; live: boolean }) {
  // Always fetch — a finished session has lap data worth showing even when
  // it's not live. `live` only controls whether we keep polling.
  const lapsQuery = useLaps(sessionKey, undefined, {
    refetchInterval: live ? undefined : false,
  });
  const { data: drivers } = useDrivers(sessionKey);
  const driversByNumber = useMemo(() => driverMap(drivers), [drivers]);

  const fastestLap = useMemo<Lap | undefined>(() => {
    const valid = (lapsQuery.data ?? []).filter(
      (lap) => lap.lap_duration !== null && !lap.is_pit_out_lap,
    );
    return valid.reduce<Lap | undefined>((fastest, lap) => {
      if (!fastest || (lap.lap_duration ?? Infinity) < (fastest.lap_duration ?? Infinity)) {
        return lap;
      }
      return fastest;
    }, undefined);
  }, [lapsQuery.data]);

  const sparkline = useMemo(() => {
    if (!fastestLap) return [];
    return (lapsQuery.data ?? [])
      .filter((lap) => lap.driver_number === fastestLap.driver_number && lap.lap_duration !== null)
      .slice(-5)
      .map((lap) => ({ lap: lap.lap_number, duration: lap.lap_duration as number }));
  }, [lapsQuery.data, fastestLap]);

  const driver = fastestLap ? driversByNumber.get(fastestLap.driver_number) : undefined;

  return (
    <div className="flex h-full flex-col gap-sm">
      <h3 className="text-sm font-medium text-text-muted">Fastest lap</h3>
      <DataState
        query={lapsQuery}
        skeleton={<SkeletonBlock className="h-12 w-full" />}
        emptyMessage="No lap data yet."
        isEmpty={() => fastestLap === undefined}
      >
        {() => (
          <>
            <div>
              <p className="text-base font-medium text-accent-gold">
                {driver?.name_acronym ?? fastestLap!.driver_number}
              </p>
              <p className="text-sm text-text-primary">{formatLapTime(fastestLap!.lap_duration)}</p>
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
      </DataState>
    </div>
  );
}
