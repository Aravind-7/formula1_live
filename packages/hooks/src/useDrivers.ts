import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { Driver } from "@f1-dashboard/types";
import { openF1Client } from "./client";

export function useDrivers(sessionKey: number): UseQueryResult<Driver[]> {
  return useQuery({
    queryKey: ["drivers", sessionKey],
    queryFn: () => openF1Client.getDrivers({ session_key: sessionKey }),
    staleTime: Infinity,
    enabled: Boolean(sessionKey),
  });
}
