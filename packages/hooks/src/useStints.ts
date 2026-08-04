import type { UseQueryResult } from "@tanstack/react-query";
import type { Stint } from "@f1-dashboard/types";
import { openF1Client } from "./client";
import { useLiveSession, type UseLiveSessionOptions } from "./useLiveSession";
import { useSessionStore } from "./sessionStore";

function fetchStints(client: typeof openF1Client, sessionKey: number) {
  return client.getStints({ session_key: sessionKey });
}

// Stints have no per-record timestamp (only lap ranges), so unlike the other
// hooks this can't time-slice a replay — it just always fetches the full
// current strategy picture whenever replay mode is globally on.
export function useStints(
  sessionKey: number,
  options: UseLiveSessionOptions<Stint[]> = {},
): UseQueryResult<Stint[]> {
  const replayMode = useSessionStore((state) => state.replayMode);
  const { enabled = true, ...rest } = options;

  return useLiveSession(["stints", sessionKey], sessionKey, fetchStints, {
    refetchInterval: 30000,
    ...rest,
    enabled: enabled || replayMode,
  });
}
