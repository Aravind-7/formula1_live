import type { UseQueryResult } from "@tanstack/react-query";
import type { Location } from "@f1-dashboard/types";
import { useLiveSession, type UseLiveSessionOptions } from "./useLiveSession";

export interface UseLocationsParams {
  /** Live sessions anchor the window to "now"; historical ones anchor to this. */
  live: boolean;
  anchorDate: string | null | undefined;
  windowSeconds?: number;
}

// OpenF1's /location endpoint rejects unfiltered requests ("too much data at
// once") — every call must be scoped to a short date window.
export function useLocations(
  sessionKey: number,
  { live, anchorDate, windowSeconds = 15 }: UseLocationsParams,
  options: UseLiveSessionOptions = {},
): UseQueryResult<Location[]> {
  return useLiveSession(
    ["locations", sessionKey, live, anchorDate, windowSeconds],
    sessionKey,
    (client, key) => {
      const anchor = live ? new Date() : anchorDate ? new Date(anchorDate) : new Date();
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
