import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import { layout } from "../../styles/layout";
import SeasonListItem from "../../components/admin/SeasonListItem";
import {
  createSeason,
  deleteSeason,
  getAllSeasons,
  Season,
  SeasonCreateUpdate,
  updateSeason,
} from "../../services/seasonService";
import { useNavigation } from "@react-navigation/native";
import SeasonFormDialog from "../../components/admin/SeasonFormDialog";

const ManageKausiScreen: React.FC = () => {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [editingSeason, setEditingSeason] = useState<Season | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const navigation = useNavigation<any>();

  const loadSeasons = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllSeasons();
      setSeasons(data);
    } catch (e) {
      console.log("getAllSeasons error:", e);
      setError("Kausien lataaminen epäonnistui.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSeasons();
  }, []);

  const openAddDialog = () => {
    setEditingSeason(null);
    setDialogVisible(true);
  };

  const openEditDialog = (season: Season) => {
    setEditingSeason(season);
    setDialogVisible(true);
  };

  const closeDialog = () => {
    setEditingSeason(null);
    setDialogVisible(false);
  };

  const handleDelete = (season: Season) => {
    Alert.alert(
      "Poista kausi",
      `Jaluatko varmasi poistaa kauden ${season.nimi}?`,
      [
        { text: "Peruuta", style: "cancel" },
        {
          text: "Poista",
          style: "destructive",
          onPress: async () => {
            try {
              deleteSeason(season.kausiId);
              setSeasons((prev) =>
                prev.filter((s) => s.kausiId !== season.kausiId)
              );
            } catch (e) {
              console.log("deleteSeason error:", e);
              Alert.alert("Kauden poistaminen epäonnistui.");
            }
          },
        },
      ]
    );
  };

  const handleOpenGpList = (season: Season) => {
    navigation.navigate("ManageSeasonGps", {
      seasonId: season.kausiId,
      seasonName: season.nimi,
    });
  };

  const handleSubmitForm = async (
    data: SeasonCreateUpdate,
    isEdit: boolean
  ) => {
    setSubmitting(true);
    try {
      if (isEdit && editingSeason) {
        const updated = await updateSeason(editingSeason.kausiId, data);
        setSeasons((prev) =>
          prev.map((s) => (s.kausiId === editingSeason.kausiId ? updated : s))
        );
      } else {
        const created = await createSeason(data);
        setSeasons((prev) => [...prev, created]);
      }
      closeDialog();
    } catch (e) {
      console.log("save season error", e);
      Alert.alert("Virhe", "Kauden tallentaminen epäonnistui.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[layout.container, { padding: 16 }]}>
        {/* Otsikko + Lisää-painike */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Text variant="headlineMedium">Kausien hallinta</Text>
          <Button mode="contained" onPress={openAddDialog}>
            Lisää kausi
          </Button>
        </View>

        {/* Lataus / virhe / lista */}
        {loading && (
          <View style={[layout.container, { marginBottom: 32 }]}>
            <ActivityIndicator animating size="large" />
          </View>
        )}

        {!loading && error && (
          <Text style={{ color: "red", marginBottom: 16 }}>{error}</Text>
        )}

        {!loading && !error && (
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={seasons}
            keyExtractor={(item) => item.kausiId.toString()}
            renderItem={({ item }) => (
              <SeasonListItem
                season={item}
                onEdit={openEditDialog}
                onDelete={handleDelete}
                onOpenGpList={handleOpenGpList}
              />
            )}
            contentContainerStyle={{ paddingBottom: 24 }}
            ListEmptyComponent={
              <Text>Ei kausia. Lisää ensimmäinen kausi.</Text>
            }
          />
        )}

        {/* Lisää / muokkaa -dialogi */}
        <SeasonFormDialog
          visible={dialogVisible}
          editingSeason={editingSeason}
          onDismiss={closeDialog}
          onSubmit={handleSubmitForm}
          submitting={submitting}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ManageKausiScreen;
