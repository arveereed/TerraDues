import { db } from "@/config/firebase";
import { FireStoreUser, UserDataSignUpType, UserType } from "@/types";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

export const addUser = async (userData: UserDataSignUpType) => {
  try {
    const usersCollection = collection(db, "users");

    await addDoc(usersCollection, {
      ...userData,
      createdAt: Timestamp.now(),
      role: "User",
      makeTransaction: true,
    });
  } catch (error) {
    console.error("Error adding user: ", error);
  }
};

export const getUserById = async (
  userId: string
): Promise<FireStoreUser | null> => {
  try {
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("user_id", "==", userId));

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      return { id: docSnap.id, ...(docSnap.data() as UserType) };
    }

    console.warn(`No user found with ID: ${userId}`);
    return null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const updateMakeTransaction = async (
  id: string,
  makeTransaction: boolean
) => {
  if (!id) return;
  try {
    const userRef = doc(db, "users", id);
    await updateDoc(userRef, { makeTransaction });

    return { success: true, message: "makeTransaction updated" };
  } catch (error) {
    console.error("Error updating makeTransaction:", error);
    return { success: false, message: "Error updating makeTransaction" };
  }
};
