import { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import type { Driver, Position } from "@f1-dashboard/types";
import { driverMap, latestByDriver, teamColor } from "@f1-dashboard/hooks";

export interface TrackOverlayPanelProps {
  drivers: Driver[] | undefined;
  positions: Position[] | undefined;
  selectedDriverNumber: number | undefined;
  onSelect: (driverNumber: number) => void;
}

export function TrackOverlayPanel({
  drivers,
  positions,
  selectedDriverNumber,
  onSelect,
}: TrackOverlayPanelProps) {
  const driversByNumber = useMemo(() => driverMap(drivers), [drivers]);
  const rows = useMemo(() => {
    const latest = latestByDriver(positions);
    return Array.from(latest.values()).sort((a, b) => a.position - b.position);
  }, [positions]);

  return (
    <View className="absolute left-lg top-lg max-h-[70%] w-44 rounded-xl border border-border-hairline bg-bg-panel/90 p-xs">
      <ScrollView>
        {rows.length === 0 ? (
          <Text className="p-sm text-xs text-text-muted">No live position data.</Text>
        ) : (
          rows.map((position) => {
            const driver = driversByNumber.get(position.driver_number);
            const isSelected = position.driver_number === selectedDriverNumber;

            return (
              <Pressable
                key={position.driver_number}
                onPress={() => onSelect(position.driver_number)}
                className={`flex-row items-center gap-sm rounded px-sm py-xs ${
                  isSelected ? "bg-accent-primary/20" : ""
                }`}
              >
                <View
                  className="h-4 w-1 shrink-0 rounded-full bg-border-hairline"
                  style={{ backgroundColor: teamColor(driver) }}
                />
                <Text className="w-5 text-text-muted">{position.position}</Text>
                <Text className="text-text-primary">
                  {driver?.name_acronym ?? position.driver_number}
                </Text>
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
