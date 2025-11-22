import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { layout } from "../styles/layout";

const StatsScreen: React.FC = () => {
  return (
    <View style={layout.container}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
        Tilastot
      </Text>
      <Text>
        Tänne tulee graafit (keskiarvot, pistetrendit, voittomäärät jne.).
      </Text>
    </View>
  );
};

export default StatsScreen;