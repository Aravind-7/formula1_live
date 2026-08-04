import type { UseQueryResult } from "@tanstack/react-query";
import type { TeamRadio } from "@f1-dashboard/types";
import { openF1Client } from "./client";
import { useLiveSession, type UseLiveSessionOptions } from "./useLiveSession";
import { useReplaySource } from "./useReplaySource";

function fetchTeamRadio(client: typeof openF1Client, sessionKey: number) {
  return client.getTeamRadio({ session_key: sessionKey });
}

export function useTeamRadio(
  sessionKey: number,
  options: UseLiveSessionOptions<TeamRadio[]> = {},
): UseQueryResult<TeamRadio[]> {
  const replaySource = useReplaySource(["team_radio", sessionKey], sessionKey, fetchTeamRadio);

  return useLiveSession(["team_radio", sessionKey], sessionKey, fetchTeamRadio, {
    refetchInterval: 20000,
    replaySource,
    ...options,
  });
}
