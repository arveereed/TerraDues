import { TransactionType } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HistoryItem({ item }: { item: TransactionType }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TransactionType | null>(
    null
  );

  return (
    <>
      <TouchableOpacity
        style={styles.historyItem}
        onPress={() => {
          setSelectedItem(item);
          setModalVisible(true);
        }}
      >
        <View style={styles.historyItem}>
          <View style={styles.icon}>
            <Ionicons
              name={
                item.status === "PAID"
                  ? "checkmark-circle"
                  : item.status === "PENDING"
                  ? "time"
                  : "close-circle"
              }
              size={22}
              color={
                item.status === "PAID"
                  ? "#4CAF50"
                  : item.status === "PENDING"
                  ? "#FFC107"
                  : "#F44336"
              }
            />
          </View>
          <View style={styles.historyInfo}>
            <Text style={styles.historyDate}>{item.createdAt}</Text>
            <Text
              style={[
                styles.statusText,
                {
                  color:
                    item.status === "PAID"
                      ? "#4CAF50"
                      : item.status === "PENDING"
                      ? "#FFC107"
                      : "#F44336",
                },
              ]}
            >
              {item.status}
            </Text>
          </View>
          <Text style={styles.amountText}>₱ {item.totalPay}.00</Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Payment Details</Text>
            <Text style={styles.modalName}>{item.userData.fullName}</Text>
            <Text style={styles.modalAddress}>{item.userData.address}</Text>

            <View style={{ marginTop: 10 }}>
              <Text style={styles.modalItem}>
                Payment Transaction: Bayad Center
              </Text>
              <Text style={styles.modalItem}>
                Total Pay: ₱{selectedItem?.totalPay}.00
              </Text>
              <Text style={styles.modalItem}>
                Date: {selectedItem?.createdAt}
              </Text>
              <Text style={styles.modalItem}>
                Status: {selectedItem?.status}
              </Text>
            </View>

            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  historyInfo: {
    flex: 1,
  },
  historyDate: {
    fontWeight: "500",
  },
  statusText: {
    fontSize: 12,
    marginTop: 2,
  },
  amountText: {
    fontWeight: "bold",
  },

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
});
