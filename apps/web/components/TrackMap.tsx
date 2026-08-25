"use client";

import { useMemo, useRef, useState } from "react";
import { scaleLinear } from "d3-scale";
import {
  driverMap,
  latestByDriver,
  useDrivers,
  useLocations,
  usePositions,
  useSession,
  useTrackOutline,
} from "@f1-dashboard/hooks";
import { DriverDot } from "./DriverDot";
import { DriverTooltip } from "./DriverTooltip";
import { ErrorState } from "./ErrorState";
import { TrackMapSkeleton } from "./TrackMapSkeleton";

const VIEWBOX_WIDTH = 1000;
const VIEWBOX_HEIGHT = 600;
const PADDING = 40;

export interface TrackMapProps {
  sessionKey: number;
  live: boolean;
  selectedDriverNumber: number | undefined;
  onSelectDriver: (driverNumber: number) => void;
}

function hasSignal(point: { x: number; y: number }): boolean {
  return point.x !== 0 || point.y !== 0;
}

export function TrackMap({
  sessionKey,
  live,
  selectedDriverNumber,
  onSelectDriver,
}: TrackMapProps) {
  const { data: session } = useSession(sessionKey);
  const { data: drivers } = useDrivers(sessionKey);
  const { data: positions } = usePositions(sessionKey, {
    refetchInterval: live ? 5000 : false,
  });

  // Live cars: a short recent window across every driver (the endpoint
  // rejects unfiltered/whole-session requests outright).
  const locationsQuery = useLocations(sessionKey, {
    live,
    anchorDate: session?.date_end,
  });
  const { data: locations } = locationsQuery;

  // Track shape: one driver's path over roughly a lap from session start —
  // fetched once, not polled, since the circuit itself never changes.
  const outlineDriverNumber = drivers?.[0]?.driver_number;
  const outlineQuery = useTrackOutline(sessionKey, outlineDriverNumber, session?.date_start);
  const { data: outlinePoints } = outlineQuery;

  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredDriverNumber, setHoveredDriverNumber] = useState<number | undefined>();
  const [hoverPoint, setHoverPoint] = useState<{ x: number; y: number } | undefined>();

  const driversByNumber = useMemo(() => driverMap(drivers), [drivers]);
  const latestPositions = useMemo(() => latestByDriver(positions), [positions]);
  const latestLocations = useMemo(
    () => latestByDriver(locations?.filter(hasSignal)),
    [locations],
  );

  const { xScale, yScale, trackPath } = useMemo(() => {
    const validOutline = (outlinePoints ?? []).filter(hasSignal);
    const domainPoints = validOutline.length > 0 ? validOutline : Array.from(latestLocations.values());

    if (domainPoints.length === 0) {
      return { xScale: undefined, yScale: undefined, trackPath: "" };
    }

    const xs = domainPoints.map((point) => point.x);
    const ys = domainPoints.map((point) => point.y);

    const xScale = scaleLinear()
      .domain([Math.min(...xs), Math.max(...xs)])
      .range([PADDING, VIEWBOX_WIDTH - PADDING]);
    // SVG y grows downward; flip the range so the map reads right-side up.
    const yScale = scaleLinear()
      .domain([Math.min(...ys), Math.max(...ys)])
      .range([VIEWBOX_HEIGHT - PADDING, PADDING]);

    const sortedOutline = [...validOutline].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    const trackPath = sortedOutline
      .map((point) => `${xScale(point.x)},${yScale(point.y)}`)
      .join(" ");

    return { xScale, yScale, trackPath };
  }, [outlinePoints, latestLocations]);

  if (locationsQuery.isLoading || outlineQuery.isLoading) {
    return <TrackMapSkeleton />;
  }

  if (locationsQuery.isError || outlineQuery.isError) {
    return (
      <div className="flex h-full w-full items-center justify-center p-2xl">
        <ErrorState
          message="Couldn't load track data."
          onRetry={() => {
            locationsQuery.refetch();
            outlineQuery.refetch();
          }}
        />
      </div>
    );
  }

  if (!xScale || !yScale) {
    return (
      <div className="flex h-full w-full items-center justify-center text-sm text-text-muted">
        No location data available.
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <svg viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} className="h-full w-full">
        <polyline
          points={trackPath}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="text-border-hairline"
        />
        {Array.from(latestLocations.entries()).map(([driverNumber, point]) => {
          const driver = driversByNumber.get(driverNumber);
          if (!driver) return null;

          const cx = xScale(point.x);
          const cy = yScale(point.y);

          return (
            <DriverDot
              key={driverNumber}
              driver={driver}
              x={cx}
              y={cy}
              isSelected={driverNumber === selectedDriverNumber}
              isHovered={driverNumber === hoveredDriverNumber}
              hasSelection={selectedDriverNumber !== undefined}
              onHoverStart={(event) => {
                const rect = containerRef.current?.getBoundingClientRect();
                setHoveredDriverNumber(driverNumber);
                if (rect) {
                  setHoverPoint({ x: event.clientX - rect.left, y: event.clientY - rect.top });
                }
              }}
              onHoverEnd={() => {
                setHoveredDriverNumber(undefined);
                setHoverPoint(undefined);
              }}
              onClick={() => onSelectDriver(driverNumber)}
            />
          );
        })}
      </svg>
      {hoveredDriverNumber !== undefined &&
        hoverPoint &&
        driversByNumber.get(hoveredDriverNumber) && (
          <DriverTooltip
            driver={driversByNumber.get(hoveredDriverNumber)!}
            position={latestPositions.get(hoveredDriverNumber)?.position}
            x={hoverPoint.x}
            y={hoverPoint.y}
          />
        )}
    </div>
  );
}
