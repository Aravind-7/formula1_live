import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { openF1Client } from "./client";

export interface UseReplayClockOptions<T> {
  /** Playback multiplier — 10 means 10x real-time. */
  speed?: number;
  /** How often (ms) the replay window advances. */
  tickMs?: number;
  /** Gate the historical fetch itself — hooks that call this unconditionally
   * (required, since hooks can't be called conditionally) still shouldn't
   * fire the fetch when replay mode is off. Defaults to true. */
  enabled?: boolean;
  /** Extracts the timestamp to slice by. Defaults to `item.date`; pass this
   * for shapes that use a different field (e.g. Lap's `date_start`). */
  getDate?: (item: T) => string;
}

export interface ReplayClockResult<T> {
  data: T[];
  isLoading: boolean;
  /** 0-1, how far through the historical dataset the replay window is. */
  progress: number;
}

type Fetcher<T> = (client: typeof openF1Client, sessionKey: number) => Promise<T[]>;

function defaultGetDate(item: unknown): string {
  return (item as { date: string }).date;
}

// Fetches a full historical dataset once, then re-emits it in growing
// time-sliced windows on an interval — simulating the same data shape the
// live polling hooks would produce, so the rest of the app can't tell the
// difference between "live" and "replayed".
export function useReplayClock<T>(
  queryKey: readonly unknown[],
  sessionKey: number,
  fetcher: Fetcher<T>,
  options: UseReplayClockOptions<T> = {},
): ReplayClockResult<T> {
  const { speed = 10, tickMs = 1000, enabled = true, getDate = defaultGetDate } = options;

  const fullQuery = useQuery({
    queryKey: ["replay-source", ...queryKey],
    queryFn: () => fetcher(openF1Client, sessionKey),
    staleTime: Infinity,
    enabled: enabled && Boolean(sessionKey),
  });

  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    setElapsedMs(0);
    if (!fullQuery.data || fullQuery.data.length === 0) return undefined;

    const id = setInterval(() => {
      setElapsedMs((prev) => prev + tickMs * speed);
    }, tickMs);

    return () => clearInterval(id);
  }, [fullQuery.data, tickMs, speed]);

  return useMemo(() => {
    const all = fullQuery.data ?? [];
    if (all.length === 0) {
      return { data: [], isLoading: fullQuery.isLoading, progress: 0 };
    }

    const timestamps = all.map((item) => new Date(getDate(item)).getTime());
    const startTime = Math.min(...timestamps);
    const endTime = Math.max(...timestamps);
    const span = Math.max(endTime - startTime, 1);
    const windowEnd = startTime + elapsedMs;

    return {
      data: all.filter((item) => new Date(getDate(item)).getTime() <= windowEnd),
      isLoading: fullQuery.isLoading,
      progress: Math.min(1, elapsedMs / span),
    };
  }, [fullQuery.data, fullQuery.isLoading, elapsedMs, getDate]);
}
