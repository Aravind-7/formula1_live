import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { PitStop } from "@f1-dashboard/types";
import { openF1Client } from "./client";

export function usePitStops(sessionKey: number): UseQueryResult<PitStop[]> {
  return useQuery({
    queryKey: ["pit_stops", sessionKey],
    queryFn: () => openF1Client.getPitStops({ session_key: sessionKey }),
    staleTime: Infinity,
    enabled: Boolean(sessionKey),
  });
}
