import { Text, View } from "react-native";
import { useWeather } from "@f1-dashboard/hooks";
import { Card } from "./Card";

export function WeatherCard({ sessionKey, live }: { sessionKey: number; live: boolean }) {
  // Always fetch — a finished session has weather data worth showing even
  // when it's not live. `live` only controls whether we keep polling.
  const { data } = useWeather(sessionKey, { refetchInterval: live ? undefined : false });
  const latest = data?.at(-1);

  return (
    <Card>
      <Text className="mb-sm text-sm font-medium text-text-muted">Weather</Text>
      {!latest ? (
        <Text className="text-sm text-text-muted">No weather data.</Text>
      ) : (
        <View className="flex-row flex-wrap gap-lg">
          <View>
            <Text className="text-sm text-text-muted">Track</Text>
            <Text className="text-sm text-text-primary">
              {latest.track_temperature.toFixed(1)}°C
            </Text>
          </View>
          <View>
            <Text className="text-sm text-text-muted">Air</Text>
            <Text className="text-sm text-text-primary">
              {latest.air_temperature.toFixed(1)}°C
            </Text>
          </View>
          <View>
            <Text className="text-sm text-text-muted">Wind</Text>
            <Text className="text-sm text-text-primary">{latest.wind_speed.toFixed(1)} m/s</Text>
          </View>
          <View>
            <Text className="text-sm text-text-muted">Rain</Text>
            <Text className={`text-sm ${latest.rainfall ? "text-signal-amber" : "text-text-primary"}`}>
              {latest.rainfall ? "Yes" : "No"}
            </Text>
          </View>
        </View>
      )}
    </Card>
  );
}
