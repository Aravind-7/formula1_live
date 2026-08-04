import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { openF1Client } from "./client";

export interface ReplaySource<T> {
  data: T;
  isLoading: boolean;
}

export interface UseLiveSessionOptions<T = unknown> {
  refetchInterval?: number | false;
  enabled?: boolean;
  /** When present, serves this instead of polling OpenF1 directly. */
  replaySource?: ReplaySource<T>;
}

type Fetcher<T> = (client: typeof openF1Client, sessionKey: number) => Promise<T>;

export function useLiveSession<T>(
  queryKey: readonly unknown[],
  sessionKey: number,
  fetcher: Fetcher<T>,
  options: UseLiveSessionOptions<T> = {},
): UseQueryResult<T> {
  const { refetchInterval = 5000, enabled = true, replaySource } = options;

  const query = useQuery({
    queryKey,
    queryFn: () => fetcher(openF1Client, sessionKey),
    refetchInterval,
    enabled: enabled && Boolean(sessionKey) && !replaySource,
  });

  if (replaySource) {
    return {
      ...query,
      data: replaySource.data,
      isLoading: replaySource.isLoading,
      isPending: replaySource.isLoading,
      isFetching: false,
      status: replaySource.isLoading ? "pending" : "success",
    } as UseQueryResult<T>;
  }

  return query;
}
