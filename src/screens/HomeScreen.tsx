import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native-paper";
import { layout } from "../styles/layout";
import { useAuthStore } from "../store/AuthStore";

const HomeScreen: React.FC = () => {
  const user = useAuthStore((s) => s.user);

  return (
    <SafeAreaView style={layout.container}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
        Tervetuloa, {user?.etunimi} {user?.sukunimi}
      </Text>
      <Text>
        Tänne tulee myöhemmin:
      </Text>
      <Text>- Oma kausitilanteesi (sijoitus, pisteet, keskiarvo)</Text>
      <Text>- Seuraava GP (päivämäärä, aika, halli)</Text>
    </SafeAreaView>
  );
};

export default HomeScreen;