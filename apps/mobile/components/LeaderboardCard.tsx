import { useMemo } from "react";
import { Text, View } from "react-native";
import {
  driverMap,
  latestByDriver,
  teamColor,
  useDrivers,
  useIntervals,
  usePositions,
} from "@f1-dashboard/hooks";
import { formatGap } from "@/lib/format";
import { Card } from "./Card";

export function LeaderboardCard({ sessionKey, live }: { sessionKey: number; live: boolean }) {
  // Always fetch — a finished session has final positions worth showing
  // even when it's not live. `live` only controls whether we keep polling.
  const { data: positions } = usePositions(sessionKey, {
    refetchInterval: live ? undefined : false,
  });
  const { data: intervals } = useIntervals(sessionKey, {
    refetchInterval: live ? undefined : false,
  });
  const { data: drivers } = useDrivers(sessionKey);

  const driversByNumber = useMemo(() => driverMap(drivers), [drivers]);
  const latestIntervals = useMemo(() => latestByDriver(intervals), [intervals]);
  const rows = useMemo(() => {
    const latest = latestByDriver(positions);
    return Array.from(latest.values()).sort((a, b) => a.position - b.position);
  }, [positions]);

  return (
    <Card>
      <Text className="mb-sm text-sm font-medium text-text-muted">Leaderboard</Text>
      {rows.length === 0 ? (
        <Text className="text-sm text-text-muted">No live position data.</Text>
      ) : (
        rows.map((position) => {
          const driver = driversByNumber.get(position.driver_number);
          const interval = latestIntervals.get(position.driver_number);
          const isLeader = position.position === 1;

          return (
            <View
              key={position.driver_number}
              className={`flex-row items-center gap-sm rounded px-sm py-xs ${
                isLeader ? "bg-accent-primary/10" : ""
              }`}
            >
              <View
                className="h-6 w-1 shrink-0 rounded-full bg-border-hairline"
                style={{ backgroundColor: teamColor(driver) }}
              />
              <Text className="w-6 text-sm text-text-muted">{position.position}</Text>
              <Text className="flex-1 text-sm font-medium text-text-primary">
                {driver?.name_acronym ?? position.driver_number}
              </Text>
              <Text className="text-sm text-text-muted">
                {isLeader ? "Leader" : formatGap(interval?.gap_to_leader)}
              </Text>
            </View>
          );
        })
      )}
    </Card>
  );
}
