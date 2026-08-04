import type { UseQueryResult } from "@tanstack/react-query";
import type { Interval } from "@f1-dashboard/types";
import { openF1Client } from "./client";
import { useLiveSession, type UseLiveSessionOptions } from "./useLiveSession";
import { useReplaySource } from "./useReplaySource";

function fetchIntervals(client: typeof openF1Client, sessionKey: number) {
  return client.getIntervals({ session_key: sessionKey });
}

export function useIntervals(
  sessionKey: number,
  options: UseLiveSessionOptions<Interval[]> = {},
): UseQueryResult<Interval[]> {
  const replaySource = useReplaySource(["intervals", sessionKey], sessionKey, fetchIntervals);

  return useLiveSession(["intervals", sessionKey], sessionKey, fetchIntervals, {
    refetchInterval: 5000,
    replaySource,
    ...options,
  });
}
