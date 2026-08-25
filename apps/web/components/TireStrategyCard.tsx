"use client";

import { useMemo } from "react";
import type { Stint, TyreCompound } from "@f1-dashboard/types";
import { driverMap, useDrivers, useStints } from "@f1-dashboard/hooks";
import { DataState } from "./DataState";
import { SkeletonBlock } from "./SkeletonBlock";

// Soft/medium/hard don't have dedicated tokens — reuse the existing signal
// colors plus text-muted/accent-primary rather than introducing new hex.
const COMPOUND_CLASS: Record<TyreCompound, string> = {
  SOFT: "bg-signal-purple",
  MEDIUM: "bg-signal-amber",
  HARD: "bg-text-muted",
  INTERMEDIATE: "bg-signal-green",
  WET: "bg-accent-primary",
};

function groupByDriver(stints: Stint[] | undefined): Map<number, Stint[]> {
  const map = new Map<number, Stint[]>();
  for (const stint of stints ?? []) {
    const existing = map.get(stint.driver_number) ?? [];
    existing.push(stint);
    map.set(stint.driver_number, existing);
  }
  return map;
}

function TireStrategySkeleton() {
  return (
    <div className="flex flex-col gap-sm">
      {Array.from({ length: 3 }).map((_, index) => (
        <SkeletonBlock key={index} className="h-3 w-full" />
      ))}
    </div>
  );
}

export function TireStrategyCard({ sessionKey, live }: { sessionKey: number; live: boolean }) {
  // Always fetch — a finished session has final stint data worth showing
  // even when it's not live. `live` only controls whether we keep polling.
  const stintsQuery = useStints(sessionKey, { refetchInterval: live ? undefined : false });
  const { data: drivers } = useDrivers(sessionKey);
  const driversByNumber = useMemo(() => driverMap(drivers), [drivers]);
  const stintsByDriver = useMemo(() => groupByDriver(stintsQuery.data), [stintsQuery.data]);

  const totalLaps = useMemo(
    () => Math.max(1, ...(stintsQuery.data ?? []).map((stint) => stint.lap_end)),
    [stintsQuery.data],
  );

  return (
    <div className="flex h-full flex-col gap-sm">
      <h3 className="text-sm font-medium text-text-muted">Tire strategy</h3>
      <DataState
        query={stintsQuery}
        skeleton={<TireStrategySkeleton />}
        emptyMessage="No stint data yet."
        isEmpty={() => stintsByDriver.size === 0}
      >
        {() => (
          <div className="flex flex-col gap-sm">
            {Array.from(stintsByDriver.entries()).map(([driverNumber, driverStints]) => {
              const driver = driversByNumber.get(driverNumber);
              const sorted = [...driverStints].sort((a, b) => a.stint_number - b.stint_number);
              const latest = sorted.at(-1);

              return (
                <div key={driverNumber} className="flex items-center gap-sm">
                  <span className="w-10 shrink-0 text-sm text-text-primary">
                    {driver?.name_acronym ?? driverNumber}
                  </span>
                  <div className="flex h-3 flex-1 overflow-hidden rounded-full bg-bg-base">
                    {sorted.map((stint) => (
                      <div
                        key={stint.stint_number}
                        className={COMPOUND_CLASS[stint.compound]}
                        style={{
                          width: `${((stint.lap_end - stint.lap_start + 1) / totalLaps) * 100}%`,
                        }}
                        title={`${stint.compound} — laps ${stint.lap_start}-${stint.lap_end}`}
                      />
                    ))}
                  </div>
                  <span className="w-24 shrink-0 text-right text-xs text-text-muted">
                    {latest?.compound}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </DataState>
    </div>
  );
}
