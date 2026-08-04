import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { RaceControlMessage } from "@f1-dashboard/types";
import { openF1Client } from "./client";

export function useRaceControl(sessionKey: number): UseQueryResult<RaceControlMessage[]> {
  return useQuery({
    queryKey: ["race_control", sessionKey],
    queryFn: () => openF1Client.getRaceControl({ session_key: sessionKey }),
    staleTime: Infinity,
    enabled: Boolean(sessionKey),
  });
}
