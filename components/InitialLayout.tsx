import { useUserContext } from "@/contexts/UserContext";
import { useAuth } from "@clerk/clerk-expo";
import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import Loading from "./Loading";

export default function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const { user } = useUserContext();

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const inAuthScreen = segments[0] === "(auth)";

    if (!isSignedIn && !inAuthScreen && !user) {
      router.replace("/");
    } else if (isSignedIn && inAuthScreen && user?.role === "User") {
      router.replace("/(user)/home");
    } else if (isSignedIn && inAuthScreen && user?.role === "Admin") {
      router.replace("/(admin)/dashboard");
    }
  }, [isLoaded, isSignedIn, segments, user]);

  if (!isLoaded) {
    return <Loading />; // * null or Loader component
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
