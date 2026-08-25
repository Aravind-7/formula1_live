"use client";

import { useMemo, useState } from "react";
import { driverMap, useDrivers, useTeamRadio } from "@f1-dashboard/hooks";
import { DataState } from "./DataState";
import { SkeletonBlock } from "./SkeletonBlock";

interface TeamRadioDriver {
  driver_number: number;
  name_acronym: string;
  full_name: string;
}

interface TeamGroup {
  team_name: string;
  team_colour: string;
  drivers: TeamRadioDriver[];
}

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
  const [selectedDriver, setSelectedDriver] = useState<number | undefined>();

  // Only list drivers who actually have at least one clip in this session —
  // otherwise selecting a driver could land on an empty dead end.
  const teams = useMemo(() => {
    const driverNumbersWithClips = new Set(
      (clipsQuery.data ?? []).map((clip) => clip.driver_number),
    );

    const byTeam = new Map<string, TeamGroup>();
    for (const driverNumber of Array.from(driverNumbersWithClips)) {
      const driver = driversByNumber.get(driverNumber);
      if (!driver) continue;

      const entry: TeamRadioDriver = {
        driver_number: driver.driver_number,
        name_acronym: driver.name_acronym,
        full_name: driver.full_name,
      };
      const existing = byTeam.get(driver.team_name);
      if (existing) {
        existing.drivers.push(entry);
      } else {
        byTeam.set(driver.team_name, {
          team_name: driver.team_name,
          team_colour: driver.team_colour,
          drivers: [entry],
        });
      }
    }
    return Array.from(byTeam.values());
  }, [clipsQuery.data, driversByNumber]);

  const clipsForSelectedDriver = useMemo(() => {
    if (selectedDriver === undefined) return [];
    return (clipsQuery.data ?? [])
      .filter((clip) => clip.driver_number === selectedDriver)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [clipsQuery.data, selectedDriver]);

  return (
    <div className="flex h-full flex-col gap-sm">
      <h3 className="text-sm font-medium text-text-muted">Team radio</h3>
      <DataState
        query={{
          data: teams,
          isLoading: clipsQuery.isLoading,
          isError: clipsQuery.isError,
          refetch: clipsQuery.refetch,
        }}
        skeleton={<TeamRadioSkeleton />}
        emptyMessage="No team radio clips yet."
        isEmpty={(data) => data.length === 0}
      >
        {(teamGroups) => (
          <div className="flex flex-col gap-sm">
            <div className="flex flex-col gap-sm">
              {teamGroups.map((team) => (
                <div key={team.team_name}>
                  <div className="mb-xs flex items-center gap-xs">
                    <span
                      aria-hidden="true"
                      className="h-3 w-1 shrink-0 rounded-full"
                      style={{ backgroundColor: `#${team.team_colour}` }}
                    />
                    <span className="text-xs font-medium text-text-muted">{team.team_name}</span>
                  </div>
                  <div className="flex flex-wrap gap-xs">
                    {team.drivers.map((driver) => {
                      const isSelected = driver.driver_number === selectedDriver;
                      return (
                        <button
                          key={driver.driver_number}
                          type="button"
                          onClick={() =>
                            setSelectedDriver(isSelected ? undefined : driver.driver_number)
                          }
                          aria-pressed={isSelected}
                          aria-label={`${driver.full_name}${isSelected ? ", selected" : ""}`}
                          className={`rounded border px-sm py-xs text-xs font-medium text-text-primary transition-colors ${
                            isSelected
                              ? "border-accent-primary bg-accent-primary/20"
                              : "border-border-hairline hover:border-border-strong"
                          }`}
                        >
                          {driver.name_acronym}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {selectedDriver === undefined ? (
              <p className="text-sm text-text-muted">Choose a driver above to hear their radio.</p>
            ) : (
              <div className="flex max-h-48 flex-col gap-sm overflow-y-auto">
                {clipsForSelectedDriver.map((clip, index) => (
                  <div
                    key={`${clip.driver_number}-${clip.date}-${index}`}
                    className="flex items-center gap-sm rounded border border-border-hairline p-sm"
                  >
                    <p className="flex-1 text-xs text-text-muted">
                      {new Date(clip.date).toLocaleTimeString()}
                    </p>
                    <audio controls src={clip.recording_url} className="h-8 max-w-[160px]" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </DataState>
    </div>
  );
}
