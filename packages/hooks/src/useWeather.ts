import type { UseQueryResult } from "@tanstack/react-query";
import type { Weather } from "@f1-dashboard/types";
import { openF1Client } from "./client";
import { useLiveSession, type UseLiveSessionOptions } from "./useLiveSession";
import { useReplaySource } from "./useReplaySource";

function fetchWeather(client: typeof openF1Client, sessionKey: number) {
  return client.getWeather({ session_key: sessionKey });
}

export function useWeather(
  sessionKey: number,
  options: UseLiveSessionOptions<Weather[]> = {},
): UseQueryResult<Weather[]> {
  const replaySource = useReplaySource(["weather", sessionKey], sessionKey, fetchWeather);

  return useLiveSession(["weather", sessionKey], sessionKey, fetchWeather, {
    refetchInterval: 60000,
    replaySource,
    ...options,
  });
}
