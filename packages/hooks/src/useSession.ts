import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { Session } from "@f1-dashboard/types";
import { openF1Client } from "./client";

export function useSession(sessionKey: number): UseQueryResult<Session | undefined> {
  return useQuery({
    queryKey: ["session", sessionKey],
    queryFn: () => openF1Client.getSessionByKey(sessionKey),
    staleTime: Infinity,
    enabled: Boolean(sessionKey),
  });
}
