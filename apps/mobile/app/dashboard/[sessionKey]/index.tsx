import { Link, useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { isSessionLive, useSession, useSessionStore } from "@f1-dashboard/hooks";
import { FastestLapCard } from "@/components/FastestLapCard";
import { LeaderboardCard } from "@/components/LeaderboardCard";
import { LiveIndicator } from "@/components/LiveIndicator";
import { ReplayBadge } from "@/components/ReplayBadge";
import { TeamRadioCard } from "@/components/TeamRadioCard";
import { TireStrategyCard } from "@/components/TireStrategyCard";
import { WeatherCard } from "@/components/WeatherCard";

export default function DashboardScreen() {
  const { sessionKey: sessionKeyParam } = useLocalSearchParams<{ sessionKey: string }>();
  const sessionKey = Number(sessionKeyParam);
  const { data: session } = useSession(sessionKey);
  const live = isSessionLive(session);
  const replayMode = useSessionStore((state) => state.replayMode);

  return (
    <ScrollView className="flex-1 bg-bg-base" contentContainerClassName="gap-lg p-lg">
      <View className="flex-row items-center gap-sm">
        {live && <LiveIndicator />}
        {!live && replayMode && <ReplayBadge />}
        <View>
          <Text className="text-lg font-medium text-text-primary">
            {session?.session_name ?? "Loading session…"}
          </Text>
          {session && (
            <Text className="text-sm text-text-muted">
              {session.circuit_short_name}, {session.country_name}
            </Text>
          )}
        </View>
      </View>

      <Link href={`/dashboard/${sessionKey}/track`} className="text-sm text-accent-gold">
        View track map →
      </Link>

      <LeaderboardCard sessionKey={sessionKey} live={live} />
      <WeatherCard sessionKey={sessionKey} live={live} />
      <FastestLapCard sessionKey={sessionKey} live={live} />
      <TireStrategyCard sessionKey={sessionKey} live={live} />
      <TeamRadioCard sessionKey={sessionKey} live={live} />
    </ScrollView>
  );
}
