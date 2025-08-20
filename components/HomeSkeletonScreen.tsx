import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import HistoryListSkeleton from "./HistoryListSkeleton";
import ScreenWrapper from "./ScreenWrapper";

const HomeSkeletonScreen = () => {
  // Animation value
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();

    return () => loop.stop(); // cleanup
  }, [pulseAnim]);

  const AnimatedView = ({ style }: { style?: any }) => (
    <Animated.View style={[style, { opacity: pulseAnim }]} />
  );

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <AnimatedView style={styles.smallText} />
          <AnimatedView style={styles.mediumText} />
          <AnimatedView style={styles.smallText} />

          <AnimatedView style={styles.label} />
          <AnimatedView style={styles.bigAmount} />

          <View style={styles.row}>
            <View>
              <AnimatedView style={styles.label} />
              <AnimatedView style={styles.smallText} />
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <AnimatedView style={styles.label} />
              <AnimatedView style={styles.smallText} />
            </View>
          </View>
        </View>

        {/* History header */}
        <View style={styles.historyHeader}>
          <AnimatedView style={[styles.mediumText, { width: 100 }]} />
          <AnimatedView style={[styles.smallText, { width: 50 }]} />
        </View>

        {/* History list */}
        <HistoryListSkeleton />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#006837",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 16,
    paddingTop: 48,
  },
  smallText: {
    height: 12,
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
    marginBottom: 6,
    width: 140,
  },
  mediumText: {
    height: 16,
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
    marginBottom: 8,
    width: 200,
  },
  bigAmount: {
    height: 28,
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
    marginBottom: 12,
    width: 180,
  },
  label: {
    height: 32,
    backgroundColor: "#d0d0d0",
    borderRadius: 5,
    marginBottom: 4,
    width: 120,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#e0e0e0",
  },
  amountPlaceholder: {
    width: 60,
    height: 12,
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
  },
});

export default HomeSkeletonScreen;
