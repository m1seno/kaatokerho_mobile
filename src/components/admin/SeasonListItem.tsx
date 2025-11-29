import React from "react";
import { View } from "react-native";
import { Card, IconButton, Text, } from "react-native-paper";
import { Season } from "../../services/seasonService";
import { appColors } from "../../styles";

type Props = {
  season: Season;
  onEdit: (s: Season) => void;
  onDelete: (s: Season) => void;
  onOpenGpList: (s: Season) => void; // Avaa kyseisen kauden gp-hallintanäkymän
};

const SeasonListItem: React.FC<Props> = ({
  season,
  onEdit,
  onDelete,
  onOpenGpList,
}) => {
  return (
    <Card
      style={{ marginBottom: 8, borderRadius: 12 }}
      mode="elevated"
      onPress={() => onOpenGpList(season)}
    >
      <Card.Title
        title={season.nimi}
        titleNumberOfLines={1}
        right={() => (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => onEdit(season)}
              iconColor={appColors.primary}
            />
            <IconButton
              icon="delete"
              size={20}
              onPress={() => onDelete(season)}
              iconColor={appColors.error}
            />
          </View>
        )}
      />
      <Card.Content>
        <Text variant="bodyMedium">{`Osallistujia: ${season.osallistujamaara}`}</Text>
        <Text variant="bodyMedium">
          {`GP:t: ${season.gpMaara}/${season.suunniteltuGpMaara}`}
        </Text>
      </Card.Content>
    </Card>
  );
};

export default SeasonListItem;
