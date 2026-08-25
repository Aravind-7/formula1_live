import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import * as Linking from "expo-linking";
import { driverMap, useDrivers, useTeamRadio } from "@f1-dashboard/hooks";
import { Card } from "./Card";

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

export function TeamRadioCard({ sessionKey, live }: { sessionKey: number; live: boolean }) {
  // Always fetch — a finished session has radio clips worth showing even
  // when it's not live. `live` only controls whether we keep polling.
  const { data: clips } = useTeamRadio(sessionKey, {
    refetchInterval: live ? undefined : false,
  });
  const { data: drivers } = useDrivers(sessionKey);
  const driversByNumber = useMemo(() => driverMap(drivers), [drivers]);
  const [selectedDriver, setSelectedDriver] = useState<number | undefined>();

  // Only list drivers who actually have at least one clip in this session —
  // otherwise selecting a driver could land on an empty dead end.
  const teams = useMemo(() => {
    const driverNumbersWithClips = new Set((clips ?? []).map((clip) => clip.driver_number));

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
  }, [clips, driversByNumber]);

  const clipsForSelectedDriver = useMemo(() => {
    if (selectedDriver === undefined) return [];
    return [...(clips ?? [])]
      .filter((clip) => clip.driver_number === selectedDriver)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [clips, selectedDriver]);

  return (
    <Card>
      <Text className="mb-sm text-sm font-medium text-text-muted">Team radio</Text>
      {teams.length === 0 ? (
        <Text className="text-sm text-text-muted">No team radio clips yet.</Text>
      ) : (
        <>
          {teams.map((team) => (
            <View key={team.team_name} className="mb-sm">
              <View className="mb-xs flex-row items-center gap-xs">
                <View
                  className="h-3 w-1 rounded-full"
                  style={{ backgroundColor: `#${team.team_colour}` }}
                />
                <Text className="text-xs font-medium text-text-muted">{team.team_name}</Text>
              </View>
              <View className="flex-row flex-wrap gap-xs">
                {team.drivers.map((driver) => {
                  const isSelected = driver.driver_number === selectedDriver;
                  return (
                    <Pressable
                      key={driver.driver_number}
                      onPress={() =>
                        setSelectedDriver(isSelected ? undefined : driver.driver_number)
                      }
                      className={`rounded border px-sm py-xs ${
                        isSelected
                          ? "border-accent-primary bg-accent-primary/20"
                          : "border-border-hairline"
                      }`}
                    >
                      <Text className="text-xs font-medium text-text-primary">
                        {driver.name_acronym}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}

          {selectedDriver === undefined ? (
            <Text className="text-sm text-text-muted">Choose a driver above to hear their radio.</Text>
          ) : (
            clipsForSelectedDriver.map((clip, index) => (
              <Pressable
                key={`${clip.driver_number}-${clip.date}-${index}`}
                onPress={() => Linking.openURL(clip.recording_url)}
                className="mb-xs flex-row items-center justify-between rounded border border-border-hairline p-sm"
              >
                <Text className="text-xs text-text-muted">
                  {new Date(clip.date).toLocaleTimeString()}
                </Text>
                <Text className="text-sm text-accent-gold">Play</Text>
              </Pressable>
            ))
          )}
        </>
      )}
    </Card>
  );
}
