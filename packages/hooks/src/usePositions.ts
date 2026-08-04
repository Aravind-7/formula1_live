import type { UseQueryResult } from "@tanstack/react-query";
import type { Position } from "@f1-dashboard/types";
import { openF1Client } from "./client";
import { useLiveSession, type UseLiveSessionOptions } from "./useLiveSession";
import { useReplaySource } from "./useReplaySource";

function fetchPositions(client: typeof openF1Client, sessionKey: number) {
  return client.getPositions({ session_key: sessionKey });
}

export function usePositions(
  sessionKey: number,
  options: UseLiveSessionOptions<Position[]> = {},
): UseQueryResult<Position[]> {
  const replaySource = useReplaySource(["positions", sessionKey], sessionKey, fetchPositions);

  return useLiveSession(["positions", sessionKey], sessionKey, fetchPositions, {
    refetchInterval: 5000,
    replaySource,
    ...options,
  });
}
