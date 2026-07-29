import type { UseQueryResult } from "@tanstack/react-query";
import type { TeamRadio } from "@f1-dashboard/types";
import { useLiveSession, type UseLiveSessionOptions } from "./useLiveSession";

export function useTeamRadio(
  sessionKey: number,
  options: UseLiveSessionOptions = {},
): UseQueryResult<TeamRadio[]> {
  return useLiveSession(
    "team_radio",
    sessionKey,
    (client, key) => client.getTeamRadio({ session_key: key }),
    { refetchInterval: 20000, ...options },
  );
}
