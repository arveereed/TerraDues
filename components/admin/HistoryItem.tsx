import { colors } from "@/constants/theme";
import { updateStatus } from "@/services/transactionService";
import { TransactionType } from "@/types";
import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Typo from "../Typo";

export default function HistoryItem({ item }: { item: TransactionType }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TransactionType | null>(
    null
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const handleStatus = async (option: string) => {
    await updateStatus(item.id, option);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.row, item.status === "PAID" && styles.highlightRow]}
        onPress={() => {
          setModalVisible(true);
          setSelectedItem(item);
        }}
      >
        <View>
          <Text style={styles.name}>{item.userData.fullName}</Text>
          <Text style={styles.date}>{item.createdAt.split(" at ")[0]}</Text>
        </View>
        <Text
          style={[
            styles.status,
            item.status === "PAID"
              ? styles.paid
              : item.status === "PENDING"
              ? styles.pending
              : styles.unpaid,
          ]}
        >
          {item.status}
        </Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        {/* Overlay with click detection */}
        <TouchableWithoutFeedback
          onPress={() => {
            setShowDropdown(false); // close dropdown when clicking outside
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Payment Details</Text>
              <Text style={styles.modalName}>{item.userData.fullName}</Text>
              <Text style={styles.modalAddress}>{item.userData.address}</Text>

              <View style={{ marginTop: 28 }}>
                <Text style={styles.modalItem}>
                  Payment Transaction: Bayad Center
                </Text>
                <Text style={styles.modalItem}>
                  Total Pay: ₱{selectedItem?.totalPay}.00
                </Text>
                <Typo size={14} color="white" style={{ marginTop: 28 }}>
                  Transaction Created Date:
                </Typo>
                <Text style={[styles.modalItem, { marginBottom: 28 }]}>
                  {selectedItem?.createdAt}
                </Text>
                <Text style={styles.modalItem}>
                  <View style={styles.btn}>
                    <Typo
                      size={14}
                      fontWeight={500}
                      style={{ paddingTop: 8 }}
                      color="white"
                    >
                      Status:{" "}
                    </Typo>
                    <TouchableOpacity
                      style={{
                        backgroundColor: "white",
                        borderRadius: 4,
                        padding: 2,
                        paddingHorizontal: 24,
                        marginTop: 10,
                      }}
                      onPress={() => setShowDropdown(true)}
                    >
                      <Typo size={14} fontWeight={700}>
                        {newStatus || selectedItem?.status}
                      </Typo>
                    </TouchableOpacity>
                    {showDropdown && (
                      <View style={styles.dropdown}>
                        {["PAID", "PENDING", "UNPAID"].map((option) => (
                          <TouchableOpacity
                            key={option}
                            style={[styles.dropdownItem]}
                            onPress={() => {
                              setShowDropdown(false);
                              setNewStatus(option);
                            }}
                          >
                            <Text style={[styles.dropdownText]}>{option}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                </Text>
              </View>

              <View style={{ flexDirection: "row", gap: 10 }}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setModalVisible(false);
                    setNewStatus("");
                  }}
                >
                  <Text style={styles.closeText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setModalVisible(false);
                    setNewStatus("");
                    handleStatus(newStatus);
                  }}
                >
                  <Text style={styles.closeText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderColor: "#eef7f1ff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  row: {
    backgroundColor: colors.neutral100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
    borderRadius: 8,
  },
  highlightRow: { backgroundColor: "#e6f7ec" },
  name: { fontWeight: "600", fontSize: 14 },
  date: { fontSize: 12, color: "gray" },
  status: { fontWeight: "bold", fontSize: 12 },
  paid: { color: "green" },
  unpaid: { color: "red" },
  pending: { color: "#FFC107" },

  // * Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#00723F",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  modalName: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 10,
  },
  modalAddress: {
    color: "#fff",
    fontSize: 14,
  },
  modalItem: {
    color: "#fff",
    fontSize: 14,
    marginTop: 6,
  },
  closeButton: {
    backgroundColor: "#fff",
    marginTop: 20,
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 8,
  },
  closeText: {
    color: "#00723F",
    fontWeight: "bold",
  },

  // * Dropdown
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
