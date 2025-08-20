import React, { useRef } from "react";
import { Animated, FlatList, StyleSheet, View } from "react-native";

export default function HistoryListSkeleton() {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;
  const historyPlaceholders = Array(6).fill(null);

  const AnimatedView = ({ style }: { style?: any }) => (
    <Animated.View style={[style, { opacity: pulseAnim }]} />
  );

  return (
    <FlatList
      data={historyPlaceholders}
      showsVerticalScrollIndicator={false}
      keyExtractor={(_, i) => i.toString()}
      renderItem={() => (
        <View style={styles.historyItem}>
          <AnimatedView style={styles.circle} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <AnimatedView style={styles.smallText} />
            <AnimatedView
              style={[styles.smallText, { width: 120, marginTop: 6 }]}
            />
          </View>
          <AnimatedView style={styles.amountPlaceholder} />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
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
  smallText: {
    height: 12,
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
    marginBottom: 6,
    width: 140,
  },
});
