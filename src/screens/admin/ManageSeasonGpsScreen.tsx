// src/screens/admin/ManageSeasonGpsScreen.tsx
import React, { useEffect, useState } from "react";
import { View, FlatList, Alert, ScrollView } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import { layout } from "../../styles/layout";

import { Season } from "../../services/seasonService";
import {
  Gp,
  getGpsBySeason,
  createGp,
  updateGp,
  deleteGp,
  CreateGpPayload,
  UpdateGpPayload,
} from "../../services/gpService";

import GpAdminListItem from "../../components/admin/GpAdminListItem";
import GpFormDialog, {
  GpFormValues,
} from "../../components/admin/GpFormDialog";

type Props = {
  route: {
    params: {
      season: Season;
    };
  };
};

const ManageSeasonGpsScreen: React.FC<Props> = ({ route }) => {
  const { season } = route.params;

  const [gps, setGps] = useState<Gp[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingGp, setEditingGp] = useState<Gp | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadGps = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getGpsBySeason(season.kausiId);
      setGps(data);
    } catch (e) {
      console.log("getGpsBySeason error:", e);
      setError("GP-listan lataaminen epäonnistui.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGps();
  }, [season.kausiId]);

  const openAddDialog = () => {
    setEditingGp(null);
    setDialogVisible(true);
  };

  const openEditDialog = (gp: Gp) => {
    setEditingGp(gp);
    setDialogVisible(true);
  };

  const closeDialog = () => {
    setDialogVisible(false);
    setEditingGp(null);
  };

  const handleDelete = (gp: Gp) => {
    Alert.alert(
      "Poista GP",
      `Haluatko varmasti poistaa GP #${gp.jarjestysnumero}?`,
      [
        { text: "Peruuta", style: "cancel" },
        {
          text: "Poista",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteGp(gp.gpId);
              setGps((prev) => prev.filter((g) => g.gpId !== gp.gpId));
            } catch (e) {
              console.log("deleteGp error:", e);
              Alert.alert("Virhe", "GP:n poistaminen epäonnistui.");
            }
          },
        },
      ]
    );
  };

  const handleSubmitForm = async (data: GpFormValues, isEdit: boolean) => {
    setSubmitting(true);
    try {
      if (isEdit && editingGp) {
        const updated = await updateGp(editingGp.gpId, data);
        setGps((prev) =>
          prev
            .map((g) => (g.gpId === updated.gpId ? updated : g))
            .sort((a, b) => a.jarjestysnumero - b.jarjestysnumero)
        );
      } else {
        const payload: CreateGpPayload = {
          jarjestysnumero: data.jarjestysnumero,
          pvm: data.pvm,
          keilahalliId: data.keilahalliId,
          kultainenGp: data.onKultainenGp,
          kausiId: season.kausiId,
        };

        const created = await createGp(payload);
        setGps((prev) => [...prev, created]);
      }
      closeDialog();
    } catch (e) {
      console.log("save GP error:", e);
      Alert.alert(
        "Virhe",
        "GP:n tallentaminen epäonnistui."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEnterResults = (gp: Gp) => {
    // Placeholder
    console.log("Enter results for GP", gp.gpId);
    Alert.alert(
      "Tulokset",
      `Tähän kohtaan myöhemmin tulosten syöttö GP #${gp.jarjestysnumero}.`
    );
  };

  const handleDeleteResults = (gp: Gp) => {
    // Placeholder
    console.log("Delete results for GP", gp.gpId);
    Alert.alert(
      "Poista tulokset",
      `Tähän kohtaan myöhemmin tulosten poistaminen GP #${gp.jarjestysnumero}.`
    );
  };

  return (
    <ScrollView style={[layout.container, { padding: 16 }]}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Text variant="headlineMedium">GP:t - {season.nimi}</Text>
        <Button mode="contained" onPress={openAddDialog}>
          Lisää GP
        </Button>
      </View>

      {loading && (
        <View style={[layout.center, { marginTop: 32 }]}>
          <ActivityIndicator animating size="large" />
        </View>
      )}

      {!loading && error && (
        <Text style={{ color: "red", marginBottom: 16 }}>{error}</Text>
      )}

      {!loading && !error && (
        <FlatList
          data={gps}
          keyExtractor={(item) => item.gpId.toString()}
          renderItem={({ item }) => (
            <GpAdminListItem
              gp={item}
              onEdit={openEditDialog}
              onDelete={handleDelete}
              onEnterResults={handleEnterResults}
              onDeleteResults={handleDeleteResults}
            />
          )}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={
            <Text>Ei GP:tä kaudella. Lisää ensimmäinen GP.</Text>
          }
        />
      )}

      <GpFormDialog
        visible={dialogVisible}
        editingGp={editingGp}
        onDismiss={closeDialog}
        onSubmit={handleSubmitForm}
        submitting={submitting}
      />
    </ScrollView>
  );
};

export default ManageSeasonGpsScreen;
