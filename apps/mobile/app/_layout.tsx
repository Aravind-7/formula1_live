import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colors } from "@f1-dashboard/tokens";
import { Providers } from "@/components/Providers";

export default function RootLayout() {
  return (
    <Providers>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.bgBase },
            headerTintColor: colors.textPrimary,
            contentStyle: { backgroundColor: colors.bgBase },
          }}
        />
      </SafeAreaProvider>
    </Providers>
  );
}
