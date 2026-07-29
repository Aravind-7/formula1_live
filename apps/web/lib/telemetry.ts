import type { Driver } from "@f1-dashboard/types";

export function driverMap(drivers: Driver[] | undefined): Map<number, Driver> {
  const map = new Map<number, Driver>();
  drivers?.forEach((driver) => map.set(driver.driver_number, driver));
  return map;
}

export function latestByDriver<T extends { driver_number: number; date: string }>(
  entries: T[] | undefined,
): Map<number, T> {
  const byDriver = new Map<number, T>();
  for (const entry of entries ?? []) {
    const existing = byDriver.get(entry.driver_number);
    if (!existing || new Date(entry.date) > new Date(existing.date)) {
      byDriver.set(entry.driver_number, entry);
    }
  }
  return byDriver;
}

export function teamColor(driver: Driver | undefined): string | undefined {
  return driver?.team_colour ? `#${driver.team_colour}` : undefined;
}
