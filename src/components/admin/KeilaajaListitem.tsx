import React, { useState } from "react";
import { LayoutAnimation, View } from "react-native";
import { Card, IconButton, TouchableRipple, Text } from "react-native-paper";
import { Keilaaja } from "../../services/keilaajaService";

type Props = {
  keilaaja: Keilaaja;
  onEdit: (k: Keilaaja) => void;
  onDelete: (k: Keilaaja) => void;
};

const KeilaajaListItem: React.FC<Props> = ({ keilaaja, onEdit, onDelete }) => {

  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  }

  return (
    <Card style={{ marginBottom: 8, borderRadius: 12 }} mode="elevated">
      <TouchableRipple onPress={toggleExpand} rippleColor="rgba(0,0,0,0.1)">
        <View>
          <Card.Title
            title={`${keilaaja.etunimi} ${keilaaja.sukunimi}`}
            subtitle={
              expanded
                ? undefined
                : null // suppea versio
            }
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
                <IconButton
                  icon={expanded ? "chevron-up" : "chevron-down"}
                  size={22}
                  onPress={toggleExpand}
                />
              </View>
            )}
          />

          {/* Expanded-sisältö */}
          {expanded && (
            <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
              <Text variant="bodyMedium">
                <Text style={{ fontWeight: "bold" }}>Käyttäjänimi: </Text>
                {keilaaja.kayttajanimi}
              </Text>

              <Text variant="bodyMedium">
                <Text style={{ fontWeight: "bold" }}>Aktiivijäsen: </Text>
                {keilaaja.aktiivijasen ? "Kyllä" : "Ei"}
              </Text>

              <Text variant="bodyMedium">
                <Text style={{ fontWeight: "bold" }}>Admin: </Text>
                {keilaaja.admin ? "Kyllä" : "Ei"}
              </Text>

              <Text variant="bodyMedium">
                <Text style={{ fontWeight: "bold" }}>Syntymäpäivä: </Text>
                {keilaaja.syntymapaiva}
              </Text>
            </View>
          )}
        </View>
      </TouchableRipple>
    </Card>
  );
};

export default KeilaajaListItem;
