import React, { useEffect, useState } from "react";
import { View, FlatList, Alert } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import { layout } from "../../styles/layout";

import {
  Keilaaja,
  KeilaajaCreate,
  KeilaajaUpdate,
  fetchAllKeilaajat,
  createKeilaaja,
  updateKeilaaja,
  deleteKeilaaja,
} from "../../services/keilaajaService";

import KeilaajaListItem from "../../components/admin/KeilaajaListitem";
import KeilaajaFormDialog from "../../components/admin/KeilaajaFormDialog";

const ManageKeilaajatScreen: React.FC = () => {
  const [keilaajat, setKeilaajat] = useState<Keilaaja[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingKeilaaja, setEditingKeilaaja] = useState<Keilaaja | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Muutetaan päivämäärä yhteensopivaksi backendin kanssa
  const toIsoFromFi = (dateString: string): string => {
    const parts = dateString.split(".");
    if (parts.length !== 3) return dateString; // fallback, jos käyttäjä sekoilee
    const [dd, mm, yyyy] = parts;
    return `${yyyy}-${mm}-${dd}`;
  };

  const loadKeilaajat = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllKeilaajat();
      setKeilaajat(data);
    } catch (e) {
      console.log("fetchAllKeilaajat error:", e);
      setError("Keilaajien lataaminen epäonnistui.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKeilaajat();
  }, []);

  const openAddDialog = () => {
    setEditingKeilaaja(null);
    setDialogVisible(true);
  };

  const openEditDialog = (keilaaja: Keilaaja) => {
    setEditingKeilaaja(keilaaja);
    setDialogVisible(true);
  };

  const closeDialog = () => {
    setDialogVisible(false);
    setEditingKeilaaja(null);
  };

  // Keilaajan poistaminen
  const handleDelete = (keilaaja: Keilaaja) => {
    Alert.alert(
      "Poista keilaaja",
      `Haluatko varmasti poistaa keilaajan ${keilaaja.etunimi} ${keilaaja.sukunimi}`,
      [
        { text: "Peruuta", style: "cancel" },
        {
          text: "Poista",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteKeilaaja(keilaaja.keilaajaId);
              setKeilaajat((prev) =>
                prev.filter((k) => k.keilaajaId !== keilaaja.keilaajaId)
              );
            } catch (e) {
              console.log("deleteKeilaaja error:", e);
              Alert.alert("Virhe", "Keilaajan poistaminen epäonnistui.");
            }
          },
        },
      ]
    );
  };

  // Keilaajan lisääminen tai päivittäminen
  const handleSubmitForm = async (
    data: KeilaajaCreate | KeilaajaUpdate,
    isEdit: boolean
  ) => {
    setSubmitting(true);
    try {
      if (isEdit && editingKeilaaja) {
        // Päivitetään olemassa oleva keilaaja
        const updatePayload: KeilaajaUpdate = {
          etunimi: data.etunimi,
          sukunimi: data.sukunimi,
          syntymapaiva: toIsoFromFi(data.syntymapaiva),
          aktiivijasen: data.aktiivijasen,
          admin: data.admin,
          kayttajanimi: data.kayttajanimi,
        };

        const updated = await updateKeilaaja(
          editingKeilaaja.keilaajaId,
          updatePayload
        );

        setKeilaajat((prev) =>
          prev.map((k) =>
            k.keilaajaId === editingKeilaaja.keilaajaId ? updated : k
          )
        );
      } else {
        // Lisätään uusi keilaaja
        const createPayload: KeilaajaCreate = {
          etunimi: data.etunimi,
          sukunimi: data.sukunimi,
          syntymapaiva: toIsoFromFi(data.syntymapaiva),
          aktiivijasen: data.aktiivijasen,
          admin: data.admin,
          kayttajanimi: data.kayttajanimi,
          salasana: (data as KeilaajaCreate).salasana,
        };

        const created = await createKeilaaja(createPayload);
        setKeilaajat((prev) => [...prev, created]);
      }

      closeDialog();
    } catch (e) {
      console.log("save keilaaja error:", e);
      Alert.alert(
        "Virhe",
        "Keilaajan tallentaminen epäonnistui. Tarkista tiedot ja yritä uudelleen."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[layout.container, { padding: 16 }]}>
      {/* Otsikko + Lisää-nappi */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Text variant="headlineMedium">Keilaajien hallinta</Text>
        <Button mode="contained" onPress={openAddDialog}>
          Lisää
        </Button>
      </View>

      {/* Lataus / virhe / lista */}
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
          data={keilaajat}
          keyExtractor={(item) => item.keilaajaId.toString()}
          renderItem={({ item }) => (
            <KeilaajaListItem
              keilaaja={item}
              onEdit={openEditDialog}
              onDelete={handleDelete}
            />
          )}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={
            <Text>Ei keilaajia. Lisää ensimmäinen keilaaja.</Text>
          }
        />
      )}

      {/* Lisää/Muokkaa -dialogi */}
      <KeilaajaFormDialog
        visible={dialogVisible}
        editingKeilaaja={editingKeilaaja}
        onDismiss={closeDialog}
        onSubmit={handleSubmitForm}
        submitting={submitting}
      />
    </View>
  );
};

export default ManageKeilaajatScreen;
