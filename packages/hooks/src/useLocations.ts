import type { UseQueryResult } from "@tanstack/react-query";
import type { Location } from "@f1-dashboard/types";
import { useLiveSession, type UseLiveSessionOptions } from "./useLiveSession";

export function useLocations(
  sessionKey: number,
  options: UseLiveSessionOptions = {},
): UseQueryResult<Location[]> {
  return useLiveSession(
    ["locations", sessionKey],
    sessionKey,
    (client, key) => client.getLocations({ session_key: key }),
    { refetchInterval: 4000, ...options },
  );
}
