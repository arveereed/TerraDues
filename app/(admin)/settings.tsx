import ScreenWrapper from "@/components/ScreenWrapper";
import { SignOutButton } from "@/components/SignOutButton";
import { Text } from "react-native";

export default function settings() {
  return (
    <ScreenWrapper>
      <Text>settings</Text>
      <SignOutButton />
    </ScreenWrapper>
  );
}
