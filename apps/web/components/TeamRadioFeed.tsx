"use client";

import { useMemo } from "react";
import { driverMap, useDrivers, useTeamRadio } from "@f1-dashboard/hooks";
import { DataState } from "./DataState";
import { SkeletonBlock } from "./SkeletonBlock";

function TeamRadioSkeleton() {
  return (
    <div className="flex flex-col gap-sm">
      {Array.from({ length: 3 }).map((_, index) => (
        <SkeletonBlock key={index} className="h-12 w-full" />
      ))}
    </div>
  );
}

export function TeamRadioFeed({ sessionKey, live }: { sessionKey: number; live: boolean }) {
  // Always fetch — a finished session has radio clips worth showing even
  // when it's not live. `live` only controls whether we keep polling.
  const clipsQuery = useTeamRadio(sessionKey, { refetchInterval: live ? undefined : false });
  const { data: drivers } = useDrivers(sessionKey);
  const driversByNumber = useMemo(() => driverMap(drivers), [drivers]);

  const recent = useMemo(
    () =>
      [...(clipsQuery.data ?? [])].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    [clipsQuery.data],
  );

  return (
    <div className="flex h-full flex-col gap-sm">
      <h3 className="text-sm font-medium text-text-muted">Team radio</h3>
      <DataState
        query={{ ...clipsQuery, data: recent }}
        skeleton={<TeamRadioSkeleton />}
        emptyMessage="No team radio clips yet."
        isEmpty={(data) => data.length === 0}
      >
        {(data) => (
          <div className="flex max-h-48 flex-col gap-sm overflow-y-auto">
            {data.map((clip, index) => {
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
      </DataState>
    </div>
  );
}
