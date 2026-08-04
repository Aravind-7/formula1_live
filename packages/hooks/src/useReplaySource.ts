import { openF1Client } from "./client";
import type { ReplaySource } from "./useLiveSession";
import { useReplayClock } from "./useReplayClock";
import { useSessionStore } from "./sessionStore";

type Fetcher<T> = (client: typeof openF1Client, sessionKey: number) => Promise<T[]>;

// Shared by every replay-aware polling hook: reads replayMode/replaySpeed
// from the global SessionStore and, when replay is on, drives useReplayClock
// with the same fetcher the live hook already uses.
export function useReplaySource<T>(
  queryKey: readonly unknown[],
  sessionKey: number,
  fetcher: Fetcher<T>,
  getDate?: (item: T) => string,
): ReplaySource<T[]> | undefined {
  const replayMode = useSessionStore((state) => state.replayMode);
  const replaySpeed = useSessionStore((state) => state.replaySpeed);

  const replay = useReplayClock(queryKey, sessionKey, fetcher, {
    speed: replaySpeed,
    enabled: replayMode,
    getDate,
  });

  return replayMode ? { data: replay.data, isLoading: replay.isLoading } : undefined;
}
