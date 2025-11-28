import React, { useState } from "react";
import { View, LayoutAnimation, Platform, UIManager } from "react-native";
import { Card, Text, TouchableRipple } from "react-native-paper";
import { appColors } from "../../styles";
import { StandingsRow } from "../../services/standingsService";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
    row: StandingsRow;
}

const StandingsListItem: React.FC<Props> = ({ row }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  };

  return (
    <Card
      style={{ marginBottom: 8, borderRadius: 12, backgroundColor: "#fff" }}
      mode="elevated"
    >
      <TouchableRipple onPress={toggleExpanded} rippleColor="rgba(0,0,0,0.08)">
        <View style={{ paddingHorizontal: 12, paddingVertical: 10 }}>
          {/* Ylärivi – tiivis näkymä */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: expanded ? 8 : 0,
            }}
          >
            <Text
              style={{
                width: 32,
                fontWeight: "bold",
                color: appColors.primary,
                fontSize: 16,
              }}
            >
              {row.sija}.
            </Text>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 16,
                }}
              >
                {row.nimi}
              </Text>
            </View>

            <Text
              style={{
                fontWeight: "bold",
                fontSize: 15,
                color: "#111827",
              }}
            >
              {row.pisteet}
            </Text>
          </View>

          {/* Laajennettu tila – tarkemmat statsit */}
          {expanded && (
            <View style={{ marginTop: 4 }}>
              <Text style={{ fontSize: 13 }}>
                <Text style={{ fontWeight: "bold" }}>GP:t: </Text>
                {row.gpMaara}
              </Text>
              <Text style={{ fontSize: 13 }}>
                <Text style={{ fontWeight: "bold" }}>Pisteet / GP: </Text>
                {row.pisteetPerGp.toFixed(2)}
              </Text>
              <Text style={{ fontSize: 13 }}>
                <Text style={{ fontWeight: "bold" }}>GP-voitot: </Text>
                {row.gpVoitot}
              </Text>
              <Text style={{ fontSize: 13 }}>
                <Text style={{ fontWeight: "bold" }}>KA / GP: </Text>
                {row.kaGp.toFixed(2)}
              </Text>
            </View>
          )}
        </View>
      </TouchableRipple>
    </Card>
  );
};

export default StandingsListItem;