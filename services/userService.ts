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
  writeBatch,
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
      return { ...(docSnap.data() as UserType), id: docSnap.id };
    }

    console.warn(`No user found with ID: ${userId}`);
    return null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const allowAllUsersToMakeTransaction = async () => {
  try {
    const usersCollection = collection(db, "users");
    const querySnapshot = await getDocs(usersCollection);

    if (querySnapshot.empty) {
      console.log("No users found.");
      return;
    }

    const batch = writeBatch(db);

    querySnapshot.forEach((document) => {
      const data = document.data();
      if (data.role === "User") {
        const userRef = doc(db, "users", document.id);
        batch.update(userRef, { makeTransaction: true });
      }
    });

    await batch.commit();
    console.log("All users updated successfully ✅");
  } catch (error) {
    console.error("Error updating all users:", error);
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
