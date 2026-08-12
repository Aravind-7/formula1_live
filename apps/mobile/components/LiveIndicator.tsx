import { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";

export function LiveIndicator() {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.75)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 2,
          duration: 1000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 1000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [scale, opacity]);

  return (
    <View className="h-2.5 w-2.5 items-center justify-center">
      <Animated.View
        className="absolute h-2.5 w-2.5 rounded-full bg-accent-gold"
        style={{ opacity, transform: [{ scale }] }}
      />
      <View className="h-2.5 w-2.5 rounded-full bg-accent-gold" />
    </View>
  );
}
