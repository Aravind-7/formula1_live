import type { UseQueryResult } from "@tanstack/react-query";
import type { Stint } from "@f1-dashboard/types";
import { useLiveSession, type UseLiveSessionOptions } from "./useLiveSession";

export function useStints(
  sessionKey: number,
  options: UseLiveSessionOptions = {},
): UseQueryResult<Stint[]> {
  return useLiveSession(
    ["stints", sessionKey],
    sessionKey,
    (client, key) => client.getStints({ session_key: key }),
    { refetchInterval: 30000, ...options },
  );
}
