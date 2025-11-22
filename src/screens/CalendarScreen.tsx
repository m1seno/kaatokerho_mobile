import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { layout } from "../styles/layout";

const CalendarScreen: React.FC = () => {
  return (
    <View style={layout.container}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
        Kilpailukalenteri
      </Text>
      <Text>
        Tänne listataan kauden GP:t päivämäärineen ja halleineen.
      </Text>
    </View>
  );
};

export default CalendarScreen;