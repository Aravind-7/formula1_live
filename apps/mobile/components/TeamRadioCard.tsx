import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import * as Linking from "expo-linking";
import { driverMap, useDrivers, useTeamRadio } from "@f1-dashboard/hooks";
import { Card } from "./Card";

export function TeamRadioCard({ sessionKey, live }: { sessionKey: number; live: boolean }) {
  // Always fetch — a finished session has radio clips worth showing even
  // when it's not live. `live` only controls whether we keep polling.
  const { data: clips } = useTeamRadio(sessionKey, {
    refetchInterval: live ? undefined : false,
  });
  const { data: drivers } = useDrivers(sessionKey);
  const driversByNumber = useMemo(() => driverMap(drivers), [drivers]);

  const recent = useMemo(
    () => [...(clips ?? [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [clips],
  );

  return (
    <Card>
      <Text className="mb-sm text-sm font-medium text-text-muted">Team radio</Text>
      {recent.length === 0 ? (
        <Text className="text-sm text-text-muted">No team radio clips yet.</Text>
      ) : (
        recent.slice(0, 10).map((clip, index) => {
          const driver = driversByNumber.get(clip.driver_number);
          return (
            <Pressable
              key={`${clip.driver_number}-${clip.date}-${index}`}
              onPress={() => Linking.openURL(clip.recording_url)}
              className="mb-xs flex-row items-center justify-between rounded border border-border-hairline p-sm"
            >
              <View>
                <Text className="text-sm font-medium text-text-primary">
                  {driver?.name_acronym ?? clip.driver_number}
                </Text>
                <Text className="text-xs text-text-muted">
                  {new Date(clip.date).toLocaleTimeString()}
                </Text>
              </View>
              <Text className="text-sm text-accent-gold">Play</Text>
            </Pressable>
          );
        })
      )}
    </Card>
  );
}
