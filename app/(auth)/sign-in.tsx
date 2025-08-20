import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { useSignIn } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Animated, { FadeIn } from "react-native-reanimated";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      setIsLoading(true);
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        setIsLoading(false);
        router.replace("/");
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        setIsLoading(false);
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      if (err.errors?.[0]?.code === "form_password_incorrect") {
        setError("Password is incorrect. Please try again.");
      } else if (err.errors?.[0]?.code === "form_param_format_invalid") {
        setError("Email address must be a valid email address.");
      } else if (err.errors?.[0]?.code === "form_identifier_not_found") {
        setError("Email doesn't exist. Please try again.");
      } else if (
        err.errors?.[0]?.code === "form_param_nil" ||
        err.errors?.[0]?.code === "form_conditional_param_missing"
      ) {
        setError("Email or password is empty.");
      }
      setIsLoading(false);

      // console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <ScreenWrapper>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
      >
        <View style={styles.container}>
          <BackButton iconSize={28} />

          <View style={styles.logoContainer}>
            <Animated.Image
              entering={FadeIn.duration(1000)}
              source={require("../../assets/images/splashImage.png")}
              style={styles.welcomeImage}
              resizeMode="contain"
            />
            <View style={styles.titleContainer}>
              <Typo size={20} color={"#0D7947"} fontWeight={"700"}>
                TERRA
              </Typo>
              <Typo size={20} color={colors.black} fontWeight={"700"}>
                DUES
              </Typo>
            </View>
          </View>

          {/* form */}
          <View style={styles.form}>
            {error ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={20} color={colors.rose} />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={() => setError("")}>
                  <Ionicons name="close" size={20} color={colors.white} />
                </TouchableOpacity>
              </View>
            ) : null}
            <Input
              placeholder="Enter your email"
              value={emailAddress}
              onChangeText={(emailAddress: string) =>
                setEmailAddress(emailAddress)
              }
              icon={
                <Icons.At size={26} color={colors.neutral300} weight="fill" />
              }
            />
            <Input
              placeholder="Enter your password"
              secureTextEntry={true}
              value={password}
              onChangeText={(password: string) => setPassword(password)}
              icon={
                <Icons.Lock size={26} color={colors.neutral300} weight="fill" />
              }
            />
            <Typo
              size={14}
              color={colors.text}
              style={{ alignSelf: "flex-end" }}
            >
              Forgot Password?
            </Typo>
            <Button loading={isLoading} onPress={onSignInPress}>
              <Typo fontWeight={700} color={colors.white} size={21}>
                Login
              </Typo>
            </Button>
          </View>

          {/* footer */}
          <View style={styles.footer}>
            <Typo size={15} color={colors.black}>
              Don't have an account?
            </Typo>
            <Pressable onPress={() => router.push("/(auth)/sign-up")}>
              <Typo size={15} fontWeight={700} color="#0D7947">
                Sign up
              </Typo>
            </Pressable>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._20,
  },
  welcomeText: {
    fontSize: verticalScale(20),
    fontWeight: "bold",
    color: colors.text,
  },
  form: {
    gap: spacingY._20,
  },
  forgotPassword: {
    textAlign: "right",
    fontWeight: "500",
    color: colors.text,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    textAlign: "center",
    color: colors.text,
    fontSize: verticalScale(15),
  },
  welcomeImage: {
    width: "100%",
    height: verticalScale(200),
    alignSelf: "center",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 4,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  // 🔴 Error styles
  errorBox: {
    backgroundColor: "#FFE5E5",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.rose,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  errorText: {
    color: colors.text,
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
  },
});
