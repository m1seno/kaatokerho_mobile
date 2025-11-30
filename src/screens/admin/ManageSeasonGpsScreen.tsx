// src/screens/admin/ManageSeasonGpsScreen.tsx
import React, { useEffect, useState } from "react";
import { View, FlatList, Alert } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import { layout } from "../../styles/layout";

import {
  Gp,
  getGpsBySeason,
  createGp,
  updateGp,
  deleteGp,
  CreateGpPayload,
} from "../../services/gpService";

import GpAdminListItem from "../../components/admin/GpAdminListItem";
import GpFormDialog, {
  GpFormValues,
} from "../../components/admin/GpFormDialog";

import { RouteProp, useRoute } from "@react-navigation/native";
import { AdminStackParamList } from "../../navigation/AdminNavigator";

import {
  CalendarRefreshStore,
  HomeRefreshStore,
  StandingsRefreshStore,
} from "../../store/refreshStore";

import { Keilaaja, fetchAllKeilaajat } from "../../services/keilaajaService";

import ResultsFormDialog from "../../components/admin/ResultsFormDialog";
import { deleteResultsForGp } from "../../services/resultsService";

type RouteParams = RouteProp<AdminStackParamList, "ManageSeasonGps">;

const ManageSeasonGpsScreen: React.FC = () => {
  const route = useRoute<RouteParams>();
  const { kausiId, kausiNimi } = route.params;

  // Refresh-storejen setterit
  const setHomeNeedsRefresh = HomeRefreshStore((s) => s.setNeedsRefresh);
  const setStandingsNeedsRefresh = StandingsRefreshStore((s) => s.setNeedsRefresh);
  const setCalendarNeedsRefresh = CalendarRefreshStore((s) => s.setNeedsRefresh);

  const [gps, setGps] = useState<Gp[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // GP-lisäys/muokkaus -dialogi
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingGp, setEditingGp] = useState<Gp | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Tulosten syöttö/poisto
  const [resultsDialogVisible, setResultsDialogVisible] = useState(false);
  const [selectedGpForResults, setSelectedGpForResults] = useState<Gp | null>(null);
  const [allKeilaajat, setAllKeilaajat] = useState<Keilaaja[]>([]);
  const [submittingResults, setSubmittingResults] = useState(false);

  // GP-listan haku
  const loadGps = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getGpsBySeason(kausiId);
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
  }, [kausiId]);

  // Keilaajien haku tulosdialogia varten
  useEffect(() => {
    const loadKeilaajat = async () => {
      try {
        const data = await fetchAllKeilaajat();
        setAllKeilaajat(data);
      } catch (e) {
        console.log("Keilaajien haku epäonnistui:", e);
      }
    };
    loadKeilaajat();
  }, []);

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
            } finally {
              setCalendarNeedsRefresh(true);
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
          kausiId: kausiId,
        };

        const created = await createGp(payload);
        setGps((prev) => [...prev, created]);
      }
      closeDialog();
    } catch (e) {
      console.log("save GP error:", e);
      Alert.alert("Virhe", "GP:n tallentaminen epäonnistui.");
    } finally {
      setSubmitting(false);
      setCalendarNeedsRefresh(true);
    }
  };

  // Tulokset syöttö ja poisto
  const handleEnterResults = (gp: Gp) => {
    setSelectedGpForResults(gp);
    setResultsDialogVisible(true);
  };

  const handleDeleteResults = (gp: Gp) => {
    Alert.alert(
      "Poista tulokset",
      `Haluatko varmasti poistaa kaikki tulokset GP #${gp.jarjestysnumero}?`,
      [
        { text: "Peruuta", style: "cancel" },
        {
          text: "Poista",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteResultsForGp(gp.gpId);
              // Päivitetään etusivu, sarjataulukko ja kalenteri
              setHomeNeedsRefresh(true);
              setStandingsNeedsRefresh(true);
              setCalendarNeedsRefresh(true);
            } catch (e) {
              console.log("deleteResultsForGp error:", e);
              Alert.alert("Virhe", "Tulosten poistaminen epäonnistui.");
            }
          },
        },
      ]
    );
  };

  const closeResultsDialog = () => {
    setResultsDialogVisible(false);
    setSelectedGpForResults(null);
  };

  const handleResultsSaved = () => {
    // Tulosten tallennus päivittää backendissä KuppiksenKunkun, kultaisen GP:n, KeilaajaKausi-tilastot jne.
    // Päivitetään näkymät
    setHomeNeedsRefresh(true);
    setStandingsNeedsRefresh(true);
    setCalendarNeedsRefresh(true);
  };

  return (
    <View style={[layout.container, { flex: 1, padding: 16 }]}>
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
        ListHeaderComponent={
          <View style={{ marginBottom: 16 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Text variant="headlineMedium">GP:t - {kausiNimi}</Text>
              <Button mode="contained" onPress={openAddDialog}>
                Lisää GP
              </Button>
            </View>

            {loading && (
              <View style={[layout.center, { marginTop: 16 }]}>
                <ActivityIndicator animating size="large" />
              </View>
            )}

            {!loading && error && (
              <Text style={{ color: "red", marginBottom: 16 }}>{error}</Text>
            )}
          </View>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <Text>Ei GP:tä kaudella. Lisää ensimmäinen GP.</Text>
          ) : null
        }
      />

      {/* GP:n lisääminen / muokkaaminen */}
      <GpFormDialog
        visible={dialogVisible}
        editingGp={editingGp}
        onDismiss={closeDialog}
        onSubmit={handleSubmitForm}
        submitting={submitting}
      />

      {/* GP-tulosten syöttö */}
      <ResultsFormDialog
        visible={resultsDialogVisible}
        gp={selectedGpForResults}
        keilaajat={allKeilaajat}
        onDismiss={closeResultsDialog}
        onSaved={handleResultsSaved}
        submitting={submittingResults}
        setSubmitting={setSubmittingResults}
      />
    </View>
  );
};

export default ManageSeasonGpsScreen;
