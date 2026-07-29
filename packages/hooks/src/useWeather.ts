import type { UseQueryResult } from "@tanstack/react-query";
import type { Weather } from "@f1-dashboard/types";
import { useLiveSession, type UseLiveSessionOptions } from "./useLiveSession";

export function useWeather(
  sessionKey: number,
  options: UseLiveSessionOptions = {},
): UseQueryResult<Weather[]> {
  return useLiveSession(
    "weather",
    sessionKey,
    (client, key) => client.getWeather({ session_key: key }),
    { refetchInterval: 60000, ...options },
  );
}
