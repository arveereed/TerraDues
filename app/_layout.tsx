import InitialLayout from "@/components/InitialLayout";
import { UserProvider } from "@/contexts/UserContext";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <UserProvider>
        <InitialLayout />
      </UserProvider>
    </ClerkProvider>
  );
}
