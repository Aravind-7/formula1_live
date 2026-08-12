import { useMemo } from "react";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text } from "react-native";
import type { CarData, Lap } from "@f1-dashboard/types";
import {
  driverMap,
  isSessionLive,
  latestByDriver,
  teamColor,
  useCarData,
  useDrivers,
  useIntervals,
  useLaps,
  usePositions,
  useSession,
} from "@f1-dashboard/hooks";
import { colors } from "@f1-dashboard/tokens";
import { DriverHeader } from "@/components/DriverHeader";
import { LapTimeChart } from "@/components/LapTimeChart";
import { TelemetryChart } from "@/components/TelemetryChart";

function fastestLapWindow(laps: Lap[] | undefined): { from: string; to: string } | undefined {
  const valid = (laps ?? []).filter((lap) => lap.lap_duration !== null && !lap.is_pit_out_lap);
  if (valid.length === 0) return undefined;

  const fastest = valid.reduce((best, lap) =>
    (lap.lap_duration as number) < (best.lap_duration as number) ? lap : best,
  );
  const from = new Date(fastest.date_start);
  const to = new Date(from.getTime() + (fastest.lap_duration as number) * 1000);
  return { from: from.toISOString(), to: to.toISOString() };
}

export default function DriverDetailScreen() {
  const { sessionKey: sessionKeyParam, driverNumber: driverNumberParam } = useLocalSearchParams<{
    sessionKey: string;
    driverNumber: string;
  }>();
  const sessionKey = Number(sessionKeyParam);
  const driverNumber = Number(driverNumberParam);

  const { data: session } = useSession(sessionKey);
  const live = isSessionLive(session);

  const { data: drivers } = useDrivers(sessionKey);
  const { data: positions } = usePositions(sessionKey, { refetchInterval: live ? 5000 : false });
  const { data: intervals } = useIntervals(sessionKey, { refetchInterval: live ? 5000 : false });

  const driversByNumber = useMemo(() => driverMap(drivers), [drivers]);
  const latestPositions = useMemo(() => latestByDriver(positions), [positions]);
  const latestIntervals = useMemo(() => latestByDriver(intervals), [intervals]);

  const { data: laps } = useLaps(sessionKey, driverNumber, {
    refetchInterval: live ? 10000 : false,
  });
  const window = fastestLapWindow(laps);
  const { data: carData } = useCarData(sessionKey, {
    driverNumber,
    dateFrom: window?.from,
    dateTo: window?.to,
  });

  const driver = driversByNumber.get(driverNumber);
  const color = teamColor(driver) ?? colors.textMuted;
  const data: CarData[] = carData ?? [];

  return (
    <ScrollView className="flex-1 bg-bg-base" contentContainerClassName="gap-lg p-lg">
      <Text className="text-lg font-medium text-text-primary">
        {session?.session_name ?? "Loading session…"} — Driver Detail
      </Text>
      <DriverHeader
        driver={driver}
        position={latestPositions.get(driverNumber)?.position}
        gapToLeader={latestIntervals.get(driverNumber)?.gap_to_leader}
      />
      <TelemetryChart metric="speed" data={data} color={color} />
      <TelemetryChart metric="throttle_brake" data={data} color={color} />
      <TelemetryChart metric="rpm" data={data} color={color} />
      <LapTimeChart laps={laps ?? []} />
    </ScrollView>
  );
}
