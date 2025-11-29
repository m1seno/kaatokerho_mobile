import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { Calendar } from "../../services/calendarService";
import { formatDateFi } from "../../utils/date";
import { appColors } from "../../styles";

type Props = {
  gp: Calendar;
  onPress: () => void;
};

const GpListItem: React.FC<Props> = ({ gp, onPress }) => {
  const formattedDate = formatDateFi(gp.pvm);
  const hasWinner = gp.voittaja && gp.voittotulos;

  return (
    <Card mode="elevated" style={styles.card} onPress={onPress}>
      <Card.Title
        title={`GP #${gp.jarjestysnumero}`}
        subtitle={formattedDate}
      />
      <Card.Content>
        <Text variant="bodyMedium">{gp.keilahalli}</Text>
        <View style={styles.metaRow}>
          {hasWinner ? (
            <Text variant="bodySmall" style={styles.winner}>
              {gp.voittaja} - {gp.voittotulos}
            </Text>
          ) : (
            <Text variant="bodySmall" style={styles.muted}>
              Tulokset eivät vielä saatavilla
            </Text>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

// ChatGPT:n tekemät tyylit
const styles = StyleSheet.create({
  card: { marginBottom: 12 },
  metaRow: { marginTop: 6 },
  winner: { color: appColors.primary },
  muted: { color: "#6B7280" },
});

export default GpListItem;
