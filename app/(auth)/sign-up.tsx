import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { addUser } from "@/services/userService";
import { UserDataSignUpType } from "@/types";
import { verticalScale } from "@/utils/styling";
import { useSignUp } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import * as React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Animated, { FadeIn } from "react-native-reanimated";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [address, setAddress] = React.useState("");

  const [pendingVerification, setPendingVerification] =
    React.useState<boolean>(false);
  const [code, setCode] = React.useState("");

  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setIsLoading(true);

    if (!fullName || !address) {
      setError("Full name or address is empty");
      setIsLoading(false);
      return;
    }

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
        unsafeMetadata: { fullName, address },
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setIsLoading(false);
      setError("");
      setPendingVerification(true);
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      if (err.errors?.[0]?.code === "form_identifier_exists") {
        setError("That email address is taken. Please try another.");
      } else if (err.errors?.[0]?.code === "form_param_format_invalid") {
        setError("Email address must be a valid email address.");
      } else if (err.errors?.[0]?.code === "form_param_nil") {
        setError("Email or password is empty");
      } else if (err.errors?.[0]?.code === "form_password_length_too_short") {
        setError("Passwords must be 8 characters or more.");
      } else if (err.errors?.[0]?.code === "form_password_pwned") {
        setError("Please use a different password.");
      }
      setIsLoading(false);
      // console.error(JSON.stringify(err, null, 2));
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;
    setIsLoading(true);

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });

        const userData: UserDataSignUpType = {
          user_id: signUpAttempt.createdUserId as string,
          fullName: signUpAttempt.unsafeMetadata.fullName as string,
          address: signUpAttempt.unsafeMetadata.address as string,
          email: signUpAttempt.emailAddress as string,
        };
        addUser(userData);

        router.replace("/");
        setIsLoading(false);
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        setIsLoading(false);

        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      if (err.errors?.[0]?.code === "too_many_requests") {
        setError("Too many requests. Please try again in a bit.");
      } else if (err.errors?.[0]?.code === "form_param_nil") {
        setError("Enter a code");
      } else if (err.errors?.[0]?.code === "form_code_incorrect") {
        setError("The code is incorrect");
      }
      setIsLoading(false);

      // console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <ScreenWrapper>
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          enableOnAndroid={true}
          enableAutomaticScroll={true}
        >
          <View style={styles.verificationContainer}>
            <Text style={styles.verificationTitle}>Verify your email</Text>
            {error ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={20} color={colors.rose} />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={() => setError("")}>
                  <Ionicons name="close" size={20} color={colors.white} />
                </TouchableOpacity>
              </View>
            ) : null}

            <TextInput
              style={[styles.verificationInput, error && styles.errorInput]}
              value={code}
              placeholder="Enter your verification code"
              onChangeText={(code: string) => setCode(code)}
            />
            <Button
              loading={isLoading}
              onPress={onVerifyPress}
              style={{ width: 100 }}
            >
              <Typo style={styles.buttonText}>Verify</Typo>
            </Button>
          </View>
        </KeyboardAwareScrollView>
      </ScreenWrapper>
    );
  }

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
              placeholder="Enter your Full name"
              value={fullName}
              onChangeText={(fullname: string) => setFullName(fullname)}
              icon={
                <Icons.User size={26} color={colors.neutral300} weight="fill" />
              }
            />
            <Input
              placeholder="Enter your Address"
              value={address}
              onChangeText={(address: string) => setAddress(address)}
              icon={
                <Icons.NavigationArrow
                  size={26}
                  color={colors.neutral300}
                  weight="fill"
                />
              }
            />
            <Input
              placeholder="Enter your email"
              value={emailAddress}
              onChangeText={(email: string) => setEmailAddress(email)}
              icon={
                <Icons.At size={26} color={colors.neutral300} weight="fill" />
              }
            />
            <Input
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={(password: string) => setPassword(password)}
              icon={
                <Icons.Lock size={26} color={colors.neutral300} weight="fill" />
              }
            />

            <Button loading={isLoading} onPress={onSignUpPress}>
              <Typo fontWeight={700} color={colors.white} size={21}>
                Register
              </Typo>
            </Button>
          </View>

          {/* footer */}
          <View style={styles.footer}>
            <Typo size={15}>Already have an account?</Typo>
            <Pressable onPress={() => router.push("/(auth)/sign-in")}>
              <Typo size={15} fontWeight={700} color={colors.primary}>
                Login
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

  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
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
  errorInput: {
    borderColor: colors.rose,
  },

  // verification style
  verificationContainer: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  verificationTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 20,
    textAlign: "center",
  },
  verificationInput: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    fontSize: 16,
    color: colors.text,
    width: "100%",
    textAlign: "center",
    letterSpacing: 2,
  },
});
