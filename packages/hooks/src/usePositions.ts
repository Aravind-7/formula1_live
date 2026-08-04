import type { UseQueryResult } from "@tanstack/react-query";
import type { Position } from "@f1-dashboard/types";
import { useLiveSession, type UseLiveSessionOptions } from "./useLiveSession";

export function usePositions(
  sessionKey: number,
  options: UseLiveSessionOptions<Position[]> = {},
): UseQueryResult<Position[]> {
  return useLiveSession(
    ["positions", sessionKey],
    sessionKey,
    (client, key) => client.getPositions({ session_key: key }),
    { refetchInterval: 5000, ...options },
  );
}
