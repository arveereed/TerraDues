import { getUserById } from "@/services/userService";
import { UserType } from "@/types";
import { useUser } from "@clerk/clerk-expo";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type UserContextType = {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<any>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { isSignedIn, user: clerkUser } = useUser();
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    let isMounted = true; // ✅ flag to prevent state updates after unmount

    if (isSignedIn && clerkUser) {
      const fetchUser = async () => {
        const userData = await getUserById(clerkUser.id);

        if (!isMounted) return; // ✅ skip if unmounted

        if (userData) {
          setUser({
            user_id: userData.user_id,
            fullName: userData.fullName,
            address: userData.address,
            email: userData.email,
            role: userData.role,
          });
        }
      };
      fetchUser();
    }

    return () => {
      isMounted = false; // ✅ cleanup flag
    };
  }, [isSignedIn, clerkUser]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUserContext must be used within UserProvider");
  }

  return context;
};
