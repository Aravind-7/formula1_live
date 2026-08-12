"use client";

import { useMemo } from "react";
import { scaleLinear } from "d3-scale";
import { driverMap, useDriverLocationHistory, useDrivers } from "@f1-dashboard/hooks";
import { DriverDot } from "./DriverDot";

const VIEWBOX_WIDTH = 1000;
const VIEWBOX_HEIGHT = 600;
const PADDING = 40;

function hasSignal(point: { x: number; y: number }): boolean {
  return point.x !== 0 || point.y !== 0;
}

const noop = () => {};

export interface RecapTrackMapProps {
  sessionKey: number;
  driverNumber: number;
  /** 0-1, driven by scroll position rather than a live/replay clock. */
  progress: number;
}

// Reuses Stage 3's DriverDot and coordinate-scaling approach, but — since
// this is always a finished, historical race — drives the single dot's
// position from scroll percentage through one driver's full-session path,
// not from polling. Scoped to one driver (the winner) rather than the whole
// field: fetching every driver's full-race location unfiltered is what
// triggers OpenF1's "too much data" rejection (see useLocations).
export function RecapTrackMap({ sessionKey, driverNumber, progress }: RecapTrackMapProps) {
  const { data: locations } = useDriverLocationHistory(sessionKey, driverNumber);
  const { data: drivers } = useDrivers(sessionKey);
  const driversByNumber = useMemo(() => driverMap(drivers), [drivers]);
  const driver = driversByNumber.get(driverNumber);

  const { xScale, yScale, trackPath, currentPoint } = useMemo(() => {
    const validPoints = (locations ?? []).filter(hasSignal);
    if (validPoints.length === 0) {
      return { xScale: undefined, yScale: undefined, trackPath: "", currentPoint: undefined };
    }

    const sorted = [...validPoints].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    const xs = sorted.map((point) => point.x);
    const ys = sorted.map((point) => point.y);

    const xScale = scaleLinear()
      .domain([Math.min(...xs), Math.max(...xs)])
      .range([PADDING, VIEWBOX_WIDTH - PADDING]);
    const yScale = scaleLinear()
      .domain([Math.min(...ys), Math.max(...ys)])
      .range([VIEWBOX_HEIGHT - PADDING, PADDING]);

    const trackPath = sorted.map((point) => `${xScale(point.x)},${yScale(point.y)}`).join(" ");
    const index = Math.min(sorted.length - 1, Math.max(0, Math.floor(progress * (sorted.length - 1))));

    return { xScale, yScale, trackPath, currentPoint: sorted[index] };
  }, [locations, progress]);

  if (!xScale || !yScale || !driver) {
    return (
      <div className="flex h-64 w-full items-center justify-center text-sm text-text-muted sm:h-96">
        No location data available.
      </div>
    );
  }

  return (
    <div className="relative h-64 w-full sm:h-96">
      <svg viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} className="h-full w-full">
        <polyline
          points={trackPath}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="text-border-hairline"
        />
        {currentPoint && (
          <DriverDot
            driver={driver}
            x={xScale(currentPoint.x)}
            y={yScale(currentPoint.y)}
            isSelected
            isHovered={false}
            hasSelection={false}
            onHoverStart={noop}
            onHoverEnd={noop}
            onClick={noop}
          />
        )}
      </svg>
    </div>
  );
}
