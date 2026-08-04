import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { Location } from "@f1-dashboard/types";
import { openF1Client } from "./client";

// Full-session location history for one driver — verified safe unfiltered
// (unlike the all-drivers case, which OpenF1 rejects as "too much data").
// Used for the recap page's scroll-driven track map, not for live polling.
export function useDriverLocationHistory(
  sessionKey: number,
  driverNumber: number | undefined,
): UseQueryResult<Location[]> {
  return useQuery({
    queryKey: ["driver_location_history", sessionKey, driverNumber],
    queryFn: () =>
      openF1Client.getLocations({ session_key: sessionKey, driver_number: driverNumber }),
    staleTime: Infinity,
    enabled: Boolean(sessionKey) && Boolean(driverNumber),
  });
}
