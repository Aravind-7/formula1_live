import type { UseQueryResult } from "@tanstack/react-query";
import type { Lap } from "@f1-dashboard/types";
import { openF1Client } from "./client";
import { useLiveSession, type UseLiveSessionOptions } from "./useLiveSession";
import { useReplaySource } from "./useReplaySource";

export function useLaps(
  sessionKey: number,
  driverNumber?: number,
  options: UseLiveSessionOptions<Lap[]> = {},
): UseQueryResult<Lap[]> {
  const fetcher = (client: typeof openF1Client, key: number) =>
    client.getLaps({ session_key: key, driver_number: driverNumber });

  const replaySource = useReplaySource(
    ["laps", sessionKey, driverNumber],
    sessionKey,
    fetcher,
    (lap) => lap.date_start,
  );

  return useLiveSession(["laps", sessionKey, driverNumber], sessionKey, fetcher, {
    refetchInterval: 10000,
    replaySource,
    ...options,
  });
}
