import React from "react";
import { View } from "react-native";
import { Card, IconButton, Text } from "react-native-paper";
import { Keilaaja } from "../../services/keilaajaService";

type Props = {
  keilaaja: Keilaaja;
  onEdit: (k: Keilaaja) => void;
  onDelete: (k: Keilaaja) => void;
};

const KeilaajalistItem: React.FC<Props> = ({ keilaaja, onEdit, onDelete }) => {
  return (
    <Card style={{ marginBottom: 8, borderRadius: 12 }} mode="elevated">
      <Card.Title
        title={`${keilaaja.etunimi} ${keilaaja.sukunimi}`}
        subtitle={`Käyttäjänimi: ${keilaaja.kayttajanimi} | Aktiivijäsen: ${
          keilaaja.aktiivijasen ? "Kyllä" : "Ei"
        } | Admin: ${keilaaja.admin ? "Kyllä" : "Ei"}`}
        right={() => (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => onEdit(keilaaja)}
            />
            <IconButton
              icon="delete"
              size={20}
              onPress={() => onDelete(keilaaja)}
            />
          </View>
        )}
      />
    </Card>
  );
};

export default KeilaajalistItem;
