import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { layout } from "../styles/layout";
import { useAuthStore } from "../store/AuthStore";

const AdminScreen: React.FC = () => {
  const user = useAuthStore((s) => s.user);

  return (
    <View style={layout.container}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
        Admin-paneeli
      </Text>
      <Text style={{ marginBottom: 8 }}>
        Kirjautuneena: {user?.kayttajanimi} (admin: {String(user?.admin)})
      </Text>
      <Text>
        Tänne tulee:
      </Text>
      <Text>- GP:n luonti / muokkaus / poisto</Text>
      <Text>- Tulosten syöttö ja muokkaus</Text>
      <Text>- Mahdollisesti RSVP-kutsut push-notifikaatioilla</Text>
    </View>
  );
};

export default AdminScreen;