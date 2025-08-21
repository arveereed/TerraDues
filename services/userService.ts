import { db } from "@/config/firebase";
import { UserDataSignUpType } from "@/types";
import {
  addDoc,
  collection,
  getDocs,
  query,
  Timestamp,
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

export const getUserById = async (userId: string) => {
  try {
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("user_id", "==", userId));

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    }

    console.warn(`No user found with ID: ${userId}`);
    return null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
