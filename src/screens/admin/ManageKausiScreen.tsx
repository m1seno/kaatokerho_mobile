import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { layout } from "../../styles/layout";

const ManageKausiScreen: React.FC = () => {
  return (
    <View style={[layout.container, { padding: 24 }]}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
        Kausien hallinta
      </Text>
      <Text>
        Tänne tulee kausien hallinta: nykyinen kausi, tulevat kaudet, arkistoidut kaudet jne.
      </Text>
    </View>
  );
};

export default ManageKausiScreen;