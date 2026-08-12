import { useMemo } from "react";
import { View, useWindowDimensions } from "react-native";
import { Polyline, Svg } from "react-native-svg";
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
import { colors } from "@f1-dashboard/tokens";
import { DriverDot } from "./DriverDot";

const VIEWBOX_WIDTH = 1000;
const VIEWBOX_HEIGHT = 600;
const PADDING = 40;

export interface TrackMapProps {
  sessionKey: number;
  live: boolean;
  selectedDriverNumber: number | undefined;
  onSelectDriver: (driverNumber: number) => void;
  onBackgroundPress: () => void;
}

function hasSignal(point: { x: number; y: number }): boolean {
  return point.x !== 0 || point.y !== 0;
}

// Mirrors apps/web/components/TrackMap.tsx: same hooks, same scaling
// approach (d3-scale is pure JS, no DOM dependency) — only the rendering
// layer differs (react-native-svg instead of native SVG DOM elements).
export function TrackMap({
  sessionKey,
  live,
  selectedDriverNumber,
  onSelectDriver,
  onBackgroundPress,
}: TrackMapProps) {
  const { width } = useWindowDimensions();
  const { data: session } = useSession(sessionKey);
  const { data: drivers } = useDrivers(sessionKey);
  const { data: positions } = usePositions(sessionKey, {
    refetchInterval: live ? 5000 : false,
  });
  const { data: locations } = useLocations(sessionKey, {
    live,
    anchorDate: session?.date_end,
  });

  const outlineDriverNumber = drivers?.[0]?.driver_number;
  const { data: outlinePoints } = useTrackOutline(
    sessionKey,
    outlineDriverNumber,
    session?.date_start,
  );

  const driversByNumber = useMemo(() => driverMap(drivers), [drivers]);
  const latestLocations = useMemo(
    () => latestByDriver(locations?.filter(hasSignal)),
    [locations],
  );

  const { xScale, yScale, trackPoints } = useMemo(() => {
    const validOutline = (outlinePoints ?? []).filter(hasSignal);
    const domainPoints =
      validOutline.length > 0 ? validOutline : Array.from(latestLocations.values());

    if (domainPoints.length === 0) {
      return { xScale: undefined, yScale: undefined, trackPoints: "" };
    }

    const xs = domainPoints.map((point) => point.x);
    const ys = domainPoints.map((point) => point.y);

    const xScale = scaleLinear()
      .domain([Math.min(...xs), Math.max(...xs)])
      .range([PADDING, VIEWBOX_WIDTH - PADDING]);
    const yScale = scaleLinear()
      .domain([Math.min(...ys), Math.max(...ys)])
      .range([VIEWBOX_HEIGHT - PADDING, PADDING]);

    const sortedOutline = [...validOutline].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    const trackPoints = sortedOutline
      .map((point) => `${xScale(point.x)},${yScale(point.y)}`)
      .join(" ");

    return { xScale, yScale, trackPoints };
  }, [outlinePoints, latestLocations]);

  if (!xScale || !yScale) {
    return null;
  }

  return (
    <View className="flex-1">
      <Svg
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        width={width}
        height={(width * VIEWBOX_HEIGHT) / VIEWBOX_WIDTH}
        onPress={onBackgroundPress}
      >
        <Polyline
          points={trackPoints}
          fill="none"
          stroke={colors.borderHairline}
          strokeWidth={2}
        />
        {Array.from(latestLocations.entries()).map(([driverNumber, point]) => {
          const driver = driversByNumber.get(driverNumber);
          if (!driver) return null;

          return (
            <DriverDot
              key={driverNumber}
              driver={driver}
              x={xScale(point.x)}
              y={yScale(point.y)}
              isSelected={driverNumber === selectedDriverNumber}
              hasSelection={selectedDriverNumber !== undefined}
              onPress={() => onSelectDriver(driverNumber)}
            />
          );
        })}
      </Svg>
    </View>
  );
}
