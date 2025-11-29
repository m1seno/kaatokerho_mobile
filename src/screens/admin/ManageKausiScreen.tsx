import React from "react";
import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import { layout } from "../../styles/layout";
import SeasonListItem from "../../components/admin/SeasonListItem";
import { Season } from "../../services/seasonService";

const ManageKausiScreen: React.FC = () => {
  const mockSeason: Season = {
    kausiId: 1,
    nimi: "2024-2025",
    osallistujamaara: 18,
    gpMaara: 10,
    suunniteltuGpMaara: 13,
  };

  const handleEdit = (season: Season) => {
    console.log("Edit season (temporary)", season);
  };

  const handleDelete = (season: Season) => {
    console.log("Delete season (temporary)", season);
  };

  const handleOpenGpList = (season: Season) => {
    console.log("Open GP list (temporary)", season);
  };

  return (
    <ScrollView
      style={layout.container}
      contentContainerStyle={{ padding: 24, paddingBottom: 32 }}
    >
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
        Kausien hallinta
      </Text>

      <SeasonListItem
        season={mockSeason}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onOpenGpList={handleOpenGpList}
      />
    </ScrollView>
  );
};

export default ManageKausiScreen;
