import Button from "@/components/Button";
import HistoryItem from "@/components/HistoryItem";
import HistoryListSkeleton from "@/components/HistoryListSkeleton";
import SkeletonScreen from "@/components/HomeSkeletonScreen";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import { useUserContext } from "@/contexts/UserContext";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionType } from "@/types";
import { verticalScale } from "@/utils/styling";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";

export default function home() {
  const { user } = useUserContext();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const { loadData, isLoading, transactions } = useTransactions(user?.user_id);

  const onRefresh = async () => {
    setRefreshing(true);
    // console.log("Transaction: ", JSON.stringify(transactions, null, 2));
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
    console.log("Transaction: ", transactions);
  }, [loadData]);

  if (!user) return <SkeletonScreen />;

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good Day!</Text>
        <Text style={styles.name}>{user?.fullName}</Text>
        <Text style={styles.address}>{user?.address}</Text>

        <Text style={styles.label}>Total Monthly Due Paid:</Text>
        <Text style={styles.amount}>₱ {transactions?.summary}.00</Text>

        <View style={styles.row}>
          <View>
            <Text style={styles.label}>Upcoming Payment:</Text>
            <Text style={styles.subText}>April 20, 2025, Sun</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.label}>Last Payment:</Text>
            <Text style={styles.subText}>
              {transactions?.transactions[0]?.updatedAt}
            </Text>
          </View>
        </View>
      </View>

      {/* History Section */}
      <View style={styles.historySection}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>History</Text>
          <Text style={styles.seeAll}>See all</Text>
        </View>
        {isLoading || refreshing ? (
          <HistoryListSkeleton />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={transactions?.transactions}
            keyExtractor={(_, index) => index.toString()} // you can use a unique id if available
            renderItem={({ item }: { item: TransactionType }) => (
              <HistoryItem item={item} />
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={<Typo>No transactions found</Typo>}
          />
        )}
        <Button
          style={styles.floatingButton}
          onPress={() => router.push("/(modals)/transactionModal")}
        >
          <Ionicons
            name="add"
            color={colors.white}
            weight="bold"
            size={verticalScale(28)}
          />
        </Button>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#006837", // dark green
    padding: 20,
    paddingTop: 50,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  greeting: {
    color: "#ffffff",
    fontSize: 14,
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  address: {
    color: "#ffffff",
    fontSize: 14,
    marginBottom: 20,
  },
  label: {
    color: "#ffffff",
    fontSize: 13,
  },
  amount: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 10,
  },
  subText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  historySection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  seeAll: {
    fontSize: 13,
    color: "#007AFF",
  },

  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    position: "absolute",
    bottom: verticalScale(30),
    right: verticalScale(30),
  },
});
