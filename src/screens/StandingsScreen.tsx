import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { layout } from "../styles/layout";

const StandingsScreen: React.FC = () => {
  return (
    <View style={layout.container}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
        Sarjataulukko
      </Text>
      <Text>
        Tänne haetaan kauden sarjataulukko backendistä / API:sta.
      </Text>
    </View>
  );
};

export default StandingsScreen;