"use client";

import { useWeather } from "@f1-dashboard/hooks";
import { DataState } from "./DataState";
import { SkeletonBlock } from "./SkeletonBlock";

function WeatherSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-sm">
      {Array.from({ length: 4 }).map((_, index) => (
        <SkeletonBlock key={index} className="h-10" />
      ))}
    </div>
  );
}

export function WeatherWidget({ sessionKey, live }: { sessionKey: number; live: boolean }) {
  // Always fetch — a finished session has weather data worth showing even
  // when it's not live. `live` only controls whether we keep polling.
  const query = useWeather(sessionKey, { refetchInterval: live ? undefined : false });

  return (
    <div className="flex h-full flex-col gap-sm">
      <h3 className="text-sm font-medium text-text-muted">Weather</h3>
      <DataState
        query={query}
        skeleton={<WeatherSkeleton />}
        emptyMessage="No weather data."
        isEmpty={(data) => data.length === 0}
      >
        {(data) => {
          const latest = data.at(-1)!;
          return (
            <div className="grid grid-cols-2 gap-sm text-sm">
              <div>
                <p className="text-text-muted">Track</p>
                <p className="text-text-primary">{latest.track_temperature.toFixed(1)}°C</p>
              </div>
              <div>
                <p className="text-text-muted">Air</p>
                <p className="text-text-primary">{latest.air_temperature.toFixed(1)}°C</p>
              </div>
              <div>
                <p className="text-text-muted">Wind</p>
                <p className="text-text-primary">{latest.wind_speed.toFixed(1)} m/s</p>
              </div>
              <div>
                <p className="text-text-muted">Rain</p>
                <p className={latest.rainfall ? "text-signal-amber" : "text-text-primary"}>
                  {latest.rainfall ? "Yes" : "No"}
                </p>
              </div>
            </div>
          );
        }}
      </DataState>
    </div>
  );
}
