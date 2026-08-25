import type { UseQueryResult } from "@tanstack/react-query";
import type { Location } from "@f1-dashboard/types";
import { useLiveSession, type UseLiveSessionOptions } from "./useLiveSession";

export interface UseLocationsParams {
  /** Live sessions anchor the window to "now"; historical ones anchor to this. */
  live: boolean;
  anchorDate: string | null | undefined;
  /**
   * A driver to probe for the true last-known telemetry timestamp before
   * anchoring a historical window. A session's official end time is often
   * minutes after cars actually stop transmitting location data (in-lap,
   * parc fermé), so anchoring directly to it can land the window entirely
   * after the last real sample and return nothing. A single driver's data
   * isn't subject to the "too much data" rejection the unfiltered
   * all-drivers query hits (see useDriverLocationHistory), so it's safe to
   * probe with one unbounded lookup first. Ignored when live.
   */
  referenceDriverNumber?: number;
  windowSeconds?: number;
}

// OpenF1's /location endpoint rejects unfiltered requests ("too much data at
// once") — every call must be scoped to a short date window.
export function useLocations(
  sessionKey: number,
  { live, anchorDate, referenceDriverNumber, windowSeconds = 15 }: UseLocationsParams,
  options: UseLiveSessionOptions<Location[]> = {},
): UseQueryResult<Location[]> {
  return useLiveSession(
    ["locations", sessionKey, live, anchorDate, referenceDriverNumber, windowSeconds],
    sessionKey,
    async (client, key) => {
      if (live) {
        const anchor = new Date();
        const from = new Date(anchor.getTime() - windowSeconds * 1000);
        return client.getLocations({
          session_key: key,
          "date>": from.toISOString(),
          "date<": anchor.toISOString(),
        });
      }

      let anchor = anchorDate ? new Date(anchorDate) : new Date();

      if (referenceDriverNumber !== undefined && anchorDate) {
        const probe = await client.getLocations({
          session_key: key,
          driver_number: referenceDriverNumber,
          "date<": anchorDate,
        });
        const lastSample = probe[probe.length - 1];
        if (lastSample) {
          anchor = new Date(lastSample.date);
        }
      }

      const from = new Date(anchor.getTime() - windowSeconds * 1000);
      return client.getLocations({
        session_key: key,
        "date>": from.toISOString(),
        "date<": anchor.toISOString(),
      });
    },
    {
      refetchInterval: live ? 4000 : false,
      enabled: live || Boolean(anchorDate),
      ...options,
    },
  );
}
