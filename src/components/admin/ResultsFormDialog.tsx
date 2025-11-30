import React, { useEffect, useState } from "react";
import {
  Dialog,
  Portal,
  Button,
  Text,
  TextInput,
  Switch,
  HelperText,
} from "react-native-paper";
import { ScrollView, View } from "react-native";
import { Keilaaja } from "../../services/keilaajaService";
import { Gp } from "../../services/gpService";
import {
  addResultsForGp,
  PostResults,
  Results,
} from "../../services/resultsService";
import { HomeRefreshStore, CalendarRefreshStore, StandingsRefreshStore } from "../../store/refreshStore";

type ResultRowForm = {
  keilaajaId: number;
  nimi: string;
  osallistui: boolean;
  sarja1: string; // syötetään stringinä, parsitaan numeroksi
  sarja2: string;
};

type Props = {
  visible: boolean;
  gp: Gp | null;
  keilaajat: Keilaaja[]; // lista seuran kaikista keilaajista
  onDismiss: () => void;
  onSaved: (results: Results[]) => void; // jos haluat päivittää ruudun heti
  submitting: boolean;
  setSubmitting: (value: boolean) => void;
};

const ResultsFormDialog: React.FC<Props> = ({
  visible,
  gp,
  keilaajat,
  onDismiss,
  onSaved,
  submitting,
  setSubmitting,
}) => {
  const [rows, setRows] = useState<ResultRowForm[]>([]);
  const [vyoUnohtui, setVyoUnohtui] = useState(false);

  const setHomeNeedsRefresh = HomeRefreshStore((s) => s.setNeedsRefresh);
  const setCalendarNeedsRefresh = CalendarRefreshStore((s) => s.setNeedsRefresh);
  const setStandingsNeedsRefresh = StandingsRefreshStore((s) => s.setNeedsRefresh);

  // Kun dialogi avataan tai gp/keilaajat muuttuu → alustetaan rivit
  useEffect(() => {
    if (!visible || !gp) return;

    const initialRows: ResultRowForm[] = keilaajat.map((k) => ({
      keilaajaId: k.keilaajaId,
      nimi: `${k.etunimi} ${k.sukunimi}`,
      osallistui: false,
      sarja1: "",
      sarja2: "",
    }));

    setRows(initialRows);
    setVyoUnohtui(false);
  }, [visible, gp, keilaajat]);

  const isFormValid = (): boolean => {
    // Ainakin yksi osallistuja, jolla on molemmat sarjat annettu (numeroina)
    const participating = rows.filter((r) => r.osallistui);
    if (participating.length === 0) return false;

    return participating.every((r) => {
      const s1 = Number(r.sarja1);
      const s2 = Number(r.sarja2);
      return !Number.isNaN(s1) && !Number.isNaN(s2);
    });
  };

  const handleChangeRow = (index: number, patch: Partial<ResultRowForm>) => {
    setRows((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...patch };
      // Jos osallistui=false → tyhjennetään sarjat
      if (patch.osallistui === false) {
        copy[index].sarja1 = "";
        copy[index].sarja2 = "";
      }
      return copy;
    });
  };

  const handleSubmit = async () => {
    if (!gp) return;
    if (!isFormValid()) return;

    setSubmitting(true);
    try {
      const participating = rows.filter((r) => r.osallistui);

      const payload: PostResults = {
        gpId: gp.gpId,
        vyoUnohtui,
        tulokset: participating.map((r) => ({
          keilaajaId: r.keilaajaId,
          sarja1: Number(r.sarja1),
          sarja2: Number(r.sarja2),
        })),
      };

      const saved = await addResultsForGp(payload);

      // Merkataan näkymät likaisiksi
      setHomeNeedsRefresh(true);
      setStandingsNeedsRefresh(true);
      setCalendarNeedsRefresh(true);

      onSaved(saved);
      onDismiss();
    } catch (e) {
      console.log("addResultsForGp error:", e);
      // tänne voi halutessa Alert.alert
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>
          {gp ? `Syötä tulokset GP #${gp.jarjestysnumero}` : "Syötä tulokset"}
        </Dialog.Title>

        <Dialog.Content>
          <Text style={{ marginBottom: 8 }}>
            Merkitse “Osallistui” vain niille, jotka pelasivat GP:n.
          </Text>

          <ScrollView style={{ maxHeight: 400 }}>
            {rows.map((row, index) => (
              <View
                key={row.keilaajaId}
                style={{
                  marginBottom: 8,
                  paddingVertical: 4,
                  borderBottomWidth: 0.5,
                  borderBottomColor: "#E5E7EB",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 4,
                  }}
                >
                  <Text>{row.nimi}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ marginRight: 4 }}>Osallistui</Text>
                    <Switch
                      value={row.osallistui}
                      onValueChange={(value) =>
                        handleChangeRow(index, { osallistui: value })
                      }
                    />
                  </View>
                </View>

                {row.osallistui && (
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 8,
                    }}
                  >
                    <TextInput
                      label="Sarja 1"
                      value={row.sarja1}
                      onChangeText={(text) =>
                        handleChangeRow(index, { sarja1: text })
                      }
                      style={{ flex: 1 }}
                      keyboardType="number-pad"
                    />
                    <TextInput
                      label="Sarja 2"
                      value={row.sarja2}
                      onChangeText={(text) =>
                        handleChangeRow(index, { sarja2: text })
                      }
                      style={{ flex: 1 }}
                      keyboardType="number-pad"
                    />
                  </View>
                )}
              </View>
            ))}
          </ScrollView>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 8,
            }}
          >
            <Switch
              value={vyoUnohtui}
              onValueChange={setVyoUnohtui}
              style={{ marginRight: 8 }}
            />
            <Text>Vyö unohtui</Text>
          </View>

          {!isFormValid() && (
            <HelperText type="error" visible>
              Vähintään yhdelle osallistujalle on annettava molemmat sarjat
              (numeroina).
            </HelperText>
          )}
        </Dialog.Content>

        <Dialog.Actions>
          <Button onPress={onDismiss} disabled={submitting}>
            Peruuta
          </Button>
          <Button
            onPress={handleSubmit}
            loading={submitting}
            disabled={submitting || !isFormValid()}
          >
            Tallenna tulokset
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default ResultsFormDialog;