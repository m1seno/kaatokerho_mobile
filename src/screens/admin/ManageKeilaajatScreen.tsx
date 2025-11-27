import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { layout } from "../../styles/layout";

const ManageKeilaajatScreen: React.FC = () => {
  return (
    <View style={[layout.container, { padding: 24 }]}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
        Keilaajien hallinta
      </Text>
      <Text>
        Tänne tulee keilaajien lista, haku ja CRUD-toiminnot (lisää, muokkaa, poista).
      </Text>
    </View>
  );
};

export default ManageKeilaajatScreen;