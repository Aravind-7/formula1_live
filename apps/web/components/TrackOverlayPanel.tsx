"use client";

import { useMemo } from "react";
import type { Driver, Position } from "@f1-dashboard/types";
import { driverMap, latestByDriver, teamColor } from "@f1-dashboard/hooks";

export interface TrackOverlayPanelProps {
  drivers: Driver[] | undefined;
  positions: Position[] | undefined;
  selectedDriverNumber: number | undefined;
  onSelect: (driverNumber: number) => void;
}

export function TrackOverlayPanel({
  drivers,
  positions,
  selectedDriverNumber,
  onSelect,
}: TrackOverlayPanelProps) {
  const driversByNumber = useMemo(() => driverMap(drivers), [drivers]);
  const rows = useMemo(() => {
    const latest = latestByDriver(positions);
    return Array.from(latest.values()).sort((a, b) => a.position - b.position);
  }, [positions]);

  return (
    <div className="absolute left-lg top-lg flex max-h-[80vh] w-48 flex-col gap-xs overflow-y-auto rounded-xl border border-border-hairline bg-bg-panel/85 p-sm">
      {rows.length === 0 ? (
        <p className="px-sm py-xs text-xs text-text-muted">No live position data.</p>
      ) : (
        rows.map((position) => {
          const driver = driversByNumber.get(position.driver_number);
          const isSelected = position.driver_number === selectedDriverNumber;

          return (
            <button
              key={position.driver_number}
              type="button"
              onClick={() => onSelect(position.driver_number)}
              className={`flex items-center gap-sm rounded px-sm py-xs text-left text-sm ${
                isSelected ? "bg-accent-primary/20" : ""
              }`}
            >
              <span
                className="h-4 w-1 shrink-0 rounded-full bg-border-hairline"
                style={{ backgroundColor: teamColor(driver) }}
              />
              <span className="w-5 text-text-muted">{position.position}</span>
              <span className="text-text-primary">
                {driver?.name_acronym ?? position.driver_number}
              </span>
            </button>
          );
        })
      )}
    </div>
  );
}
