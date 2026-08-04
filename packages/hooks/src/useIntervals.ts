import type { UseQueryResult } from "@tanstack/react-query";
import type { Interval } from "@f1-dashboard/types";
import { useLiveSession, type UseLiveSessionOptions } from "./useLiveSession";

export function useIntervals(
  sessionKey: number,
  options: UseLiveSessionOptions = {},
): UseQueryResult<Interval[]> {
  return useLiveSession(
    ["intervals", sessionKey],
    sessionKey,
    (client, key) => client.getIntervals({ session_key: key }),
    { refetchInterval: 5000, ...options },
  );
}
