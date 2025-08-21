import { db } from "@/config/firebase";
import { UserType } from "@/types";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

export const addNewTransaction = async (
  totalPay: number,
  user_id: string | undefined,
  userData: UserType | null
) => {
  try {
    const transactionsCollection = collection(db, "transactions");

    await addDoc(transactionsCollection, {
      userData,
      user_id,
      paymentMethod: "Bayad Center",
      totalPay,
      status: "PENDING",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return true;
  } catch (error) {
    console.error("Error creating transaction: ", error);
    return false;
  }
};

export const getTransactionsByUserId = async (userId: string | undefined) => {
  if (!userId) return;
  try {
    const transactionsCollection = collection(db, "transactions");
    const q = query(
      transactionsCollection,
      where("user_id", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);

    const statusQ = query(
      transactionsCollection,
      where("user_id", "==", userId),
      where("status", "==", "PAID"),
      orderBy("createdAt", "desc")
    );

    const queryStatusSnapshot = await getDocs(statusQ);

    if (!querySnapshot.empty || !queryStatusSnapshot.empty) {
      let summary = 0;
      const total = queryStatusSnapshot.docs.map((doc) => {
        const data = doc.data();
        summary += data.totalPay;
      });
      const transactions = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const timestamp = new Timestamp(
          data.createdAt.seconds,
          data.createdAt.nanoseconds
        );
        const date = timestamp.toDate();
        const formatted = date.toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        const timestamp1 = new Timestamp(
          data.updatedAt.seconds,
          data.updatedAt.nanoseconds
        );
        const date1 = timestamp1.toDate();
        const formatted1 = date1.toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        return {
          id: doc.id,
          updatedAt: formatted1,
          userData: data.userData,
          user_id: data.user_id,
          totalPay: data.totalPay,
          createdAt: formatted,
          paymentMethod: data.paymentMethod,
          status: data.status,
        };
      });
      return { summary, transactions };
    }

    console.warn(`No transactions found with ID: ${userId}`);
    return null;
  } catch (error) {
    console.error("Error fetching transactions by userId:", error);
    return null;
  }
};

export const getTransactions = async () => {
  try {
    const transactionsCollection = collection(db, "transactions");
    const q = query(transactionsCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const timestamp = new Timestamp(
          data.createdAt.seconds,
          data.createdAt.nanoseconds
        );
        const date = timestamp.toDate();
        const formatted = date.toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        return {
          id: doc.id,
          userData: data.userData,
          user_id: data.user_id,
          totalPay: data.totalPay,
          createdAt: formatted,
          paymentMethod: data.paymentMethod,
          status: data.status,
        };
      });
    }

    console.warn(`No transactions found`);
    return null;
  } catch (error) {
    console.error("Error fetching transactions by userId:", error);
    return null;
  }
};

export const updateStatus = async (id: string, status: string) => {
  if (!id) return { success: false, message: "No Transaction ID" };
  try {
    const transactionRef = doc(db, "transactions", id);
    await updateDoc(transactionRef, {
      status,
      updatedAt: serverTimestamp(),
    });
    return { success: true, message: "Transaction status updated" };
  } catch (error) {
    console.error("Error updating transaction status: ", error);
    return { success: false, message: "Firebase error" };
  }
};
