import HistoryItem from "@/components/admin/HistoryItem";
import Loading from "@/components/Loading";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import { useAdminTransactions } from "@/hooks/useAdminTransactions";
import { TransactionType } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function PaymentStatusScreen() {
  const { loadData, transactions, isLoading } = useAdminTransactions();

  // console.log(JSON.stringify(transactions, null, 2));
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "PAID" | "PENDING" | "UNPAID">(
    "ALL"
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, []);

  const filtered = transactions.filter((t: TransactionType) => {
    const matchesSearch =
      t.userData.fullName.toLowerCase().includes(search.toLowerCase()) ||
      t.userData.address.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === "ALL" ? true : t.status === filter;

    return matchesSearch && matchesFilter;
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Header */}
        <Text style={styles.header}>Payment Status</Text>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search here"
            value={search}
            onChangeText={setSearch}
          />
          <Ionicons name="search" size={20} color="green" />
        </View>

        {/* Table Headers */}
        <View style={styles.tableHeader}>
          <Text style={styles.headerText}>Information</Text>

          {/* Filter Dropdown */}
          <View style={{ position: "relative" }}>
            <TouchableOpacity
              onPress={() => setShowDropdown((prev) => !prev)}
              style={styles.filterButton}
            >
              <Ionicons name="funnel-outline" size={18} color="black" />
              <Text style={{ marginLeft: 5 }}>{filter}</Text>
            </TouchableOpacity>

            {showDropdown && (
              <View style={styles.dropdown}>
                {["ALL", "PAID", "PENDING", "UNPAID"].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.dropdownItem,
                      filter === option && styles.activeDropdownItem,
                    ]}
                    onPress={() => {
                      setFilter(
                        option as "ALL" | "PAID" | "PENDING" | "UNPAID"
                      );
                      setShowDropdown(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownText,
                        filter === option && styles.activeDropdownText,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <Text style={styles.headerText}>Status</Text>
        </View>

        {/* Transactions List */}
        {!isLoading ? (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <HistoryItem item={item} />}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={<Typo>No transactions found</Typo>}
          />
        ) : (
          <Loading />
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: 14 },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    alignItems: "center",
  },
  headerText: { fontWeight: "600", fontSize: 14 },
  filterButton: { flexDirection: "row", alignItems: "center", padding: 4 },
  dropdown: {
    position: "absolute",
    top: 30,
    right: 0,
    backgroundColor: "#eef7f1ff",
    borderRadius: 8,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    zIndex: 999,
    width: 87,
  },
  dropdownItem: { paddingVertical: 6, paddingHorizontal: 12 },
  dropdownText: { fontSize: 14, color: "black" },
  activeDropdownItem: { backgroundColor: "#0f5132", borderRadius: 6 },
  activeDropdownText: { color: colors.white, fontWeight: "bold" },
});
