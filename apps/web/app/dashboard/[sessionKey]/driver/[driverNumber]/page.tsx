"use client";

import { useMemo } from "react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
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
  useSessionStore,
} from "@f1-dashboard/hooks";
import type { CarData, Driver, Lap } from "@f1-dashboard/types";
import { colors } from "@f1-dashboard/tokens";
import { DriverCompareToggle } from "@/components/DriverCompareToggle";
import { DriverHeader } from "@/components/DriverHeader";
import { LapTimeChart } from "@/components/LapTimeChart";
import { LiveIndicator } from "@/components/LiveIndicator";
import { ReplayBadge } from "@/components/ReplayBadge";
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

function domainFor(key: "speed" | "rpm", ...datasets: (CarData[] | undefined)[]): [number, number] | undefined {
  const values = datasets.flatMap((set) => (set ?? []).map((point) => point[key]));
  if (values.length === 0) return undefined;
  return [Math.min(...values), Math.max(...values)];
}

interface DriverTelemetry {
  laps: Lap[] | undefined;
  carData: CarData[] | undefined;
}

function useDriverTelemetry(
  sessionKey: number,
  live: boolean,
  driverNumber: number | undefined,
): DriverTelemetry {
  // driverNumber undefined means "no compare driver selected" here — unlike
  // FastestLapCard's use of useLaps, it must NOT fall through to "all drivers".
  const { data: laps } = useLaps(sessionKey, driverNumber, {
    refetchInterval: live ? 10000 : false,
    enabled: Boolean(driverNumber),
  });
  const window = fastestLapWindow(laps);
  const { data: carData } = useCarData(sessionKey, {
    driverNumber,
    dateFrom: window?.from,
    dateTo: window?.to,
  });

  return { laps, carData };
}

function DriverColumn({
  driver,
  position,
  gapToLeader,
  telemetry,
  speedDomain,
  rpmDomain,
}: {
  driver: Driver | undefined;
  position: number | undefined;
  gapToLeader: number | string | null | undefined;
  telemetry: DriverTelemetry;
  speedDomain: [number, number] | undefined;
  rpmDomain: [number, number] | undefined;
}) {
  const color = teamColor(driver) ?? colors.textMuted;
  const carData = telemetry.carData ?? [];

  return (
    <div className="flex flex-col gap-lg rounded-xl border border-border-hairline bg-bg-panel p-lg">
      <DriverHeader driver={driver} position={position} gapToLeader={gapToLeader} />
      <TelemetryChart metric="speed" data={carData} color={color} domain={speedDomain} />
      <TelemetryChart metric="throttle_brake" data={carData} color={color} />
      <TelemetryChart metric="rpm" data={carData} color={color} domain={rpmDomain} />
      <LapTimeChart laps={telemetry.laps ?? []} />
    </div>
  );
}

export default function DriverDetailPage() {
  const params = useParams<{ sessionKey: string; driverNumber: string }>();
  const sessionKey = Number(params.sessionKey);
  const driverNumber = Number(params.driverNumber);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const compareParam = searchParams.get("compare");
  const compareDriverNumber = compareParam ? Number(compareParam) : undefined;

  const { data: session } = useSession(sessionKey);
  const live = isSessionLive(session);
  const replayMode = useSessionStore((state) => state.replayMode);

  const { data: drivers } = useDrivers(sessionKey);
  const { data: positions } = usePositions(sessionKey, { refetchInterval: live ? 5000 : false });
  const { data: intervals } = useIntervals(sessionKey, { refetchInterval: live ? 5000 : false });

  const driversByNumber = useMemo(() => driverMap(drivers), [drivers]);
  const latestPositions = useMemo(() => latestByDriver(positions), [positions]);
  const latestIntervals = useMemo(() => latestByDriver(intervals), [intervals]);

  const primaryTelemetry = useDriverTelemetry(sessionKey, live, driverNumber);
  const compareTelemetry = useDriverTelemetry(sessionKey, live, compareDriverNumber);

  const isComparing = compareDriverNumber !== undefined;
  const speedDomain = isComparing
    ? domainFor("speed", primaryTelemetry.carData, compareTelemetry.carData)
    : undefined;
  const rpmDomain = isComparing
    ? domainFor("rpm", primaryTelemetry.carData, compareTelemetry.carData)
    : undefined;

  const addCompare = (nextDriverNumber: number) => {
    router.replace(`${pathname}?compare=${nextDriverNumber}`, { scroll: false });
  };
  const removeCompare = () => {
    router.replace(pathname, { scroll: false });
  };

  return (
    <main className="min-h-screen bg-bg-base px-lg py-2xl">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-lg">
        <div className="flex items-center justify-between gap-md">
          <div className="flex items-center gap-sm">
            {live && <LiveIndicator />}
            {!live && replayMode && <ReplayBadge />}
            <h1 className="text-lg font-medium text-text-primary">
              {session?.session_name ?? "Loading session…"} — Driver Detail
            </h1>
          </div>
          <DriverCompareToggle
            drivers={drivers}
            excludeDriverNumber={driverNumber}
            compareDriverNumber={compareDriverNumber}
            onAddCompare={addCompare}
            onRemoveCompare={removeCompare}
          />
        </div>

        <div className={isComparing ? "grid grid-cols-1 gap-lg md:grid-cols-2" : ""}>
          <DriverColumn
            driver={driversByNumber.get(driverNumber)}
            position={latestPositions.get(driverNumber)?.position}
            gapToLeader={latestIntervals.get(driverNumber)?.gap_to_leader}
            telemetry={primaryTelemetry}
            speedDomain={speedDomain}
            rpmDomain={rpmDomain}
          />
          {isComparing && (
            <DriverColumn
              driver={driversByNumber.get(compareDriverNumber)}
              position={latestPositions.get(compareDriverNumber)?.position}
              gapToLeader={latestIntervals.get(compareDriverNumber)?.gap_to_leader}
              telemetry={compareTelemetry}
              speedDomain={speedDomain}
              rpmDomain={rpmDomain}
            />
          )}
        </div>
      </div>
    </main>
  );
}
