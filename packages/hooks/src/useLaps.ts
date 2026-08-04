import type { UseQueryResult } from "@tanstack/react-query";
import type { Lap } from "@f1-dashboard/types";
import { useLiveSession, type UseLiveSessionOptions } from "./useLiveSession";

export function useLaps(
  sessionKey: number,
  options: UseLiveSessionOptions = {},
): UseQueryResult<Lap[]> {
  return useLiveSession(
    ["laps", sessionKey],
    sessionKey,
    (client, key) => client.getLaps({ session_key: key }),
    { refetchInterval: 10000, ...options },
  );
}
