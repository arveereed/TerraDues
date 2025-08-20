import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Header from "@/components/Header";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useUserContext } from "@/contexts/UserContext";
import { addNewTransaction } from "@/services/transactionService";
import { scale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

type OptionsType = {
  year: string;
  month: string;
  day: string;
};

export default function transactionModal() {
  const { user } = useUserContext();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const today = new Date();
  const options: OptionsType = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const handleCreateTransaction = async () => {
    setLoading(true);
    const success = await addNewTransaction(300, user?.user_id, user);
    if (success) {
      setLoading(false);
      router.back();
    }
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={"Create Transaction"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        {/* form */}
        <ScrollView
          contentContainerStyle={styles.form}
          showsVerticalScrollIndicator={false}
        >
          <Typo size={16}>Payment Transaction: Bayad Center</Typo>
          <Typo size={16}>Monthly Due: &#8369;300.00</Typo>
          <Typo size={16}>Total Pay: &#8369;300.00</Typo>
          <Typo size={16}>
            Date: {today.toLocaleDateString(undefined, options as {})}
          </Typo>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <Button
          loading={loading}
          style={{ flex: 1 }}
          onPress={handleCreateTransaction}
        >
          <Typo color={colors.white} fontWeight={"700"}>
            Add
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingY._20,
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    marginBottom: spacingY._5,
  },
});
