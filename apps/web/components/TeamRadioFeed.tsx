"use client";

import { useMemo } from "react";
import { useDrivers, useTeamRadio } from "@f1-dashboard/hooks";
import { driverMap } from "@/lib/telemetry";

export function TeamRadioFeed({ sessionKey, live }: { sessionKey: number; live: boolean }) {
  const { data: clips } = useTeamRadio(sessionKey, { enabled: live });
  const { data: drivers } = useDrivers(sessionKey);
  const driversByNumber = useMemo(() => driverMap(drivers), [drivers]);

  const recent = useMemo(
    () =>
      [...(clips ?? [])].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    [clips],
  );

  return (
    <div className="flex h-full flex-col gap-sm">
      <h3 className="text-sm font-medium text-text-muted">Team radio</h3>
      {recent.length === 0 ? (
        <p className="text-sm text-text-muted">No team radio clips yet.</p>
      ) : (
        <div className="flex max-h-48 flex-col gap-sm overflow-y-auto">
          {recent.map((clip, index) => {
            const driver = driversByNumber.get(clip.driver_number);
            return (
              <div
                key={`${clip.driver_number}-${clip.date}-${index}`}
                className="flex items-center gap-sm rounded border border-border-hairline p-sm"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">
                    {driver?.name_acronym ?? clip.driver_number}
                  </p>
                  <p className="text-xs text-text-muted">
                    {new Date(clip.date).toLocaleTimeString()}
                  </p>
                </div>
                <audio controls src={clip.recording_url} className="h-8 max-w-[160px]" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
