import type { UseQueryResult } from "@tanstack/react-query";
import type { CarData } from "@f1-dashboard/types";
import { useLiveSession, type UseLiveSessionOptions } from "./useLiveSession";

export interface UseCarDataParams {
  driverNumber: number | undefined;
  dateFrom: string | null | undefined;
  dateTo: string | null | undefined;
}

// A whole session's unfiltered car_data for one driver can be several MB and
// take 6s+ to return — well past our fetch timeout. Scope every request to a
// single lap's time window instead (still enough for a telemetry trace).
export function useCarData(
  sessionKey: number,
  { driverNumber, dateFrom, dateTo }: UseCarDataParams,
  options: UseLiveSessionOptions<CarData[]> = {},
): UseQueryResult<CarData[]> {
  return useLiveSession(
    ["car_data", sessionKey, driverNumber, dateFrom, dateTo],
    sessionKey,
    (client, key) => {
      if (!driverNumber || !dateFrom || !dateTo) return Promise.resolve([]);
      return client.getCarData({
        session_key: key,
        driver_number: driverNumber,
        "date>": dateFrom,
        "date<": dateTo,
      });
    },
    {
      refetchInterval: false,
      enabled: Boolean(driverNumber) && Boolean(dateFrom) && Boolean(dateTo),
      ...options,
    },
  );
}
