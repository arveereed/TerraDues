import { radius } from "@/constants/theme";
import { CustomButtonProps } from "@/types";
import { verticalScale } from "@/utils/styling";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, TouchableOpacity } from "react-native";
import Loading from "./Loading";

const Button = ({ style, onPress, loading, children }: CustomButtonProps) => {
  const content = loading ? <Loading /> : children;

  return (
    <TouchableOpacity onPress={onPress} disabled={loading} style={style}>
      <LinearGradient
        colors={["#6CD04D", "#478C41"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.button}
      >
        {content}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    borderRadius: radius._17,
    borderCurve: "continuous",
    height: verticalScale(52),
    justifyContent: "center",
    alignItems: "center",
  },
});
