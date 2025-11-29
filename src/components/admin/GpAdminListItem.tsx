import React from "react";
import { View } from "react-native";
import { Card, IconButton, Text, Button, Chip } from "react-native-paper";
import { Gp } from "../../services/gpService";
import { appColors } from "../../styles";
import { formatDateFi } from "../../utils/date";

type Props = {
  gp: Gp;
  onEdit: (gp: Gp) => void;
  onDelete: (gp: Gp) => void;
  onEnterResults: (gp: Gp) => void;
  onDeleteResults: (gp: Gp) => void;
};

const GpAdminListItem: React.FC<Props> = ({
  gp,
  onEdit,
  onDelete,
  onEnterResults,
  onDeleteResults,
}) => {
  return (
    <Card
      style={{ marginBottom: 8, borderRadius: 12 }}
      mode="elevated"
    >
      <Card.Title
        title={`GP #${gp.jarjestysnumero}`}
        subtitle={`${formatDateFi(gp.pvm)} - ${gp.keilahalli.nimi}`}
        right={() => (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {gp.onKultainenGp && (
              <Chip
                compact
                style={{ marginRight: 4, backgroundColor: "#FEF3C7" }}
              >
                🏅 Kultainen
              </Chip>
            )}
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => onEdit(gp)}
              iconColor={appColors.primary}
            />
            <IconButton
              icon="delete"
              size={20}
              onPress={() => onDelete(gp)}
              iconColor={appColors.error}
            />
          </View>
        )}
      />
      <Card.Content>
        <Text variant="bodySmall" style={{ color: "grey" }}>
          {`${gp.keilahalli.kaupunki}, ${gp.keilahalli.valtio}`}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            marginTop: 8,
            gap: 8,
          }}
        >
          <Button
            mode="outlined"
            compact
            onPress={() => onEnterResults(gp)}
          >
            Syötä tulokset
          </Button>
          <Button
            mode="text"
            compact
            textColor={appColors.error}
            onPress={() => onDeleteResults(gp)}
          >
            Poista tulokset
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
};

export default GpAdminListItem;