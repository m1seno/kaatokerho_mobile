import React from "react";
import { View, Text } from "react-native";

const MainTabNavigator: React.FC = () => {
  // Tänne tehdään myöhemmin createBottomTabNavigator,
  // jossa Home, Sarjataulukko, Kalenteri, Tilastot, Admin (jos admin)
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>MainTabNavigator placeholder - tänne tulee alapalkin navigaatio</Text>
    </View>
  );
};

export default MainTabNavigator;