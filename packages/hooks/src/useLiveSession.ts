import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { openF1Client } from "./client";

export interface UseLiveSessionOptions {
  refetchInterval?: number;
  enabled?: boolean;
}

type Fetcher<T> = (client: typeof openF1Client, sessionKey: number) => Promise<T>;

export function useLiveSession<T>(
  queryKeyPrefix: string,
  sessionKey: number,
  fetcher: Fetcher<T>,
  options: UseLiveSessionOptions = {},
): UseQueryResult<T> {
  const { refetchInterval = 5000, enabled = true } = options;

  return useQuery({
    queryKey: [queryKeyPrefix, sessionKey],
    queryFn: () => fetcher(openF1Client, sessionKey),
    refetchInterval,
    enabled: enabled && Boolean(sessionKey),
  });
}
