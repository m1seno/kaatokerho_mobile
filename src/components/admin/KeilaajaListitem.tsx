import React, { useState } from "react";
import { LayoutAnimation, Platform, UIManager, View } from "react-native";
import { Card, IconButton, TouchableRipple, Text } from "react-native-paper";
import { Keilaaja } from "../../services/keilaajaService";
import { appColors } from "../../styles";

type Props = {
  keilaaja: Keilaaja;
  onEdit: (k: Keilaaja) => void;
  onDelete: (k: Keilaaja) => void;
};

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const KeilaajaListItem: React.FC<Props> = ({ keilaaja, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <Card style={{ marginBottom: 8, borderRadius: 12 }} mode="elevated">
      <TouchableRipple onPress={toggleExpand} rippleColor="rgba(0,0,0,0.1)">
        <View>
          <Card.Title
            title={`${keilaaja.etunimi} ${keilaaja.sukunimi}`}
            subtitle={
              expanded ? undefined : null // suppea versio
            }
            right={() => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <IconButton
                  icon="pencil"
                  size={20}
                  onPress={() => onEdit(keilaaja)}
                  iconColor={appColors.primary}
                />
                <IconButton
                  icon="delete"
                  size={20}
                  onPress={() => onDelete(keilaaja)}
                  iconColor={appColors.error}
                />
                <IconButton
                  icon={expanded ? "chevron-up" : "chevron-down"}
                  size={22}
                  onPress={toggleExpand}
                  iconColor={appColors.text}
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
