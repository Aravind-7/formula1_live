import type { UseQueryResult } from "@tanstack/react-query";
import type { Location } from "@f1-dashboard/types";
import { useLiveSession, type UseLiveSessionOptions } from "./useLiveSession";

const OUTLINE_WINDOW_MS = 3 * 60 * 1000;

// The track shape isn't provided directly by OpenF1 — derive it by plotting
// one driver's location points over roughly one lap from session start.
// Fetched once (no polling): the circuit doesn't move.
export function useTrackOutline(
  sessionKey: number,
  driverNumber: number | undefined,
  sessionStartDate: string | null | undefined,
  options: UseLiveSessionOptions<Location[]> = {},
): UseQueryResult<Location[]> {
  return useLiveSession(
    ["track_outline", sessionKey, driverNumber],
    sessionKey,
    (client, key) => {
      if (!driverNumber || !sessionStartDate) return Promise.resolve([]);
      const from = new Date(sessionStartDate);
      const to = new Date(from.getTime() + OUTLINE_WINDOW_MS);
      return client.getLocations({
        session_key: key,
        driver_number: driverNumber,
        "date>": from.toISOString(),
        "date<": to.toISOString(),
      });
    },
    {
      refetchInterval: false,
      enabled: Boolean(driverNumber) && Boolean(sessionStartDate),
      ...options,
    },
  );
}
