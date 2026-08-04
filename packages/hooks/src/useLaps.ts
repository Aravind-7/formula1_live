import type { UseQueryResult } from "@tanstack/react-query";
import type { Lap } from "@f1-dashboard/types";
import { useLiveSession, type UseLiveSessionOptions } from "./useLiveSession";

export function useLaps(
  sessionKey: number,
  driverNumber?: number,
  options: UseLiveSessionOptions = {},
): UseQueryResult<Lap[]> {
  return useLiveSession(
    ["laps", sessionKey, driverNumber],
    sessionKey,
    (client, key) => client.getLaps({ session_key: key, driver_number: driverNumber }),
    { refetchInterval: 10000, ...options },
  );
}
