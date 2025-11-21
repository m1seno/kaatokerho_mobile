import React from "react";
import { View, Text } from "react-native";

const AuthNavigator: React.FC = () => {
  // Tässä tulee myöhemmin Stack-navigaatio,
  // jonka alussa on LoginScreen
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>AuthNavigator placeholder - tänne tulee Login-näkymä</Text>
    </View>
  );
};

export default AuthNavigator;