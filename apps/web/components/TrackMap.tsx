"use client";

import { useMemo, useRef, useState } from "react";
import { scaleLinear } from "d3-scale";
import { useDrivers, useLocations, usePositions } from "@f1-dashboard/hooks";
import { driverMap, latestByDriver } from "@/lib/telemetry";
import { DriverDot } from "./DriverDot";
import { DriverTooltip } from "./DriverTooltip";

const VIEWBOX_WIDTH = 1000;
const VIEWBOX_HEIGHT = 600;
const PADDING = 40;

export interface TrackMapProps {
  sessionKey: number;
  live: boolean;
  selectedDriverNumber: number | undefined;
  onSelectDriver: (driverNumber: number) => void;
}

export function TrackMap({
  sessionKey,
  live,
  selectedDriverNumber,
  onSelectDriver,
}: TrackMapProps) {
  // Unlike Stage 2's cards, the track map fetches once even for a historical
  // session (per the doc's "live or replay" requirement) — only the ongoing
  // polling interval is gated on `live`, not the initial fetch.
  const { data: locations } = useLocations(sessionKey, {
    refetchInterval: live ? 4000 : false,
  });
  const { data: drivers } = useDrivers(sessionKey);
  const { data: positions } = usePositions(sessionKey, {
    refetchInterval: live ? 5000 : false,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredDriverNumber, setHoveredDriverNumber] = useState<number | undefined>();
  const [hoverPoint, setHoverPoint] = useState<{ x: number; y: number } | undefined>();

  const driversByNumber = useMemo(() => driverMap(drivers), [drivers]);
  const latestPositions = useMemo(() => latestByDriver(positions), [positions]);
  const latestLocations = useMemo(() => latestByDriver(locations), [locations]);

  const { xScale, yScale, trackPath } = useMemo(() => {
    if (!locations || locations.length === 0) {
      return { xScale: undefined, yScale: undefined, trackPath: "" };
    }

    const xs = locations.map((point) => point.x);
    const ys = locations.map((point) => point.y);

    const xScale = scaleLinear()
      .domain([Math.min(...xs), Math.max(...xs)])
      .range([PADDING, VIEWBOX_WIDTH - PADDING]);
    // SVG y grows downward; flip the range so the map reads right-side up.
    const yScale = scaleLinear()
      .domain([Math.min(...ys), Math.max(...ys)])
      .range([VIEWBOX_HEIGHT - PADDING, PADDING]);

    const outlineDriverNumber = locations[0].driver_number;
    const outlinePoints = locations
      .filter((point) => point.driver_number === outlineDriverNumber)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const trackPath = outlinePoints
      .map((point) => `${xScale(point.x)},${yScale(point.y)}`)
      .join(" ");

    return { xScale, yScale, trackPath };
  }, [locations]);

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
