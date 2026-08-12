"use client";

import { useMemo } from "react";
import {
  driverMap,
  latestByDriver,
  teamColor,
  useDrivers,
  useIntervals,
  usePositions,
} from "@f1-dashboard/hooks";
import { formatGap } from "@/lib/format";

export function LeaderboardTable({ sessionKey, live }: { sessionKey: number; live: boolean }) {
  const { data: positions } = usePositions(sessionKey, { enabled: live });
  const { data: intervals } = useIntervals(sessionKey, { enabled: live });
  const { data: drivers } = useDrivers(sessionKey);

  const driversByNumber = useMemo(() => driverMap(drivers), [drivers]);
  const latestIntervals = useMemo(() => latestByDriver(intervals), [intervals]);

  const rows = useMemo(() => {
    const latest = latestByDriver(positions);
    return Array.from(latest.values()).sort((a, b) => a.position - b.position);
  }, [positions]);

  return (
    <div className="flex h-full flex-col gap-sm">
      <h3 className="text-sm font-medium text-text-muted">Leaderboard</h3>
      {rows.length === 0 ? (
        <p className="text-sm text-text-muted">No live position data.</p>
      ) : (
        <div className="flex flex-col gap-xs">
          {rows.map((position) => {
            const driver = driversByNumber.get(position.driver_number);
            const interval = latestIntervals.get(position.driver_number);
            const isLeader = position.position === 1;

            return (
              <div
                key={position.driver_number}
                className={`flex items-center gap-sm rounded px-sm py-xs ${
                  isLeader ? "bg-accent-primary/10" : ""
                }`}
              >
                <span
                  className="h-6 w-1 shrink-0 rounded-full bg-border-hairline"
                  style={{ backgroundColor: teamColor(driver) }}
                />
                <span className="w-6 text-sm text-text-muted">{position.position}</span>
                <span className="flex-1 text-sm font-medium text-text-primary">
                  {driver?.name_acronym ?? position.driver_number}
                </span>
                <span className="text-sm text-text-muted">
                  {isLeader ? "Leader" : formatGap(interval?.gap_to_leader)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
