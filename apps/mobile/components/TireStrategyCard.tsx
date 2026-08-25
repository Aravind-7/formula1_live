import { useMemo } from "react";
import { Text, View } from "react-native";
import type { Stint, TyreCompound } from "@f1-dashboard/types";
import { driverMap, useDrivers, useStints } from "@f1-dashboard/hooks";
import { Card } from "./Card";

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

export function TireStrategyCard({ sessionKey, live }: { sessionKey: number; live: boolean }) {
  // Always fetch — a finished session has final stint data worth showing
  // even when it's not live. `live` only controls whether we keep polling.
  const { data: stints } = useStints(sessionKey, { refetchInterval: live ? undefined : false });
  const { data: drivers } = useDrivers(sessionKey);
  const driversByNumber = useMemo(() => driverMap(drivers), [drivers]);
  const stintsByDriver = useMemo(() => groupByDriver(stints), [stints]);

  const totalLaps = useMemo(
    () => Math.max(1, ...(stints ?? []).map((stint) => stint.lap_end)),
    [stints],
  );

  return (
    <Card>
      <Text className="mb-sm text-sm font-medium text-text-muted">Tire strategy</Text>
      {stintsByDriver.size === 0 ? (
        <Text className="text-sm text-text-muted">No stint data yet.</Text>
      ) : (
        Array.from(stintsByDriver.entries()).map(([driverNumber, driverStints]) => {
          const driver = driversByNumber.get(driverNumber);
          const sorted = [...driverStints].sort((a, b) => a.stint_number - b.stint_number);
          const latest = sorted.at(-1);

          return (
            <View key={driverNumber} className="mb-xs flex-row items-center gap-sm">
              <Text className="w-10 shrink-0 text-sm text-text-primary">
                {driver?.name_acronym ?? driverNumber}
              </Text>
              <View className="h-3 flex-1 flex-row overflow-hidden rounded-full bg-bg-base">
                {sorted.map((stint) => (
                  <View
                    key={stint.stint_number}
                    className={COMPOUND_CLASS[stint.compound]}
                    style={{ flex: (stint.lap_end - stint.lap_start + 1) / totalLaps }}
                  />
                ))}
              </View>
              <Text className="w-20 shrink-0 text-right text-xs text-text-muted">
                {latest?.compound}
              </Text>
            </View>
          );
        })
      )}
    </Card>
  );
}
