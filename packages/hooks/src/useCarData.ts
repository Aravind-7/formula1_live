import type { UseQueryResult } from "@tanstack/react-query";
import type { CarData } from "@f1-dashboard/types";
import { useLiveSession, type UseLiveSessionOptions } from "./useLiveSession";

export function useCarData(
  sessionKey: number,
  driverNumber: number,
  options: UseLiveSessionOptions = {},
): UseQueryResult<CarData[]> {
  return useLiveSession(
    ["car_data", sessionKey, driverNumber],
    sessionKey,
    (client, key) => client.getCarData({ session_key: key, driver_number: driverNumber }),
    { refetchInterval: 5000, enabled: Boolean(driverNumber), ...options },
  );
}
