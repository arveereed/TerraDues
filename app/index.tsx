import Button from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Redirect, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

export default function Index() {
  const router = useRouter();
  const { user } = useUser();

  const { isSignedIn } = useAuth();

  if (
    isSignedIn &&
    user?.emailAddresses[0]?.emailAddress !== "jessieboyterraverde@gmail.com"
  ) {
    return <Redirect href={"/(user)/home"} />;
  } else if (
    isSignedIn &&
    user?.emailAddresses[0]?.emailAddress === "jessieboyterraverde@gmail.com"
  ) {
    return <Redirect href={"/(admin)/dashboard"} />;
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* login button and image */}
        <View style={styles.logoContainer}>
          <Animated.Image
            entering={FadeIn.duration(1000)}
            source={require("../assets/images/splashImage.png")}
            style={styles.welcomeImage}
            resizeMode="contain"
          />
          <View style={styles.titleContainer}>
            <Typo size={28} color={"#0D7947"} fontWeight={"700"}>
              TERRA
            </Typo>
            <Typo size={28} color={colors.black} fontWeight={"700"}>
              DUES
            </Typo>
          </View>
        </View>

        {/* footer */}
        <View style={styles.footer}>
          <Animated.View
            entering={FadeInDown.duration(1000).springify().damping(12)}
            style={{ alignItems: "center" }}
          >
            <Typo size={30} color={colors.black} fontWeight={800}>
              <Text style={{ color: "#0D7947" }}>Track</Text> Smart,
            </Typo>
            <Typo size={30} color={colors.black} fontWeight={800}>
              Grow <Text style={{ color: "#0D7947" }}>Steadily</Text>.
            </Typo>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(1000)
              .springify()
              .damping(12)
              .delay(100)}
            style={styles.buttonContainer}
          >
            <Button onPress={() => router.push("/(auth)/sign-up")}>
              <Typo size={22} color={colors.white} fontWeight={600}>
                Get Started
              </Typo>
            </Button>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(1000)
              .springify()
              .damping(12)
              .delay(200)}
            style={{ alignItems: "center", gap: 2 }}
          >
            <View style={styles.loginContainer}>
              <Typo size={14} color={colors.black}>
                Already have an account?
              </Typo>
              <TouchableOpacity
                onPress={() => router.push("/(auth)/sign-in")}
                style={styles.loginButton}
              >
                <Typo fontWeight={700} size={14} color="#0D7947">
                  {" "}
                  Login
                </Typo>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: spacingY._7,
  },
  welcomeImage: {
    width: "100%",
    height: verticalScale(200),
    alignSelf: "center",

    marginTop: verticalScale(100),
  },
  loginButton: {
    alignSelf: "flex-end",
    marginRight: spacingX._20,
  },
  footer: {
    backgroundColor: colors.white,
    alignItems: "center",
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(45),
    gap: spacingY._20,
    shadowColor: "white",
    shadowOffset: {
      width: 0,
      height: -10,
    },
    elevation: 10,
    shadowRadius: 25,
    shadowOpacity: 0.15,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: spacingX._25,
  },
  titleContainer: {
    flexDirection: "row",
    gap: 4,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loginContainer: {
    flexDirection: "row",
  },
});
