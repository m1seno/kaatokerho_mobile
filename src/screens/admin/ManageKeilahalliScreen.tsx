import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { layout } from "../../styles/layout";

const ManageKeilahallitScreen: React.FC = () => {
  return (
    <View style={[layout.container, { padding: 24 }]}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
        Keilahallien hallinta
      </Text>
      <Text>
        Tänne tulee keilahallien lista ja CRUD-toiminnot.
      </Text>
    </View>
  );
};

export default ManageKeilahallitScreen;